// Leonida Platinum: boot, checklist rendering, filters, spoiler setting,
// detail pane, roadmap and missables views. All data comes from
// data/trophies.json; progress lives in localStorage via store.js.
import { loadEarned, saveEarned, exportEarned, importEarned } from './store.js';
import { renderRoadmap } from './roadmap.js';

export const SOURCES = {
  exophase: { name: 'Exophase — GTA VI trophy list (names, descriptions, grades)', url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/' },
  psnprofiles: { name: 'PSNProfiles — GTA VI trophies (grades and PSN counts)', url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi' },
  powerpyx: { name: 'PowerPyx — GTA VI Trophy Guide & Roadmap (difficulty, time, missables, 100% checklist)', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/' },
  gtazone: { name: 'GTA Zone — GTA 6 Trophy List (missable and hidden-trophy notes)', url: 'https://gta-zone.com/news/gta-6-trophies-achievements/' },
};

const KIND_LABELS = { story: 'Story', missable: 'Missable', collectible: 'Collectible', activity: 'Activity' };

const state = {
  trophies: [],
  earned: loadEarned(),
  kind: 'all',
  grade: 'all',
  query: '',
  earnedOnly: false,
  spoiler: true,
  selected: null,
};

const rowsEl = document.getElementById('rows');
const detailEl = document.getElementById('detail');

function isStoryHidden(trophy) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function visibleTrophies() {
  const q = state.query.trim().toLowerCase();
  return state.trophies.filter((t) => {
    if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.earnedOnly && !state.earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderProgress() {
  document.getElementById('earnedCount').textContent = String(state.earned.size);
  document.getElementById('progressFill').style.width = `${(state.earned.size / state.trophies.length) * 100}%`;
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of state.trophies) if (state.earned.has(t.id)) counts[t.grade] += 1;
  document.getElementById('gradeCounts').textContent =
    `${counts.platinum} platinum · ${counts.gold} gold · ${counts.silver} silver · ${counts.bronze} bronze earned`;
}

function renderChecklist() {
  const list = visibleTrophies();
  rowsEl.replaceChildren();
  for (const t of list) {
    const tr = document.createElement('tr');
    tr.dataset.id = String(t.id);
    if (state.earned.has(t.id)) tr.classList.add('earned');
    if (state.selected === t.id) tr.classList.add('selected');

    const earnedCell = document.createElement('td');
    earnedCell.className = 'c-earned';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'tick';
    box.checked = state.earned.has(t.id);
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      if (box.checked) state.earned.add(t.id);
      else state.earned.delete(t.id);
      saveEarned(state.earned);
      renderAll();
    });
    earnedCell.append(box);

    const nameCell = document.createElement('td');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = isStoryHidden(t) ? 'Hidden story trophy' : t.name;
    const desc = document.createElement('div');
    desc.className = isStoryHidden(t) ? 'tdesc hidden-spoiler' : 'tdesc';
    desc.textContent = isStoryHidden(t)
      ? 'Spoiler hidden until earned — turn the spoiler setting off to reveal it.'
      : t.description;
    nameCell.append(name, desc);

    const gradeCell = document.createElement('td');
    gradeCell.className = 'c-grade';
    const grade = document.createElement('span');
    grade.className = `grade-tag grade-${t.grade}`;
    grade.textContent = t.grade;
    gradeCell.append(grade);

    const kindCell = document.createElement('td');
    kindCell.className = 'c-kind';
    const kind = document.createElement('span');
    kind.className = 'kind-tag';
    kind.textContent = KIND_LABELS[t.kind] ?? t.kind;
    kindCell.append(kind);
    if (t.missable) {
      const flag = document.createElement('div');
      flag.className = 'missable-flag';
      flag.textContent = '⚠ Missable';
      kindCell.append(flag);
    }

    tr.append(earnedCell, nameCell, gradeCell, kindCell);
    tr.addEventListener('click', () => {
      state.selected = t.id;
      renderChecklist();
      renderDetail(t);
    });
    rowsEl.append(tr);
  }
  document.getElementById('resultCount').textContent =
    `${list.length} of ${state.trophies.length} trophies shown · ${state.earned.size} earned`;
}

function renderDetail(trophy) {
  if (!trophy) {
    detailEl.innerHTML = '<p class="detail-empty">Select a trophy to read its guide.</p>';
    return;
  }
  detailEl.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = isStoryHidden(trophy) ? 'Hidden story trophy' : trophy.name;
  const grade = document.createElement('span');
  grade.className = `grade-tag grade-${trophy.grade}`;
  grade.textContent = trophy.grade;
  const meta = document.createElement('p');
  meta.className = 'count';
  meta.textContent = `${KIND_LABELS[trophy.kind] ?? trophy.kind} trophy · roadmap stage ${trophy.stage} of 5${trophy.missable ? ' · ⚠ possibly missable' : ''}`;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = isStoryHidden(trophy)
    ? 'Official description hidden by the spoiler setting.'
    : `Official description: “${trophy.description}”`;
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = isStoryHidden(trophy)
    ? 'Earn this trophy to reveal its guide, or turn the spoiler setting off.'
    : trophy.guide;
  detailEl.append(title, grade, meta, official, guide);

  if (trophy.count) {
    const count = document.createElement('p');
    count.className = 'count';
    count.textContent = `PSN tracks a count for this one: ${trophy.count}.`;
    detailEl.append(count);
  }
  if (state.earned.has(trophy.id)) {
    const note = document.createElement('p');
    note.className = 'earned-note';
    note.textContent = '✓ Earned — ticked in your tracker.';
    detailEl.append(note);
  }
  const sources = document.createElement('div');
  sources.className = 'sources';
  const heading = document.createElement('strong');
  heading.textContent = 'Sources';
  const list = document.createElement('ul');
  for (const key of trophy.sources) {
    const source = SOURCES[key];
    if (!source) continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link);
    list.append(item);
  }
  sources.append(heading, list);
  detailEl.append(sources);
}

function renderMissables() {
  const trophy = state.trophies.find((t) => t.missable);
  const card = document.getElementById('missableCard');
  if (!trophy) return;
  card.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = `⚠ ${trophy.name} — the only possibly missable trophy`;
  const desc = document.createElement('p');
  desc.textContent = `Official description: “${trophy.description}”`;
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  card.append(title, desc, guide);
}

function renderSources() {
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const source of Object.values(SOURCES)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link);
    list.append(item);
  }
}

function renderAll() {
  renderProgress();
  renderChecklist();
  renderRoadmap(state.trophies, state.earned, document.getElementById('stages'));
  renderMissables();
  const selected = state.trophies.find((t) => t.id === state.selected);
  if (selected) renderDetail(selected);
}

function bindToolbar() {
  document.getElementById('search').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderChecklist();
  });
  for (const chip of document.querySelectorAll('.chip')) {
    chip.addEventListener('click', () => {
      for (const other of document.querySelectorAll('.chip')) other.classList.remove('active');
      chip.classList.add('active');
      state.kind = chip.dataset.kind;
      renderChecklist();
    });
  }
  document.getElementById('grade').addEventListener('change', (event) => {
    state.grade = event.target.value;
    renderChecklist();
  });
  document.getElementById('earnedOnly').addEventListener('change', (event) => {
    state.earnedOnly = event.target.checked;
    renderChecklist();
  });
  document.getElementById('spoiler').addEventListener('change', (event) => {
    state.spoiler = event.target.checked;
    renderChecklist();
    const selected = state.trophies.find((t) => t.id === state.selected);
    if (selected) renderDetail(selected);
  });
  document.getElementById('export').addEventListener('click', () => exportEarned(state.earned));
  document.getElementById('import').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state.earned = await importEarned(file);
      saveEarned(state.earned);
      renderAll();
    } catch {
      alert('That file is not a Leonida Platinum progress export.');
    }
    event.target.value = '';
  });
}

function bindTabs() {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => {
      for (const other of document.querySelectorAll('.tab')) other.classList.remove('active');
      tab.classList.add('active');
      for (const view of document.querySelectorAll('.view')) view.classList.remove('active');
      document.getElementById(`view-${tab.dataset.view}`).classList.add('active');
      document.getElementById('toolbar').style.display = tab.dataset.view === 'checklist' ? '' : 'none';
    });
  }
}

async function boot() {
  const doc = await (await fetch('data/trophies.json')).json();
  state.trophies = doc.trophies;
  state.spoiler = document.getElementById('spoiler').checked;
  bindToolbar();
  bindTabs();
  renderSources();
  renderAll();
}

boot();
