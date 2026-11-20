/* views.js — renders the checklist, the guide detail pane, the roadmap and the missables page. */
import { KIND_LABELS, gradeCounts, isSpoilerHidden } from "./filters.js";
import { PHASES, phaseProgress, nextUp } from "./roadmap.js";

const DIFFICULTY_LABEL = ["", "Easy", "Fair", "Tricky", "Hard", "Very hard"];

export function updateProgress(trophies, earned) {
  const count = document.getElementById("earnedCount");
  const fill = document.getElementById("progressFill");
  const counts = document.getElementById("gradeCounts");
  count.textContent = String(earned.size);
  fill.style.width = `${Math.round((earned.size / trophies.length) * 100)}%`;
  const byGrade = gradeCounts(trophies, earned);
  counts.textContent = `${byGrade.platinum} platinum · ${byGrade.gold} gold · ${byGrade.silver} silver · ${byGrade.bronze} bronze`;
}

export function renderChecklist(trophies, state, onToggle, onOpen) {
  const list = document.getElementById("trophyList");
  list.innerHTML = "";
  const shown = document.getElementById("resultCount");
  shown.textContent = `${trophies.length} of 55 trophies shown · ${state.earned.size} earned`;
  if (!trophies.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No trophies match these filters. Clear the search or a filter to see them again.";
    list.appendChild(empty);
    return;
  }
  for (const trophy of trophies) {
    const hidden = isSpoilerHidden(trophy, state);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "row" + (state.earned.has(trophy.id) ? " earned" : "");
    row.setAttribute("role", "listitem");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = state.earned.has(trophy.id);
    box.setAttribute("aria-label", `Mark ${hidden ? "hidden trophy" : trophy.name} earned`);
    box.addEventListener("click", (event) => {
      event.stopPropagation();
      onToggle(trophy.id, box.checked);
    });
    const medal = document.createElement("span");
    medal.className = `medal ${trophy.grade}`;
    medal.title = trophy.grade;
    const body = document.createElement("span");
    const name = document.createElement("span");
    name.className = "tname";
    name.textContent = hidden ? "Hidden trophy — earn it to reveal" : trophy.name;
    const desc = document.createElement("span");
    desc.className = "tdesc";
    desc.textContent = hidden ? "Story trophy hidden by the spoiler setting." : trophy.description;
    const meta = document.createElement("span");
    meta.className = "meta";
    const gradeTag = document.createElement("span");
    gradeTag.className = `tag grade-${trophy.grade}`;
    gradeTag.textContent = trophy.grade;
    const kindTag = document.createElement("span");
    kindTag.className = "tag";
    kindTag.textContent = KIND_LABELS[trophy.kind] || trophy.kind;
    meta.appendChild(gradeTag);
    meta.appendChild(kindTag);
    if (trophy.missable) {
      const miss = document.createElement("span");
      miss.className = "tag miss";
      miss.textContent = "Missable";
      meta.appendChild(miss);
    }
    if (trophy.targetLabel) {
      const target = document.createElement("span");
      target.className = "tag";
      target.textContent = trophy.targetLabel;
      meta.appendChild(target);
    }
    body.appendChild(name);
    body.appendChild(document.createElement("br"));
    body.appendChild(desc);
    body.appendChild(meta);
    const right = document.createElement("span");
    right.className = "tdesc";
    right.textContent = hidden ? "" : `★${trophy.difficulty} · ${trophy.time}`;
    row.appendChild(box);
    row.appendChild(medal);
    row.appendChild(body);
    row.appendChild(right);
    row.addEventListener("click", () => onOpen(trophy.id));
    list.appendChild(row);
  }
}

export function renderDetail(trophy, state) {
  const pane = document.getElementById("detailPane");
  if (!trophy) {
    pane.innerHTML = "<h2>Pick a trophy</h2><p class=\"lede\">Click any trophy in the checklist to see its full guide here — what to do, where, when it can be missed, and its sources.</p>";
    return;
  }
  const hidden = isSpoilerHidden(trophy, state);
  pane.innerHTML = "";
  const title = document.createElement("h2");
  title.textContent = hidden ? "Hidden trophy" : trophy.name;
  const official = document.createElement("p");
  official.className = "official";
  official.textContent = hidden ? "This story trophy is hidden until you earn it." : `“${trophy.description}” — official description`;
  const kv = document.createElement("div");
  kv.className = "kv";
  kv.innerHTML = "";
  const kvParts = [
    ["Grade", trophy.grade],
    ["Kind", KIND_LABELS[trophy.kind] || trophy.kind],
    ["Difficulty", `${trophy.difficulty}/5 — ${DIFFICULTY_LABEL[trophy.difficulty]}`],
    ["Time", trophy.time],
  ];
  if (trophy.targetLabel) kvParts.push(["PSN target", trophy.targetLabel]);
  for (const [label, value] of kvParts) {
    const span = document.createElement("span");
    const b = document.createElement("b");
    b.textContent = `${label}: `;
    span.appendChild(b);
    span.appendChild(document.createTextNode(value));
    kv.appendChild(span);
  }
  pane.appendChild(title);
  pane.appendChild(official);
  pane.appendChild(kv);
  if (trophy.missable) {
    const warn = document.createElement("p");
    warn.className = "warn";
    warn.textContent = "⚠ Missable — do this before the final mission. It is the only trophy in the game flagged missable: meditation spots are easy to leave behind once the story moves on.";
    pane.appendChild(warn);
  }
  if (!hidden) {
    const guideHead = document.createElement("h3");
    guideHead.textContent = "Guide";
    const guide = document.createElement("p");
    guide.textContent = trophy.guide;
    const stepsHead = document.createElement("h3");
    stepsHead.textContent = "Steps";
    const steps = document.createElement("ol");
    steps.className = "steps";
    for (const step of trophy.steps) {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    }
    pane.appendChild(guideHead);
    pane.appendChild(guide);
    pane.appendChild(stepsHead);
    pane.appendChild(steps);
  }
  const sources = document.createElement("p");
  sources.className = "sources";
  sources.textContent = `Sources: official name, description, grade${trophy.targetLabel ? " and PSN target" : ""} — Exophase and PSNProfiles. Method: our own walkthrough built from the official description. Further reading: PowerPyx and GTA Zone trophy guides.`;
  pane.appendChild(sources);
}

export function renderRoadmap(trophies, earned) {
  const box = document.getElementById("roadmapBox");
  box.innerHTML = "";
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const next = nextUp(trophies, earned);
  if (next) {
    const note = document.createElement("div");
    note.className = "note";
    const b = document.createElement("b");
    b.textContent = "Next up: ";
    note.appendChild(b);
    note.appendChild(document.createTextNode(`${next.trophy.name} — ${next.phase}.`));
    box.appendChild(note);
  }
  for (const phase of PHASES) {
    const progress = phaseProgress(phase, byId, earned);
    const card = document.createElement("div");
    card.className = "phase";
    const head = document.createElement("h3");
    head.textContent = `${phase.title} — ${progress.done}/${progress.total}`;
    const note = document.createElement("p");
    note.className = "lede";
    note.textContent = phase.note;
    const bar = document.createElement("div");
    bar.className = "pbar";
    const fill = document.createElement("div");
    fill.className = "pfill";
    fill.style.width = `${progress.pct}%`;
    bar.appendChild(fill);
    const list = document.createElement("ul");
    for (const id of phase.ids) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const li = document.createElement("li");
      if (earned.has(id)) li.className = "done";
      li.textContent = `${trophy.name} (${trophy.grade})`;
      list.appendChild(li);
    }
    card.appendChild(head);
    card.appendChild(note);
    card.appendChild(bar);
    card.appendChild(list);
    box.appendChild(card);
  }
  const plat = document.createElement("div");
  plat.className = "note";
  plat.textContent = "Finish Phase 6 and the gold 'A Long Road' (100% completion) is the last gate — once it pops, 'Vice Got a Price!' follows automatically.";
  box.appendChild(plat);
}

export function renderMissables(trophies, earned) {
  const box = document.getElementById("missablesBox");
  box.innerHTML = "";
  const missable = trophies.filter((t) => t.missable);
  for (const trophy of missable) {
    const card = document.createElement("div");
    card.className = "misscard";
    const head = document.createElement("h3");
    head.textContent = `${trophy.name} — the only missable`;
    const desc = document.createElement("p");
    desc.textContent = trophy.guide;
    const steps = document.createElement("ol");
    steps.className = "steps";
    for (const step of trophy.steps) {
      const li = document.createElement("li");
      li.textContent = step;
      steps.appendChild(li);
    }
    const state = document.createElement("p");
    state.textContent = earned.has(trophy.id) ? "✓ Earned — you are safe." : "Not earned yet — do the spots as you explore, before the final mission.";
    card.appendChild(head);
    card.appendChild(desc);
    card.appendChild(steps);
    card.appendChild(state);
    box.appendChild(card);
  }
  const storyNote = document.createElement("div");
  storyNote.className = "note";
  storyNote.innerHTML = "<h3>Story trophies cannot be missed</h3><p>All 12 story trophies (Chapters 1–4, the final mission and the named missions) pop on completion. If you finish a mission, you get its trophy — there is no way to lock yourself out of one by playing the story.</p>";
  box.appendChild(storyNote);
  const freeNote = document.createElement("div");
  freeNote.className = "note";
  freeNote.innerHTML = "<h3>Everything else is free-roam</h3><p>Activities, collectibles, combat and open-world trophies stay available after the story ends, so they can all be cleaned up in Phase 6. The only thing to do early is the meditation spots above.</p>";
  box.appendChild(freeNote);
}
