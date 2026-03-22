const ALLOWED_ORIGINS = ['https://bensonperry.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];
const TELEGRAM_API = 'https://api.telegram.org/bot';
const CLAUDE_API = 'https://api.anthropic.com/v1/messages';

function corsHeaders(request) {
  const origin = request?.headers?.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200, request = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  });
}

function generateId() {
  return 'img_' + crypto.randomUUID().slice(0, 8);
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function indexEntry(aura) {
  const primaryColor = aura.colors?.[0]?.hex || null;
  return { id: aura.id, name: aura.name, heroImage: aura.heroImage, tags: aura.tags, primaryColor };
}

// --- Telegram helpers ---

async function telegramRequest(method, botToken, body) {
  const res = await fetch(`${TELEGRAM_API}${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendMessage(chatId, text, botToken, keyboard = null) {
  const body = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  return telegramRequest('sendMessage', botToken, body);
}

async function answerCallback(callbackId, botToken, text = '') {
  return telegramRequest('answerCallbackQuery', botToken, { callback_query_id: callbackId, text });
}

async function editMessage(chatId, messageId, text, botToken, keyboard = null) {
  const body = { chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML' };
  if (keyboard) body.reply_markup = { inline_keyboard: keyboard };
  return telegramRequest('editMessageText', botToken, body);
}

async function downloadTelegramFile(fileId, botToken) {
  const fileInfo = await telegramRequest('getFile', botToken, { file_id: fileId });
  if (!fileInfo.ok) throw new Error('failed to get file info');
  const filePath = fileInfo.result.file_path;
  const res = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
  if (!res.ok) throw new Error('failed to download file');
  return { buffer: await res.arrayBuffer(), contentType: res.headers.get('Content-Type') || 'image/jpeg' };
}

// --- Claude helpers ---

async function classifyImage(imageBase64, aurasList, apiKey) {
  const auraNames = aurasList.map(a => `- ${a.name} (${a.id})`).join('\n');
  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
          { type: 'text', text: `You are classifying images into aesthetic categories for a reference library called aurabook.

Here are the existing aesthetics:
${auraNames}

Look at this image and determine which aesthetic it best represents. If it clearly matches one, respond with ONLY a JSON object like:
{"aura": "the-aura-id", "confidence": "high"}

If it could match but you're not sure, use:
{"aura": "the-aura-id", "confidence": "low"}

If it doesn't match any existing aesthetic and represents a distinct aesthetic not in the list, suggest a new one:
{"aura": null, "suggestedNewName": "name of the aesthetic", "confidence": "high"}

Respond with ONLY the JSON object, no other text.` }
        ]
      }]
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { aura: null, confidence: 'low' };
  }
}

async function generateAuraContent(name, apiKey) {
  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are writing content for an aesthetic reference library called aurabook. Generate content for the aesthetic "${name}".

Respond with ONLY a JSON object with these fields:
{
  "description": "3 paragraphs describing this aesthetic - its origins, visual characteristics, and cultural significance. plain text, no markdown.",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "colors": [
    {"hex": "#HEXVAL", "name": "color name"},
    {"hex": "#HEXVAL", "name": "color name"},
    {"hex": "#HEXVAL", "name": "color name"},
    {"hex": "#HEXVAL", "name": "color name"},
    {"hex": "#HEXVAL", "name": "color name"}
  ],
  "links": [
    {"url": "https://en.wikipedia.org/wiki/...", "label": "wikipedia"},
    {"url": "https://aesthetics.fandom.com/wiki/...", "label": "aesthetics wiki"}
  ]
}

Use tags from this vocabulary when possible: retro, nostalgic, neon, surreal, tech, optimistic, glossy, nature, futuristic, playful, dark, ornate, architectural, minimal, geometric, textured, urban, domestic, handcraft, eclectic, bold, postmodern, sustainable, mid-century, 1920s, 1950s, 1980s, 1990s, 2000s, 2010s.

Respond with ONLY the JSON object.`
      }]
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { description: '', tags: [], colors: [], links: [] };
  }
}

// --- Image + Aura management ---

async function addImageToAura(auraId, imageId, env) {
  const aura = await env.AURAS.get(`aura:${auraId}`, 'json');
  if (!aura) return null;
  aura.images = aura.images || [];
  aura.images.push(imageId);
  if (!aura.heroImage) aura.heroImage = imageId;
  aura.updatedAt = new Date().toISOString();
  await env.AURAS.put(`aura:${auraId}`, JSON.stringify(aura));

  // update index
  const index = await env.AURAS.get('auras:index', 'json') || [];
  const idx = index.findIndex(a => a.id === auraId);
  const entry = indexEntry(aura);
  if (idx >= 0) index[idx] = entry; else index.push(entry);
  await env.AURAS.put('auras:index', JSON.stringify(index));
  return aura;
}

async function createAura(name, content, imageId, env) {
  const id = slugify(name);
  const now = new Date().toISOString();
  const aura = {
    id,
    name: name.toLowerCase(),
    description: content.description || '',
    tags: content.tags || [],
    colors: content.colors || [],
    heroImage: imageId || null,
    images: imageId ? [imageId] : [],
    links: content.links || [],
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
  await env.AURAS.put(`aura:${id}`, JSON.stringify(aura));

  const index = await env.AURAS.get('auras:index', 'json') || [];
  index.push(indexEntry(aura));
  await env.AURAS.put('auras:index', JSON.stringify(index));
  return aura;
}

// --- Telegram webhook handler ---

async function handleTelegram(request, env) {
  const update = await request.json();

  // Handle callback queries (button presses)
  if (update.callback_query) {
    return handleCallback(update.callback_query, env);
  }

  // Handle photo messages
  const msg = update.message;
  if (!msg?.photo) {
    if (msg?.text === '/start') {
      await sendMessage(msg.chat.id, 'send me a photo to add to aurabook.\n\nadd a caption to specify the aura (e.g. "vaporwave") or use "new: name" to create a new aesthetic.', env.TELEGRAM_BOT_TOKEN);
    }
    return new Response('ok');
  }

  const chatId = msg.chat.id;
  const caption = (msg.caption || '').trim().toLowerCase();
  const botToken = env.TELEGRAM_BOT_TOKEN;

  // Download the largest photo
  const photo = msg.photo[msg.photo.length - 1];
  let fileData;
  try {
    fileData = await downloadTelegramFile(photo.file_id, botToken);
  } catch (e) {
    await sendMessage(chatId, `failed to download: ${e.message}`, botToken);
    return new Response('ok');
  }

  // Store image in KV
  const imageId = generateId();
  await env.AURAS.put(`img:${imageId}`, fileData.buffer, {
    metadata: { contentType: fileData.contentType, size: fileData.buffer.byteLength },
  });

  // Get current auras list
  const aurasList = await env.AURAS.get('auras:index', 'json') || [];

  // --- "new: name" flow ---
  const newMatch = caption.match(/^new(?:\s*aura)?:\s*(.+)$/);
  if (newMatch) {
    const newName = newMatch[1].trim();
    const existing = aurasList.find(a => a.id === slugify(newName));
    if (existing) {
      // aura already exists, just add the image
      await addImageToAura(existing.id, imageId, env);
      await sendMessage(chatId, `"${existing.name}" already exists — added image to it ✓`, botToken);
      return new Response('ok');
    }

    await sendMessage(chatId, `creating "${newName}"...`, botToken);
    const content = await generateAuraContent(newName, env.ANTHROPIC_API_KEY);
    await createAura(newName, content, imageId, env);
    await sendMessage(chatId, `created "${newName}" ✓\n\nhttps://bensonperry.com/aurabook#${slugify(newName)}`, botToken);
    return new Response('ok');
  }

  // --- Explicit aura name in caption ---
  if (caption) {
    const match = aurasList.find(a => a.id === slugify(caption) || a.name === caption);
    if (match) {
      await addImageToAura(match.id, imageId, env);
      await sendMessage(chatId, `added to ${match.name} ✓`, botToken);
      return new Response('ok');
    }
    // caption didn't match any aura — treat as a hint for classification
  }

  // --- Auto-classify with Claude ---
  const imageBase64 = btoa(String.fromCharCode(...new Uint8Array(fileData.buffer)));
  let classification;
  try {
    classification = await classifyImage(imageBase64, aurasList, env.ANTHROPIC_API_KEY);
  } catch {
    classification = { aura: null, confidence: 'low' };
  }

  // Store pending queue item
  const queueId = crypto.randomUUID().slice(0, 8);
  await env.AURAS.put(`queue:${queueId}`, JSON.stringify({
    imageId,
    suggestedAura: classification.aura,
    suggestedNewName: classification.suggestedNewName || null,
    caption,
    chatId,
    createdAt: new Date().toISOString(),
  }));

  // --- Build response ---
  if (classification.aura) {
    const aura = aurasList.find(a => a.id === classification.aura);
    const name = aura?.name || classification.aura;
    const keyboard = [
      [{ text: `✓ ${name}`, callback_data: `approve:${queueId}:${classification.aura}` }],
      [{ text: '→ reassign', callback_data: `reassign:${queueId}` }, { text: '✗ reject', callback_data: `reject:${queueId}` }],
    ];
    await sendMessage(chatId, `looks like <b>${name}</b>`, botToken, keyboard);
  } else if (classification.suggestedNewName) {
    const keyboard = [
      [{ text: `✓ create "${classification.suggestedNewName}"`, callback_data: `create:${queueId}:${classification.suggestedNewName}` }],
      [{ text: '→ assign to existing', callback_data: `reassign:${queueId}` }, { text: '✗ reject', callback_data: `reject:${queueId}` }],
    ];
    await sendMessage(chatId, `doesn't match existing auras. new aesthetic: <b>${classification.suggestedNewName}</b>?`, botToken, keyboard);
  } else {
    const keyboard = [
      [{ text: '→ assign', callback_data: `reassign:${queueId}` }, { text: '✗ reject', callback_data: `reject:${queueId}` }],
    ];
    await sendMessage(chatId, `couldn't classify this one. assign it manually?`, botToken, keyboard);
  }

  return new Response('ok');
}

async function handleCallback(query, env) {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const [action, queueId, ...rest] = data.split(':');
  const queueItem = await env.AURAS.get(`queue:${queueId}`, 'json');

  if (!queueItem) {
    await answerCallback(query.id, botToken, 'expired');
    return new Response('ok');
  }

  if (action === 'approve') {
    const auraId = rest[0];
    await addImageToAura(auraId, queueItem.imageId, env);
    await env.AURAS.delete(`queue:${queueId}`);
    const aura = await env.AURAS.get(`aura:${auraId}`, 'json');
    await editMessage(chatId, messageId, `added to ${aura?.name || auraId} ✓`, botToken);
    await answerCallback(query.id, botToken);
  }

  else if (action === 'reject') {
    await env.AURAS.delete(`img:${queueItem.imageId}`);
    await env.AURAS.delete(`queue:${queueId}`);
    await editMessage(chatId, messageId, 'rejected ✗', botToken);
    await answerCallback(query.id, botToken);
  }

  else if (action === 'create') {
    const newName = rest.join(':');
    await answerCallback(query.id, botToken, 'creating...');
    await editMessage(chatId, messageId, `creating "${newName}"...`, botToken);
    const content = await generateAuraContent(newName, env.ANTHROPIC_API_KEY);
    await createAura(newName, content, queueItem.imageId, env);
    await env.AURAS.delete(`queue:${queueId}`);
    await editMessage(chatId, messageId, `created "${newName}" ✓\nhttps://bensonperry.com/aurabook#${slugify(newName)}`, botToken);
  }

  else if (action === 'reassign') {
    // Show aura picker (paginated if needed, but 28 auras fits in ~7 rows of 4)
    const aurasList = await env.AURAS.get('auras:index', 'json') || [];
    const rows = [];
    for (let i = 0; i < aurasList.length; i += 3) {
      rows.push(aurasList.slice(i, i + 3).map(a => ({
        text: a.name,
        callback_data: `pick:${queueId}:${a.id}`,
      })));
    }
    rows.push([{ text: '✗ cancel', callback_data: `reject:${queueId}` }]);
    await editMessage(chatId, messageId, 'pick an aura:', botToken, rows);
    await answerCallback(query.id, botToken);
  }

  else if (action === 'pick') {
    const auraId = rest[0];
    await addImageToAura(auraId, queueItem.imageId, env);
    await env.AURAS.delete(`queue:${queueId}`);
    const aura = await env.AURAS.get(`aura:${auraId}`, 'json');
    await editMessage(chatId, messageId, `added to ${aura?.name || auraId} ✓`, botToken);
    await answerCallback(query.id, botToken);
  }

  return new Response('ok');
}

// --- Rebuild index (migration helper) ---

async function rebuildIndex(env, request) {
  const index = await env.AURAS.get('auras:index', 'json') || [];
  const newIndex = [];
  for (const entry of index) {
    const aura = await env.AURAS.get(`aura:${entry.id}`, 'json');
    if (aura) newIndex.push(indexEntry(aura));
  }
  await env.AURAS.put('auras:index', JSON.stringify(newIndex));
  return json({ rebuilt: newIndex.length }, 200, request);
}

// --- Main router ---

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // Telegram webhook
      if (method === 'POST' && path === '/telegram') {
        return handleTelegram(request, env);
      }

      // Rebuild index migration
      if (method === 'POST' && path === '/rebuild-index') {
        return rebuildIndex(env, request);
      }

      // GET /auras
      if (method === 'GET' && path === '/auras') {
        const index = await env.AURAS.get('auras:index', 'json') || [];
        return json(index, 200, request);
      }

      // GET /auras/:id
      if (method === 'GET' && path.startsWith('/auras/') && !path.includes('/auras/index')) {
        const id = path.split('/auras/')[1];
        const aura = await env.AURAS.get(`aura:${id}`, 'json');
        if (!aura) return json({ error: 'not found' }, 404, request);
        return json(aura, 200, request);
      }

      // GET /images/:id
      if (method === 'GET' && path.startsWith('/images/')) {
        const id = path.split('/images/')[1];
        const { value, metadata } = await env.AURAS.getWithMetadata(`img:${id}`, 'arrayBuffer');
        if (!value) return json({ error: 'not found' }, 404, request);
        return new Response(value, {
          headers: {
            'Content-Type': metadata?.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000',
            ...corsHeaders(request),
          },
        });
      }

      // POST /auras
      if (method === 'POST' && path === '/auras') {
        const body = await request.json();
        const id = slugify(body.name || '');
        if (!id) return json({ error: 'name is required' }, 400, request);

        const existing = await env.AURAS.get(`aura:${id}`, 'json');
        if (existing) return json({ error: 'aura already exists' }, 409, request);

        const now = new Date().toISOString();
        const aura = {
          id,
          name: body.name,
          description: body.description || '',
          tags: body.tags || [],
          colors: body.colors || null,
          heroImage: body.heroImage || null,
          images: body.images || [],
          links: body.links || [],
          notes: body.notes || '',
          createdAt: now,
          updatedAt: now,
        };

        await env.AURAS.put(`aura:${id}`, JSON.stringify(aura));

        const index = await env.AURAS.get('auras:index', 'json') || [];
        index.push(indexEntry(aura));
        await env.AURAS.put('auras:index', JSON.stringify(index));

        return json(aura, 200, request);
      }

      // PUT /auras/:id
      if (method === 'PUT' && path.startsWith('/auras/')) {
        const id = path.split('/auras/')[1];
        const existing = await env.AURAS.get(`aura:${id}`, 'json');
        if (!existing) return json({ error: 'not found' }, 404, request);

        const body = await request.json();
        const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };

        await env.AURAS.put(`aura:${id}`, JSON.stringify(updated));

        const index = await env.AURAS.get('auras:index', 'json') || [];
        const idx = index.findIndex(a => a.id === id);
        const entry = indexEntry(updated);
        if (idx >= 0) index[idx] = entry; else index.push(entry);
        await env.AURAS.put('auras:index', JSON.stringify(index));

        return json(updated, 200, request);
      }

      // DELETE /auras/:id
      if (method === 'DELETE' && path.startsWith('/auras/')) {
        const id = path.split('/auras/')[1];
        const aura = await env.AURAS.get(`aura:${id}`, 'json');
        if (!aura) return json({ error: 'not found' }, 404, request);

        for (const imgId of (aura.images || [])) {
          await env.AURAS.delete(`img:${imgId}`);
        }
        await env.AURAS.delete(`aura:${id}`);

        const index = await env.AURAS.get('auras:index', 'json') || [];
        await env.AURAS.put('auras:index', JSON.stringify(index.filter(a => a.id !== id)));

        return json({ ok: true }, 200, request);
      }

      // POST /images
      if (method === 'POST' && path === '/images') {
        const contentType = request.headers.get('Content-Type') || 'image/jpeg';
        const buffer = await request.arrayBuffer();
        if (!buffer.byteLength) return json({ error: 'empty body' }, 400, request);

        const id = generateId();
        await env.AURAS.put(`img:${id}`, buffer, {
          metadata: { contentType, size: buffer.byteLength },
        });

        return json({ id }, 200, request);
      }

      // DELETE /images/:id
      if (method === 'DELETE' && path.startsWith('/images/')) {
        const id = path.split('/images/')[1];
        await env.AURAS.delete(`img:${id}`);
        return json({ ok: true }, 200, request);
      }

      return json({ error: 'not found' }, 404, request);
    } catch (e) {
      return json({ error: e.message }, 500, request);
    }
  },
};
