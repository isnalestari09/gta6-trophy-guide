// Leonida Platinum v3 — filtering, search and the spoiler rule.
// The spoiler rule: with spoilers on, story trophies that are not earned yet
// show only "Hidden story trophy" instead of their name and description.

export function trophyMatchesSearch(trophy, query) {
  if (!query) return true;
  const haystack = [
    trophy.name, trophy.description, trophy.guide,
    ...(trophy.steps ?? []), trophy.kind, trophy.grade,
  ].join(' ').toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function applyFilters(trophies, filters, earnedSet) {
  return trophies.filter((trophy) => {
    if (filters.grade && trophy.grade !== filters.grade) return false;
    if (filters.kind && trophy.kind !== filters.kind) return false;
    if (filters.missableOnly && !trophy.missable) return false;
    if (filters.earnedOnly && !earnedSet.has(trophy.id)) return false;
    return trophyMatchesSearch(trophy, filters.query);
  });
}

export function isSpoilerHidden(trophy, spoilersOn, earnedSet) {
  return spoilersOn && trophy.kind === 'story' && !earnedSet.has(trophy.id);
}
