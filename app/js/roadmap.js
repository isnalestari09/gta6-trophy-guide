// Roadmap to the platinum: five stages in order, built from the official
// descriptions. Each stage lists the trophy ids it covers and the order to
// earn them in. Stage 1 holds the one missable trophy, so it comes first.
export const ROADMAP_STAGES = [
  {
    number: 1,
    name: 'Story first, and the one missable',
    text: 'Play Chapters 1 to 4 and the final mission, and take every stranger strand as it opens. Do the Chapter 1 meditation the moment it is offered: it is the only trophy that can be missed. Story trophies are automatic, so this stage is just the playthrough.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27, 28, 29],
  },
  {
    number: 2,
    name: 'Activities and side content',
    text: 'After the story, or between missions, work the activities: the shooting range golds, the races, the challenges, the robberies, the partner trophies and the money trophies. The tracker counts 9 activity types under Touchpad, then Progress, then Activities.',
    ids: [15, 16, 17, 18, 19, 20, 21, 25, 32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
  },
  {
    number: 3,
    name: 'Collectibles and exploration',
    text: 'Sweep Leonida region by region: card sets, WAiNK spots, vehicle scans and the map itself. Do this after the story, when the whole map is open and fast travel is free.',
    ids: [30, 31, 35, 42],
  },
  {
    number: 4,
    name: 'The 100% checklist',
    text: 'Open Progress, then Stats, then 100% Completion and finish the checklist. It is roughly 60% of true completion, per PowerPyx, so most of it is already done from the earlier stages. Nothing on it is missable.',
    ids: [14],
  },
  {
    number: 5,
    name: 'Platinum',
    text: 'Vice Got a Price! pops the moment the 54th other trophy unlocks. No separate task, just the last trophy standing.',
    ids: [1],
  },
];

export function renderRoadmap(trophies, earned, container) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    const done = stage.ids.filter((id) => earned.has(id)).length;
    const head = document.createElement('div');
    head.className = 'stage-head';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.number}`;
    const name = document.createElement('h3');
    name.className = 'stage-name';
    name.textContent = `${stage.name} — ${done} of ${stage.ids.length} earned`;
    head.append(num, name);
    const text = document.createElement('p');
    text.textContent = stage.text;
    const list = document.createElement('p');
    list.className = 'stage-trophies';
    list.innerHTML = stage.ids
      .map((id) => {
        const t = byId.get(id);
        if (!t) return '';
        const mark = earned.has(id) ? '✓ ' : '';
        const flag = t.missable ? ' ⚠ missable' : '';
        return `<b>${mark}${escapeHtml(t.name)}</b> (${t.grade}${flag})`;
      })
      .join(' · ');
    li.append(head, text, list);
    container.append(li);
  }
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
