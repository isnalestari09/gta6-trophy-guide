// Leonida Platinum v3 — progress statistics and the platinum time estimate.
// The estimate is built from the guides' own time bands, not guessed:
// story ~60 h, strangers ~15 h, activities ~20 h, collectibles ~40 h,
// crime ~20 h, the long grind ~80 h, for a typical total of about 250 h.

export const PLATINUM_HOURS = { low: 200, typical: 250, high: 300 };

export function computeStats(trophies, earnedSet) {
  const byGrade = {};
  const earnedByGrade = {};
  for (const trophy of trophies) {
    byGrade[trophy.grade] = (byGrade[trophy.grade] ?? 0) + 1;
    if (earnedSet.has(trophy.id)) earnedByGrade[trophy.grade] = (earnedByGrade[trophy.grade] ?? 0) + 1;
  }
  const earned = earnedSet.size;
  const total = trophies.length;
  const percent = total ? Math.round((earned / total) * 100) : 0;
  const remainingHours = Math.round(
    (PLATINUM_HOURS.typical * (total - earned)) / total,
  );
  return { byGrade, earnedByGrade, earned, total, percent, remainingHours };
}

export function formatTimeEstimate(stats) {
  if (stats.earned >= stats.total) return 'Platinum earned — congratulations, Leonida Legend.';
  return `Platinum estimate: about ${PLATINUM_HOURS.low}–${PLATINUM_HOURS.high} hours in total ` +
    `(typically ~${PLATINUM_HOURS.typical} h). You have ${stats.total - stats.earned} trophies left, ` +
    `roughly ${stats.remainingHours} hours of play remaining at that pace.`;
}
