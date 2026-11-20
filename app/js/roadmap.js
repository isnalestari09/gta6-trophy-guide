// Leonida Platinum v3 — the six-phase platinum roadmap.
// Phase order wastes the least time: story first (so nothing story-gated is
// missed), then strangers, then a sweep of activities and collectibles,
// then the crime grind, with the long counters ticking up throughout.
// Trophy ids follow the official list order in app/data/trophies.json.

export const ROADMAP_PHASES = [
  {
    phase: 1,
    title: 'Play the story — and meditate as you go',
    when: 'First playthrough, Chapters 1–4 and the finale',
    trophyIds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    advice: [
      'Just play the story. All 12 story trophies unlock by finishing missions — none can be missed.',
      'Meditate at every spot you pass. Positive Mental Attitude is the list’s only missable trophy: one meditation spot is tied to a story moment, so do them as they appear instead of leaving them all for later.',
      'Say yes to every activity the story offers you — fishing with Cal, the arcade, bowling — it all counts toward later phases.',
    ],
  },
  {
    phase: 2,
    title: 'Strangers and side stories',
    when: 'After the story, or between chapters in free roam',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
    advice: [
      'Finish the final mission for Andy, Kenton, Billy, Randy and Tyrone — each one is its own trophy.',
      'Complete 8 stranger mission strands across Leonida for Strangers & Freaks; the map marks them once you meet each stranger.',
      'Hunt a unique animal for Bret (Fair Game) while you are out in the wilds — the hunt starts from Bret, not from random animals.',
    ],
  },
  {
    phase: 3,
    title: 'Activities sampler',
    when: 'Any time after the story opens the map',
    trophyIds: [16, 17, 18, 19, 20, 21, 46, 51],
    advice: [
      'Try each of the 9 activity types once for Master of None: fishing, hunting, golf, shooting range, pool, basketball, a video game, a race and a stunt.',
      'Beat Cal in a fishing challenge, finish one arcade game, and bowl a strike at the Kolt & Associates alley.',
      'Win 20 different races and a Top Fun drone race at every one of the 14 locations — the drone races also feed the 100% checklist.',
    ],
  },
  {
    phase: 4,
    title: 'Collectibles and the map',
    when: 'With a vehicle and the whole map open',
    trophyIds: [28, 30, 31, 32, 35, 42],
    advice: [
      'WAiNK It at 100 locations and complete 3 Collectible Card sets — use the in-game tracker, not memory.',
      'Discover 100 vehicles (a WAiNK scan counts) and clear the fog from the whole map for The Goodtime State — a plane is the fastest way.',
      'Complete 50 of the 80 Challenges. The 100% checklist later asks for 70, so keep going past 50.',
    ],
  },
  {
    phase: 5,
    title: 'Heists, robberies and combat',
    when: 'Free roam, with good weapons and a fast car',
    trophyIds: [33, 34, 36, 37, 38, 39, 40, 41, 43, 45],
    advice: [
      'Do the partner crimes with your partner beside you: lose a 4-star wanted level together, and rob 3 shops back-to-back without losing the wanted level.',
      'Rob 5 bank vaults, one armored truck and a jewelry store undetected, plus one illegal operation per gang.',
      'Take down 5 enemies in a single Combat Focus for Gunslinger — start it in a crowd, not against one enemy.',
    ],
  },
  {
    phase: 6,
    title: 'The long grind and 100%',
    when: 'Last — most of this is already half done',
    trophyIds: [1, 14, 15, 44, 47, 48, 49, 50, 52, 53, 54, 55],
    advice: [
      'Finish the 250 stunts (only 250 of 397 are needed for the trophy; 100% asks for 300) and gold all 42 Shooting Range challenges.',
      'Launder $250,000 in Marked Bills, spend $100,000 across shops, buy every garage property and register 10 vehicles to Scooter Bros.',
      'Attain 100% Completion for A Long Road — then Vice Got a Price!, the platinum, unlocks on its own.',
    ],
  },
];

export function phaseProgress(phase, earnedSet) {
  const earned = phase.trophyIds.filter((id) => earnedSet.has(id)).length;
  return { earned, total: phase.trophyIds.length };
}

export function nextUnfinishedPhase(earnedSet) {
  return ROADMAP_PHASES.find((phase) => phase.trophyIds.some((id) => !earnedSet.has(id))) ?? null;
}
