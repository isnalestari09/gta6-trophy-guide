// Leonida Platinum v3 — boot and wiring: loads the trophy data, renders the
// views, and keeps the checklist, filters, spoiler setting and saved
// progress in sync. Progress is saved in localStorage on every change.
import { loadSavedState, saveState, readShareHash, buildShareLink, exportProgress, importProgressFile, DEMO_EARNED } from './store.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissables, renderAbout } from './views.js';
import { computeStats } from './stats.js';

const state = loadSavedState();
const params = new URLSearchParams(location.search);

// A share link in the hash overrides saved progress for this visit.
const shared = readShareHash();
if (shared) state.earned = shared;
if (params.get('demo') === '1') state.earned = [...DEMO_EARNED];
if (params.get('spoilers') === 'on') state.spoilers = true;

let trophies = [];
let selectedId = null;
const filters = { query: '', grade: '', kind: '', missableOnly: false, earnedOnly: false };

function earnedSet() {
  return new Set(state.earned);
}

function refreshProgress() {
  const stats = computeStats(trophies, earnedSet());
  document.getElementById('earnedCount').textContent = String(stats.earned);
  document.getElementById('progressFill').style.width = `${stats.percent}%`;
  document.getElementById('progressNote').textContent =
    stats.earned >= stats.total
      ? 'Platinum earned — congratulations, Leonida Legend.'
      : `${stats.earned} of ${stats.total} trophies · about ${stats.remainingHours} hours left to the platinum`;
}

function renderAll() {
  renderChecklist(trophies, state, filters, selectTrophy, selectedId);
  renderDetail(trophies.find((t) => t.id === selectedId) ?? null, state);
  renderRoadmap(trophies, state);
  renderMissables(trophies, state);
  renderAbout(trophies, state);
  refreshProgress();
}

function selectTrophy(id, options = {}) {
  if (options.toggleEarned) {
    const set = earnedSet();
    if (set.has(id)) set.delete(id);
    else set.add(id);
    state.earned = [...set];
    saveState(state);
  }
  selectedId = id;
  renderAll();
}

function showView(name) {
  for (const button of document.querySelectorAll('#tabs .tab')) {
    button.classList.toggle('active', button.dataset.view === name);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${name}`;
  }
}

function readFiltersFromDom() {
  filters.query = document.getElementById('searchInput').value;
  filters.grade = document.getElementById('gradeFilter').value;
  filters.kind = document.getElementById('kindFilter').value;
  filters.missableOnly = document.getElementById('missableOnly').checked;
  filters.earnedOnly = document.getElementById('earnedOnly').checked;
  state.spoilers = document.getElementById('spoilerToggle').checked;
  saveState(state);
}

async function boot() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies;

  document.getElementById('spoilerToggle').checked = state.spoilers;
  for (const button of document.querySelectorAll('#tabs .tab')) {
    button.addEventListener('click', () => showView(button.dataset.view));
  }
  for (const id of ['searchInput', 'gradeFilter', 'kindFilter', 'missableOnly', 'earnedOnly', 'spoilerToggle']) {
    document.getElementById(id).addEventListener('input', () => {
      readFiltersFromDom();
      renderAll();
    });
  }
  document.addEventListener('leonida:toggle-earned', (event) => selectTrophy(event.detail, { toggleEarned: true }));

  document.getElementById('exportBtn').addEventListener('click', () => {
    exportProgress(state);
    document.getElementById('saveStatus').textContent = 'Progress exported as a JSON file.';
  });
  document.getElementById('importInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProgressFile(file);
      state.earned = imported.earned;
      state.spoilers = imported.spoilers;
      document.getElementById('spoilerToggle').checked = state.spoilers;
      saveState(state);
      renderAll();
      document.getElementById('saveStatus').textContent = `Imported ${imported.earned.length} earned trophies.`;
    } catch {
      document.getElementById('saveStatus').textContent = 'That file could not be imported.';
    }
    event.target.value = '';
  });
  document.getElementById('shareBtn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildShareLink(state.earned));
      document.getElementById('saveStatus').textContent = 'Share link copied — earned trophies are in the link.';
    } catch {
      document.getElementById('saveStatus').textContent = buildShareLink(state.earned);
    }
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    state.earned = [];
    saveState(state);
    renderAll();
    document.getElementById('saveStatus').textContent = 'Progress reset.';
  });

  // Deep links: #trophy=17 opens that trophy's guide; #roadmap / #missables
  // open those views; #sources scrolls the open guide to its sources.
  const hashTrophy = location.hash.match(/trophy=(\d+)/);
  if (hashTrophy) selectedId = Number(hashTrophy[1]);
  if (location.hash.includes('roadmap')) showView('roadmap');
  if (location.hash.includes('missables')) showView('missables');
  renderAll();
  if (location.hash.includes('sources')) {
    const pane = document.getElementById('detailPane');
    const sources = pane.querySelector('.sources');
    if (sources) pane.scrollTop = sources.offsetTop - pane.offsetTop - 10;
  }
}

boot();
