/* roadmap.js — the six ordered phases to the platinum, built from the trophies. */
export const PHASES = [
  {
    title: "Phase 1 — Story first",
    note: "Play Chapters 1–4 and the final mission in order. Every story trophy pops on completion, so there is nothing extra to do — just finish the story.",
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: "Phase 2 — Side strands & strangers",
    note: "Finish the five side-character finales and eight stranger strands. They unlock as the story progresses, so clear them as their markers appear.",
    ids: [22, 23, 24, 25, 26, 27],
  },
  {
    title: "Phase 3 — Activities & skill",
    note: "Races, the shooting range, drone races, fishing, arcade, bowling, stunts and challenges. Do the quick ones early; the 250 stunts and 42 gold shooting medals are the long grinds here.",
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 46],
  },
  {
    title: "Phase 4 — Collectibles & exploration",
    note: "Meditation spots first — they are the one missable. Then cards, WAiNK photos, vehicles, areas, garages and Scooter Bros registrations, area by area.",
    ids: [28, 29, 30, 31, 35, 42, 54, 55],
  },
  {
    title: "Phase 5 — Combat & chaos",
    note: "Combat Focus, Rhinos, vaults, armored trucks, gang operations and the jewelry store. Bring armour, explosives and a fast getaway car.",
    ids: [36, 37, 38, 39, 40, 41, 43, 51],
  },
  {
    title: "Phase 6 — Open-world cleanup & money",
    note: "Wanted-level escapes, shop robberies, the cocktail on Ocean Beach, the showroom smash, the strange event, choices and spending. Then 100% completion for the gold, and the platinum pops.",
    ids: [33, 34, 44, 45, 47, 48, 49, 50, 52, 53, 14],
  },
];

export function phaseProgress(phase, trophiesById, earned) {
  const done = phase.ids.filter((id) => earned.has(id)).length;
  return { done, total: phase.ids.length, pct: Math.round((done / phase.ids.length) * 100) };
}

export function nextUp(trophies, earned) {
  for (const phase of PHASES) {
    const nextId = phase.ids.find((id) => !earned.has(id));
    if (nextId) return { phase: phase.title, trophy: trophies.find((t) => t.id === nextId) };
  }
  return null;
}
