/* filters.js — grade, kind, search, spoiler and earned filtering for the checklist. */
export const KIND_LABELS = {
  story: "Story",
  side: "Side strands",
  collectibles: "Collectibles",
  activities: "Activities",
  combat: "Combat",
  "open-world": "Open world",
  completion: "Completion",
  platinum: "Platinum",
};

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export function sortTrophies(trophies) {
  return [...trophies].sort((a, b) => (GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade]) || (a.id - b.id));
}

export function filterTrophies(trophies, state) {
  const query = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.grade !== "all" && t.grade !== state.grade) return false;
    if (state.kind !== "all" && t.kind !== state.kind) return false;
    if (state.missableOnly && !t.missable) return false;
    if (state.earnedOnly && !state.earned.has(t.id)) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

/* A story trophy is hidden while spoilers are on and it is not yet earned. */
export function isSpoilerHidden(trophy, state) {
  return state.spoilers && trophy.kind === "story" && !state.earned.has(trophy.id);
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (earned.has(t.id)) counts[t.grade] += 1;
  return counts;
}
