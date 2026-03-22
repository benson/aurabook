const ALLOWED_ORIGINS = ['https://bensonperry.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];

function corsHeaders(request) {
  const origin = request?.headers?.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(data, status = 200, request = null) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  });
}

function isAdmin(request, env) {
  const auth = request.headers.get('Authorization');
  return auth === `Bearer ${env.ADMIN_SECRET}`;
}

function generateId() {
  return 'img_' + crypto.randomUUID().slice(0, 8);
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // public: GET /auras
      if (method === 'GET' && path === '/auras') {
        const index = await env.AURAS.get('auras:index', 'json') || [];
        return json(index, 200, request);
      }

      // public: GET /auras/:id
      if (method === 'GET' && path.startsWith('/auras/')) {
        const id = path.split('/auras/')[1];
        const aura = await env.AURAS.get(`aura:${id}`, 'json');
        if (!aura) return json({ error: 'not found' }, 404, request);
        return json(aura, 200, request);
      }

      // public: GET /images/:id
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

      // admin: POST /admin/auras
      if (method === 'POST' && path === '/admin/auras') {
        if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, request);
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
          heroImage: body.heroImage || null,
          images: body.images || [],
          links: body.links || [],
          notes: body.notes || '',
          createdAt: now,
          updatedAt: now,
        };

        await env.AURAS.put(`aura:${id}`, JSON.stringify(aura));

        // update index
        const index = await env.AURAS.get('auras:index', 'json') || [];
        index.push({ id: aura.id, name: aura.name, heroImage: aura.heroImage, tags: aura.tags });
        await env.AURAS.put('auras:index', JSON.stringify(index));

        return json(aura, 200, request);
      }

      // admin: PUT /admin/auras/:id
      if (method === 'PUT' && path.startsWith('/admin/auras/')) {
        if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, request);
        const id = path.split('/admin/auras/')[1];
        const existing = await env.AURAS.get(`aura:${id}`, 'json');
        if (!existing) return json({ error: 'not found' }, 404, request);

        const body = await request.json();
        const updated = {
          ...existing,
          ...body,
          id, // keep original id
          updatedAt: new Date().toISOString(),
        };

        await env.AURAS.put(`aura:${id}`, JSON.stringify(updated));

        // update index
        const index = await env.AURAS.get('auras:index', 'json') || [];
        const idx = index.findIndex(a => a.id === id);
        const entry = { id: updated.id, name: updated.name, heroImage: updated.heroImage, tags: updated.tags };
        if (idx >= 0) index[idx] = entry; else index.push(entry);
        await env.AURAS.put('auras:index', JSON.stringify(index));

        return json(updated, 200, request);
      }

      // admin: DELETE /admin/auras/:id
      if (method === 'DELETE' && path.startsWith('/admin/auras/')) {
        if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, request);
        const id = path.split('/admin/auras/')[1];
        const aura = await env.AURAS.get(`aura:${id}`, 'json');
        if (!aura) return json({ error: 'not found' }, 404, request);

        // delete images
        for (const imgId of (aura.images || [])) {
          await env.AURAS.delete(`img:${imgId}`);
        }

        await env.AURAS.delete(`aura:${id}`);

        // update index
        const index = await env.AURAS.get('auras:index', 'json') || [];
        const filtered = index.filter(a => a.id !== id);
        await env.AURAS.put('auras:index', JSON.stringify(filtered));

        return json({ ok: true }, 200, request);
      }

      // admin: POST /admin/images
      if (method === 'POST' && path === '/admin/images') {
        if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, request);
        const contentType = request.headers.get('Content-Type') || 'image/jpeg';
        const buffer = await request.arrayBuffer();
        if (!buffer.byteLength) return json({ error: 'empty body' }, 400, request);

        const id = generateId();
        await env.AURAS.put(`img:${id}`, buffer, {
          metadata: { contentType, size: buffer.byteLength },
        });

        return json({ id }, 200, request);
      }

      // admin: DELETE /admin/images/:id
      if (method === 'DELETE' && path.startsWith('/admin/images/')) {
        if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, request);
        const id = path.split('/admin/images/')[1];
        await env.AURAS.delete(`img:${id}`);
        return json({ ok: true }, 200, request);
      }

      return json({ error: 'not found' }, 404, request);
    } catch (e) {
      return json({ error: e.message }, 500, request);
    }
  },
};
