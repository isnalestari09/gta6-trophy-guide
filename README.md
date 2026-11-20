[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

A free, open-source, offline guide and tracker for all **55 PlayStation 5 trophies** of
Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze. It runs in a desktop
browser from its own files with the network off — no account, no sync, no ads.

## What it does

- **Tracker** — a checklist of all 55 trophies with their official name, description and
  grade, saved in the browser (localStorage), with export to a file, import back, and a
  share link that carries the earned trophies in the URL hash.
- **Filters** — by grade and kind (story, strangers & side, activities, collectibles,
  open world, heists & crime), plus search, missable-only and earned-only.
- **Spoiler setting** — hides the names and descriptions of un-earned story trophies
  until they are earned.
- **Roadmap** — six phases to the platinum, in the order that wastes the least time,
  with per-phase progress and a "Next up" pointer, plus a platinum time estimate
  (about 200–300 hours, typically ~250).
- **Missables** — the one missable trophy, Positive Mental Attitude, flagged and explained:
  one meditation spot is tied to the story, so meditate as you go.
- **A guide for every trophy** — in our own words, with difficulty (1–5), estimated time,
  step-by-step method, tips, and named sources beside each guide. Where an official
  description does not pin down a place, the guide says so instead of inventing one.

## Sources

- **Exophase** — the official trophy names, descriptions and grades, as PlayStation
  publishes them.
- **PSNProfiles** — PSN progress targets for the counted trophies (42 Shooting Range
  golds, 250 stunts, 52 map regions, 500 profile actions, $250,000 laundered, and more).
- **PushSquare, PowerPyx and GTA Zone** — method and time estimates, checked against the
  official descriptions. Every guide names its sources; sources are cited, never copied.

## A note on hidden trophies

PlayStation hides 28 of the 55 trophies until they are earned, but the live list pages do
not expose a hidden marker per trophy. This guide assigns hidden flags by a documented
rule: the 12 story trophies, the 5 stranger-finale trophies, 4 trophies whose descriptions
give nothing away, and 7 secret open-world trophies — 28 in all. That is a judgement
call, stated plainly in the app's About page, not a verified PSN field.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

The app is plain static files under `app/` — no build step, no network requests at run
time. `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the
output directory and writes `dossier.json` with the vendored make.fun library.

## Screenshots

1. `1-checklist.jpg` — checklist with The Shootist's guide and sources open
2. `2-roadmap.jpg` — the six-phase platinum roadmap
3. `3-missables.jpg` — the missable trophy, flagged and explained
4. `4-spoiler.jpg` — the spoiler setting hiding un-earned story trophies

## License

MIT — see [LICENSE](LICENSE). Leonida Platinum is an unofficial fan guide. Grand Theft
Auto and GTA are trademarks of Take-Two Interactive; this guide uses no Rockstar logo,
artwork or game screenshots.
