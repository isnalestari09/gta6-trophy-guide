// Leonida Platinum v3 — renders every view: checklist, trophy detail pane,
// roadmap, missables and the about page.
import { applyFilters, isSpoilerHidden } from './filters.js';
import { ROADMAP_PHASES, phaseProgress, nextUnfinishedPhase } from './roadmap.js';
import { computeStats, formatTimeEstimate } from './stats.js';

const KIND_LABELS = {
  story: 'Story',
  side: 'Strangers & side',
  activities: 'Activities',
  collectibles: 'Collectibles',
  'open-world': 'Open world',
  heist: 'Heists & crime',
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeBadge(grade) {
  return el('span', `badge ${grade}`, grade);
}

export function renderChecklist(trophies, state, filters, onSelect, selectedId) {
  const list = document.getElementById('trophyList');
  const earnedSet = new Set(state.earned);
  const shown = applyFilters(trophies, filters, earnedSet);
  list.replaceChildren();
  for (const trophy of shown) {
    const row = el('button', 'trophy-row');
    row.type = 'button';
    if (trophy.id === selectedId) row.classList.add('selected');
    if (earnedSet.has(trophy.id)) row.classList.add('earned');
    row.addEventListener('click', () => onSelect(trophy.id));

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = earnedSet.has(trophy.id);
    check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    check.addEventListener('click', (event) => event.stopPropagation());
    check.addEventListener('change', () => onSelect(trophy.id, { toggleEarned: true }));
    row.append(check);

    const body = el('div');
    const hidden = isSpoilerHidden(trophy, state.spoilers, earnedSet);
    body.append(el('div', 'trophy-name', hidden ? 'Hidden story trophy' : trophy.name));
    body.append(el('div', 'trophy-desc', hidden ? 'Earn it to reveal its name and description.' : trophy.description));
    const meta = el('div', 'trophy-meta');
    meta.append(gradeBadge(trophy.grade));
    meta.append(el('span', 'badge kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
    if (trophy.missable) meta.append(el('span', 'badge missable', 'Missable'));
    if (trophy.hidden) meta.append(el('span', 'badge hidden', 'Hidden'));
    if (trophy.target) meta.append(el('span', 'target', `Target: ${trophy.target}`));
    body.append(meta);
    row.append(body);

    const diff = el('span', 'target', `★ ${trophy.difficulty}/5 · ${trophy.time}`);
    row.append(diff);
    list.append(row);
  }
  const line = document.getElementById('resultLine');
  line.textContent = shown.length === trophies.length
    ? `Showing all ${trophies.length} trophies.`
    : `Showing ${shown.length} of ${trophies.length} trophies.`;
}

export function renderDetail(trophy, state) {
  const pane = document.getElementById('detailPane');
  const earnedSet = new Set(state.earned);
  pane.replaceChildren();
  if (!trophy) {
    pane.append(el('p', 'detail-empty', 'Pick a trophy to see its full guide, sources and steps.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.spoilers, earnedSet);
  pane.append(el('h3', null, hidden ? 'Hidden story trophy' : trophy.name));
  const facts = el('div', 'facts');
  facts.append(gradeBadge(trophy.grade));
  facts.append(el('span', 'badge kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.missable) facts.append(el('span', 'badge missable', 'Missable'));
  if (trophy.hidden) facts.append(el('span', 'badge hidden', 'Hidden on PSN'));
  pane.append(facts);
  pane.append(el('p', null, hidden ? 'This is a story trophy. Turn spoilers off, or earn it, to see its description and guide.' : trophy.description));
  if (!hidden) {
    pane.append(el('p', null, `Difficulty ${trophy.difficulty}/5 · about ${trophy.time}.`));
    pane.append(el('p', 'guide-text', trophy.guide));
    if (trophy.steps?.length) {
      pane.append(el('h3', null, 'Steps'));
      const steps = el('ol', 'steps');
      for (const step of trophy.steps) steps.append(el('li', null, step));
      pane.append(steps);
    }
    if (trophy.sources?.length) {
      pane.append(el('h3', null, 'Sources'));
      const sources = el('ul', 'sources');
      for (const source of trophy.sources) sources.append(el('li', null, source));
      pane.append(sources);
    }
    if (trophy.tips) {
      pane.append(el('h3', null, 'Tips'));
      pane.append(el('p', null, trophy.tips));
    }
  }
  const toggle = el('button', 'tab');
  toggle.type = 'button';
  toggle.textContent = earnedSet.has(trophy.id) ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('leonida:toggle-earned', { detail: trophy.id }));
  });
  pane.append(toggle);
}

export function renderRoadmap(trophies, state) {
  const earnedSet = new Set(state.earned);
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const list = document.getElementById('roadmapList');
  list.replaceChildren();
  for (const phase of ROADMAP_PHASES) {
    const { earned, total } = phaseProgress(phase, earnedSet);
    const card = el('article', 'phase');
    const head = el('div', 'phase-head');
    head.append(el('h3', null, `Phase ${phase.phase} — ${phase.title}`));
    head.append(el('span', 'phase-count', `${earned}/${total} earned`));
    card.append(head);
    card.append(el('p', null, phase.when));
    const points = el('ul');
    for (const tip of phase.advice) points.append(el('li', null, tip));
    card.append(points);
    const names = phase.trophyIds.map((id) => byId.get(id)?.name ?? `#${id}`).join(' · ');
    card.append(el('p', 'target', `Trophies: ${names}`));
    list.append(card);
  }
  const next = nextUnfinishedPhase(earnedSet);
  const nextUp = document.getElementById('nextUp');
  nextUp.replaceChildren();
  if (next) {
    nextUp.append(el('h3', null, 'Next up'));
    nextUp.append(el('p', null, `Phase ${next.phase} — ${next.title}. ${next.advice[0]}`));
  } else {
    nextUp.append(el('h3', null, 'Platinum complete'));
    nextUp.append(el('p', null, 'Every phase is done. Vice Got a Price! is yours.'));
  }
  document.getElementById('timeEstimate').textContent =
    formatTimeEstimate(computeStats(trophies, earnedSet));
}

export function renderMissables(trophies, state) {
  const list = document.getElementById('missablesList');
  const earnedSet = new Set(state.earned);
  list.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  for (const trophy of missable) {
    const card = el('article', 'missable-card');
    card.append(el('h3', null, `${trophy.name} — the only missable trophy`));
    card.append(el('p', null, trophy.description));
    card.append(el('p', 'guide-text', trophy.guide));
    if (trophy.steps?.length) {
      const steps = el('ol', 'steps');
      for (const step of trophy.steps) steps.append(el('li', null, step));
      card.append(steps);
    }
    card.append(el('p', null, earnedSet.has(trophy.id)
      ? 'Earned — you are safe.'
      : 'Not earned yet — do the meditation spots as they appear in the story.'));
    list.append(card);
  }
  const safe = el('p', null,
    `The other ${trophies.length - missable.length} trophies can all be earned after the story in free roam. ` +
    'Nothing else in the list is missable: story trophies unlock by playing missions, and every counter, ' +
    'collectible and activity stays available once the map is open.');
  list.append(safe);
}

export function renderAbout(trophies, state) {
  const stats = computeStats(trophies, new Set(state.earned));
  const body = document.getElementById('aboutBody');
  body.replaceChildren();
  body.append(el('p', 'lede',
    'Leonida Platinum is a free, open-source, offline guide and tracker for the 55 PlayStation 5 ' +
    'trophies of Grand Theft Auto VI. It works from its own files with the network off: no account, ' +
    'no sync, no ads. Your progress lives only in this browser.'));
  const grid = el('div', 'stat-grid');
  const stat = (value, label) => {
    const card = el('div', 'stat');
    card.append(el('b', null, String(value)));
    card.append(el('span', null, label));
    return card;
  };
  grid.append(stat(stats.total, 'trophies in the official list'));
  grid.append(stat(stats.byGrade.platinum ?? 0, 'platinum · 2 gold · 6 silver · 46 bronze'));
  grid.append(stat(28, 'hidden on PSN until earned'));
  grid.append(stat(1, 'missable trophy'));
  grid.append(stat('~250 h', 'typical time to platinum'));
  grid.append(stat(stats.percent + '%', 'of the list you have earned'));
  body.append(grid);
  body.append(el('h3', null, 'Where the facts come from'));
  const sources = el('ul');
  for (const item of [
    'Exophase — the official trophy names, descriptions and grades, as PlayStation publishes them (exophase.com/game/grand-theft-auto-vi-psn/trophies/).',
    'PSNProfiles — PSN progress targets for the counted trophies, e.g. 42 Shooting Range golds, 250 stunts, 52 map regions (psnprofiles.com/trophies/43531-grand-theft-auto-vi).',
    'PushSquare — GTA 6 Trophy Guide & Roadmap: method and time estimates, checked against the official descriptions.',
    'PowerPyx and GTA Zone — further reading for specific steps; every guide below names its sources beside it.',
  ]) sources.append(el('li', null, item));
  body.append(sources);
  body.append(el('h3', null, 'A note on hidden trophies'));
  body.append(el('p', null,
    'PlayStation hides 28 of the 55 trophies until they are earned, but the live list pages do not ' +
    'expose a hidden marker per trophy. So this guide assigns hidden flags by a documented rule: the ' +
    '12 story trophies, the 5 stranger-finale trophies, 4 trophies whose descriptions give nothing away, ' +
    'and 7 secret open-world trophies — 28 in all. The gate does not check hidden flags; this is a ' +
    'judgement call, stated plainly rather than presented as a verified PSN field.'));
  body.append(el('h3', null, 'A note on places'));
  body.append(el('p', null,
    'Where an official description does not pin down a place, the guide says so instead of inventing one. ' +
    'Guides are written in our own words for this entry; sources are cited, never copied.'));
}
