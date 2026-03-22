const API_URL = 'https://aurabook-api.brostar.workers.dev';

// Verified Unsplash photo IDs from browser search
const fixes = {
  'liminal-space': ['dS_zvn8-YH4', 'HizBoUoQcl4'],
  'brutalism': ['MPWbGMrZ6eo'],
  'art-deco': ['xlxam341W0g'],
  'retro-futurism': ['p0j-mE6mGo4'],
  'wabi-sabi': ['zTKs8sngOpQ'],
  'frutiger-aero': ['d8LP0fzYNY0'],
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
  for (const [slug, photoIds] of Object.entries(fixes)) {
    console.log(`\n${slug}:`);
    const aura = await getAura(slug);
    const existingImages = aura.images || [];
    const newIds = [];

    for (const photoId of photoIds) {
      try {
        console.log(`  downloading ${photoId}...`);
        const buffer = await downloadImage(photoId);
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
