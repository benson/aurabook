const API_URL = 'https://aurabook-api.brostar.workers.dev';

// Replacement images for failed downloads + fill gaps
const fixes = {
  'frutiger-aero': [
    { id: 'dewHBMtf1S8', desc: 'green leaf with water drops macro' },
  ],
  'retro-futurism': [
    { id: 'UQIHdrzphzY', desc: 'vintage car chrome detail' },
  ],
  'utopian-scholastic': [
    { id: 'lUaaKCUANVI', desc: 'colorful library shelves' },
  ],
  'solarpunk': [
    { id: 'eOpewngf68w', desc: 'green roof architecture' },
  ],
  'brutalism': [
    { id: 'gBFJ9lnK1q0', desc: 'concrete tower block geometric' },
  ],
  'liminal-space': [
    { id: 'SF_GIPZGT2I', desc: 'empty swimming pool' },
    { id: '7BjHTiIclq8', desc: 'empty corridor perspective' },
  ],
  'cyberpunk': [
    { id: 'oqStl2L5oxI', desc: 'tokyo neon signs at night' },
  ],
  'wabi-sabi': [
    { id: 'qqd2gm2cVRk', desc: 'handmade rustic pottery bowl' },
  ],
  'memphis-design': [
    { id: 'jfR5wu2hMI0', desc: 'colorful geometric wall art' },
  ],
  'art-deco': [
    { id: 'sIrVHTOjPWw', desc: 'geometric building with gold accents' },
  ],
};

async function downloadImage(photoId) {
  const url = `https://unsplash.com/photos/${photoId}/download?force=true&w=800`;
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`download failed for ${photoId}: ${res.status}`);
  return await res.arrayBuffer();
}

async function uploadImage(buffer) {
  const res = await fetch(`${API_URL}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/jpeg' },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  return await res.json();
}

async function getAura(id) {
  const res = await fetch(`${API_URL}/auras/${id}`);
  if (!res.ok) throw new Error(`get failed for ${id}`);
  return await res.json();
}

async function updateAura(id, data) {
  const res = await fetch(`${API_URL}/auras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`update failed for ${id}`);
  return await res.json();
}

async function main() {
  for (const [slug, photos] of Object.entries(fixes)) {
    console.log(`\n${slug}:`);
    const aura = await getAura(slug);
    const existingImages = aura.images || [];
    const newIds = [];

    for (const photo of photos) {
      try {
        console.log(`  downloading ${photo.id} (${photo.desc})...`);
        const buffer = await downloadImage(photo.id);
        console.log(`  uploading (${Math.round(buffer.byteLength / 1024)}kb)...`);
        const result = await uploadImage(buffer);
        newIds.push(result.id);
        console.log(`  -> ${result.id}`);
      } catch (e) {
        console.error(`  FAILED: ${e.message}`);
      }
    }

    if (newIds.length > 0) {
      const allImages = [...existingImages, ...newIds];
      await updateAura(slug, {
        images: allImages,
        heroImage: aura.heroImage || allImages[0],
      });
      console.log(`  updated (${allImages.length} total images)`);
    }
  }
  console.log('\ndone!');
}

main().catch(console.error);
