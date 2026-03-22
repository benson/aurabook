const API_URL = 'https://aurabook-api.brostar.workers.dev';

// state
let auras = [];
let currentAura = null;
let editingAura = null;
let editorImages = [];
let editorHeroImage = null;
let editorLinks = [];
let editorColors = [];

// elements
const gridView = document.getElementById('grid-view');
const detailView = document.getElementById('detail-view');
const editorView = document.getElementById('editor-view');
const auraGrid = document.getElementById('aura-grid');
const emptyState = document.getElementById('empty-state');
const detailContent = document.getElementById('detail-content');
const searchInput = document.getElementById('search-input');
const addAuraBtn = document.getElementById('add-aura-btn');
const editAuraBtn = document.getElementById('edit-aura-btn');
const backBtn = document.getElementById('back-btn');
const editorCancel = document.getElementById('editor-cancel');
const editorSave = document.getElementById('editor-save');
const editorName = document.getElementById('editor-name');
const editorDescription = document.getElementById('editor-description');
const editorTags = document.getElementById('editor-tags');
const editorNotes = document.getElementById('editor-notes');
const editorImageUpload = document.getElementById('editor-image-upload');
const editorImageGrid = document.getElementById('editor-image-grid');
const editorLinkList = document.getElementById('editor-link-list');
const addLinkBtn = document.getElementById('add-link-btn');
const editorColorList = document.getElementById('editor-color-list');
const addColorBtn = document.getElementById('add-color-btn');

// helpers

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function imageUrl(id) {
  return `${API_URL}/images/${id}`;
}

function showView(view) {
  gridView.classList.add('hidden');
  detailView.classList.add('hidden');
  editorView.classList.add('hidden');
  view.classList.remove('hidden');
}

// api

async function fetchAuras() {
  try {
    const res = await fetch(`${API_URL}/auras`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchAura(id) {
  const res = await fetch(`${API_URL}/auras/${id}`);
  if (!res.ok) throw new Error('failed to load aura');
  return await res.json();
}

async function saveAura(aura, isNew) {
  const url = isNew ? `${API_URL}/auras` : `${API_URL}/auras/${aura.id}`;
  const method = isNew ? 'POST' : 'PUT';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aura),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'failed to save');
  }
  return await res.json();
}

async function deleteAura(id) {
  const res = await fetch(`${API_URL}/auras/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('failed to delete');
}

async function uploadImage(file) {
  const res = await fetch(`${API_URL}/images`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) throw new Error('failed to upload image');
  return await res.json();
}

// render grid

function renderGrid(filter = '') {
  const filtered = filter
    ? auras.filter(a =>
        a.name.includes(filter) ||
        (a.tags || []).some(t => t.includes(filter))
      )
    : auras;

  if (filtered.length === 0) {
    auraGrid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  auraGrid.innerHTML = filtered.map(a => `
    <div class="aura-card" data-id="${a.id}">
      ${a.heroImage
        ? `<img class="aura-card-image" src="${imageUrl(a.heroImage)}" alt="${a.name}" loading="lazy">`
        : `<div class="aura-card-placeholder">no image</div>`
      }
      <div class="aura-card-name">${a.name}</div>
      <div class="aura-card-tags">${(a.tags || []).map(t => `<span class="tag" data-tag="${t}">${t}</span>`).join('')}</div>
    </div>
  `).join('');

  auraGrid.querySelectorAll('.aura-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) return;
      navigate(card.dataset.id);
    });
  });

  auraGrid.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.value = tag.dataset.tag;
      renderGrid(tag.dataset.tag);
    });
  });
}

// detail view

async function openDetail(id) {
  try {
    currentAura = await fetchAura(id);
  } catch {
    return;
  }

  let html = `
    <h2 class="detail-name">${currentAura.name}</h2>
    <div class="detail-tags">${(currentAura.tags || []).map(t => `<span class="tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join('')}</div>
  `;

  if (currentAura.description) {
    html += `<div class="detail-description">${escapeHtml(currentAura.description)}</div>`;
  }

  if (currentAura.images && currentAura.images.length > 0) {
    html += `<div class="detail-images">`;
    for (const imgId of currentAura.images) {
      html += `<img src="${imageUrl(imgId)}" alt="" loading="lazy" onclick="window.open(this.src, '_blank')">`;
    }
    html += `</div>`;
  }

  if (currentAura.colors && currentAura.colors.length > 0) {
    html += `<div class="detail-section-title">palette</div>`;
    html += `<div class="detail-palette">`;
    for (const c of currentAura.colors) {
      const hex = escapeHtml(c.hex);
      const name = escapeHtml(c.name || '');
      html += `<div class="palette-item" data-hex="${hex}">`;
      html += `<div class="palette-color" style="background:${hex}"></div>`;
      html += `<div class="palette-info">`;
      html += `<span class="palette-name">${name}</span>`;
      html += `<span class="palette-hex">${hex}</span>`;
      html += `</div></div>`;
    }
    html += `</div>`;
  }

  if (currentAura.links && currentAura.links.length > 0) {
    html += `<div class="detail-links"><div class="detail-section-title">links</div>`;
    for (const link of currentAura.links) {
      html += `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label || link.url)}</a>`;
    }
    html += `</div>`;
  }

  if (currentAura.notes) {
    html += `<div class="detail-section-title">notes</div>`;
    html += `<div class="detail-notes">${escapeHtml(currentAura.notes)}</div>`;
  }

  html += `<button type="button" class="text-btn" id="delete-aura-btn" style="color:#c44;margin-top:20px">[delete this aura]</button>`;

  detailContent.innerHTML = html;
  showView(detailView);

  detailContent.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('click', () => {
      const hex = item.dataset.hex;
      navigator.clipboard.writeText(hex).then(() => {
        const hexEl = item.querySelector('.palette-hex');
        hexEl.textContent = 'copied!';
        setTimeout(() => { hexEl.textContent = hex; }, 1000);
      });
    });
  });

  detailContent.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.value = tag.dataset.tag;
      renderGrid(tag.dataset.tag);
      navigate(null);
    });
  });

  document.getElementById('delete-aura-btn').addEventListener('click', async () => {
    if (!confirm('delete this aura?')) return;
    try {
      await deleteAura(currentAura.id);
      auras = auras.filter(a => a.id !== currentAura.id);
      renderGrid();
      navigate(null);
    } catch (e) {
      alert(e.message);
    }
  });
}

// editor

function openEditor(aura) {
  editingAura = aura;
  editorName.value = aura ? aura.name : '';
  editorDescription.value = aura ? aura.description || '' : '';
  editorTags.value = aura ? (aura.tags || []).join(', ') : '';
  editorNotes.value = aura ? aura.notes || '' : '';
  editorImages = aura ? [...(aura.images || [])] : [];
  editorHeroImage = aura ? aura.heroImage || null : null;
  editorLinks = aura ? [...(aura.links || [])] : [];
  editorColors = aura ? (aura.colors || []).map(c => ({...c})) : [];
  renderEditorImages();
  renderEditorLinks();
  renderEditorColors();
  showView(editorView);
}

function renderEditorImages() {
  editorImageGrid.innerHTML = editorImages.map(id => `
    <div class="editor-thumb-wrapper ${id === editorHeroImage ? 'hero' : ''}" data-id="${id}">
      <img src="${imageUrl(id)}" alt="">
      <button type="button" class="editor-thumb-remove" data-id="${id}">&times;</button>
    </div>
  `).join('');

  editorImageGrid.querySelectorAll('.editor-thumb-wrapper').forEach(wrapper => {
    wrapper.querySelector('img').addEventListener('click', () => {
      editorHeroImage = wrapper.dataset.id;
      renderEditorImages();
    });
  });

  editorImageGrid.querySelectorAll('.editor-thumb-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      editorImages = editorImages.filter(i => i !== id);
      if (editorHeroImage === id) editorHeroImage = editorImages[0] || null;
      renderEditorImages();
    });
  });
}

function renderEditorLinks() {
  editorLinkList.innerHTML = editorLinks.map((link, i) => `
    <div class="editor-link-row" data-index="${i}">
      <input type="text" placeholder="url" value="${escapeAttr(link.url)}" data-field="url">
      <input type="text" placeholder="label" value="${escapeAttr(link.label)}" data-field="label">
      <button type="button" class="text-btn" data-remove="${i}">[x]</button>
    </div>
  `).join('');

  editorLinkList.querySelectorAll('.editor-link-row input').forEach(input => {
    input.addEventListener('input', () => {
      const row = input.closest('.editor-link-row');
      const idx = parseInt(row.dataset.index);
      editorLinks[idx][input.dataset.field] = input.value;
    });
  });

  editorLinkList.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      editorLinks.splice(parseInt(btn.dataset.remove), 1);
      renderEditorLinks();
    });
  });
}

function renderEditorColors() {
  editorColorList.innerHTML = editorColors.map((c, i) => `
    <div class="editor-color-row" data-index="${i}">
      <input type="color" value="${escapeAttr(c.hex)}" data-field="hex">
      <input type="text" placeholder="#hex" value="${escapeAttr(c.hex)}" data-field="hex-text" style="width:80px">
      <input type="text" placeholder="name" value="${escapeAttr(c.name)}" data-field="name">
      <button type="button" class="text-btn" data-remove="${i}">[x]</button>
    </div>
  `).join('');

  editorColorList.querySelectorAll('.editor-color-row').forEach(row => {
    const idx = parseInt(row.dataset.index);
    const colorInput = row.querySelector('[data-field="hex"]');
    const hexText = row.querySelector('[data-field="hex-text"]');
    const nameInput = row.querySelector('[data-field="name"]');

    colorInput.addEventListener('input', () => {
      editorColors[idx].hex = colorInput.value;
      hexText.value = colorInput.value;
    });
    hexText.addEventListener('input', () => {
      editorColors[idx].hex = hexText.value;
      if (/^#[0-9a-fA-F]{6}$/.test(hexText.value)) colorInput.value = hexText.value;
    });
    nameInput.addEventListener('input', () => {
      editorColors[idx].name = nameInput.value;
    });
  });

  editorColorList.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      editorColors.splice(parseInt(btn.dataset.remove), 1);
      renderEditorColors();
    });
  });
}

async function handleSave() {
  const name = editorName.value.trim();
  if (!name) return alert('name is required');

  const aura = {
    id: editingAura ? editingAura.id : slugify(name),
    name,
    description: editorDescription.value.trim(),
    tags: editorTags.value.split(',').map(t => t.trim()).filter(Boolean),
    heroImage: editorHeroImage,
    images: editorImages,
    links: editorLinks.filter(l => l.url.trim()),
    colors: editorColors.filter(c => c.hex.trim()),
    notes: editorNotes.value.trim(),
  };

  editorSave.textContent = '[saving...]';
  try {
    const saved = await saveAura(aura, !editingAura);
    const idx = auras.findIndex(a => a.id === saved.id);
    const indexEntry = { id: saved.id, name: saved.name, heroImage: saved.heroImage, tags: saved.tags };
    if (idx >= 0) {
      auras[idx] = indexEntry;
    } else {
      auras.push(indexEntry);
    }
    renderGrid();
    navigate(saved.id);
  } catch (e) {
    alert(e.message);
  }
  editorSave.textContent = '[save]';
}

// utils

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// routing

function navigate(auraId) {
  if (auraId) {
    location.hash = auraId;
  } else {
    history.pushState(null, '', location.pathname + location.search);
    handleRoute();
  }
}

function handleRoute() {
  const hash = location.hash.slice(1);
  if (hash) {
    openDetail(hash);
  } else {
    currentAura = null;
    showView(gridView);
  }
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('popstate', handleRoute);

// events

searchInput.addEventListener('input', () => {
  renderGrid(searchInput.value.toLowerCase().trim());
});

backBtn.addEventListener('click', () => { history.back(); });
addAuraBtn.addEventListener('click', () => openEditor(null));
editAuraBtn.addEventListener('click', () => { if (currentAura) openEditor(currentAura); });
editorCancel.addEventListener('click', () => showView(currentAura ? detailView : gridView));
editorSave.addEventListener('click', handleSave);

addLinkBtn.addEventListener('click', () => {
  editorLinks.push({ url: '', label: '' });
  renderEditorLinks();
});

addColorBtn.addEventListener('click', () => {
  editorColors.push({ hex: '#888888', name: '' });
  renderEditorColors();
});

editorImageUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const result = await uploadImage(file);
    editorImages.push(result.id);
    if (!editorHeroImage) editorHeroImage = result.id;
    renderEditorImages();
  } catch (err) {
    alert('upload failed: ' + err.message);
  }
  editorImageUpload.value = '';
});

// init

async function init() {
  auras = await fetchAuras();
  renderGrid();
  handleRoute();
}

init();
