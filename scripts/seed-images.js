const API_URL = 'https://aurabook-api.brostar.workers.dev';

// Map of aura slug -> array of Unsplash photo IDs (free license, curated for each aesthetic)
const imageMap = {
  'vaporwave': [
    { id: 'Tn5gnXGI3hI', desc: 'synthwave sunset grid' },
    { id: 'LoeVFJR1Py8', desc: 'neon storefront at night' },
  ],
  'frutiger-aero': [
    { id: 'sNPYQa3bL4k', desc: 'nature with sunlight through leaves' },
    { id: 'Q1p7bh3SHj8', desc: 'water droplets on glass' },
  ],
  'y2k-futurism': [
    { id: 'iar-afB0QQw', desc: 'chrome metallic abstract' },
    { id: 'cZWZjymwI9o', desc: 'holographic iridescent surface' },
  ],
  'retro-futurism': [
    { id: 'Qbs6liCKzcU', desc: 'retro space age architecture' },
    { id: '1lfI7wkGWZ4', desc: 'vintage rocket illustration style' },
  ],
  'utopian-scholastic': [
    { id: 'YLSwjSy7stw', desc: 'colorful books stacked' },
    { id: '1Shk_PkNkNw', desc: 'globe and educational setting' },
  ],
  'dark-academia': [
    { id: 'NIJuEQw0RKg', desc: 'old library with dark wood' },
    { id: 'IOzk8YKDhYg', desc: 'vintage books and candle' },
  ],
  'solarpunk': [
    { id: 'M2Kxb80gqcc', desc: 'vertical garden on building' },
    { id: 'rumysa-_dI4', desc: 'solar panels with nature' },
  ],
  'brutalism': [
    { id: 'RgKmrxpI9QY', desc: 'brutalist concrete building' },
    { id: 'auIbTAcSH6E', desc: 'raw concrete geometric architecture' },
  ],
  'cottagecore': [
    { id: 'cixohzDpNIo', desc: 'cottage with wildflower garden' },
    { id: 'yBzrPGLjMQw', desc: 'rustic bread and linen' },
  ],
  'liminal-space': [
    { id: 'wSTCaQTNEOA', desc: 'empty hallway fluorescent lights' },
    { id: 'sV2QGT2WFAE', desc: 'empty parking garage' },
  ],
  'cyberpunk': [
    { id: 'bJhT9WMird4', desc: 'neon city street at night' },
    { id: 'xII7efH1G6o', desc: 'rainy neon-lit urban scene' },
  ],
  'wabi-sabi': [
    { id: 'rsJtMXn4oeE', desc: 'handmade ceramic pottery' },
    { id: '-1_RZL8BGBM', desc: 'weathered wood texture' },
  ],
  'memphis-design': [
    { id: 'RnCPiXixooY', desc: 'bold geometric colorful shapes' },
    { id: 'iGSC0fIveLs', desc: 'colorful abstract pattern' },
  ],
  'nordic-minimalism': [
    { id: 'MP0bgaS_d1c', desc: 'scandinavian minimal interior' },
    { id: 'R-LK3sqLiBw', desc: 'clean white interior with wood' },
  ],
  'art-deco': [
    { id: 'okjqKcynFvY', desc: 'art deco building facade' },
    { id: '3wylDrjxH-E', desc: 'geometric gold pattern' },
  ],
  'global-village-coffeehouse': [
    { id: 'tNALoIZhqVM', desc: 'cozy coffee shop interior' },
    { id: '6VhPY27jdps', desc: 'latte art and warm ambiance' },
  ],
};

async function downloadImage(photoId) {
  const url = `https://unsplash.com/photos/${photoId}/download?force=true&w=800`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`download failed for ${photoId}: ${res.status}`);
  return await res.arrayBuffer();
}

async function uploadImage(buffer, contentType = 'image/jpeg') {
  const res = await fetch(`${API_URL}/images`, {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  return await res.json();
}

async function updateAura(id, data) {
  const res = await fetch(`${API_URL}/auras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`update failed for ${id}: ${res.status}`);
  return await res.json();
}

async function processAura(slug, photos) {
  console.log(`\n${slug}:`);
  const imageIds = [];

  for (const photo of photos) {
    try {
      console.log(`  downloading ${photo.id} (${photo.desc})...`);
      const buffer = await downloadImage(photo.id);
      console.log(`  uploading (${Math.round(buffer.byteLength / 1024)}kb)...`);
      const result = await uploadImage(buffer);
      imageIds.push(result.id);
      console.log(`  -> ${result.id}`);
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
    }
  }

  if (imageIds.length > 0) {
    console.log(`  updating aura with ${imageIds.length} images...`);
    await updateAura(slug, {
      images: imageIds,
      heroImage: imageIds[0],
    });
    console.log(`  done`);
  }
}

async function main() {
  console.log('seeding images for all aesthetics...');

  for (const [slug, photos] of Object.entries(imageMap)) {
    await processAura(slug, photos);
  }

  console.log('\nall done!');
}

main().catch(console.error);
