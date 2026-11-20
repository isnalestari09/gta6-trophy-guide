[![GTA 6 trophy guide bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden on PlayStation until earned.

## What it does

- **Checklist tracker** — every trophy with its official name, description, grade, PSN progress target and kind. Tick trophies off; progress is saved in the browser (localStorage) and shown as a count, a progress bar and per-grade totals.
- **Export, import and share** — export your progress to a JSON file, import it back, or copy a share link that encodes your earned trophies in the URL.
- **Filters and search** — filter by grade (platinum / gold / silver / bronze) and by kind (story, side strands, collectibles, activities, combat, open world, completion), plus missable-only and earned-only switches, and a live search box.
- **Spoiler setting** — “Hide story spoilers” hides the names and descriptions of un-earned story trophies until you earn them.
- **Platinum roadmap** — six ordered phases (story → side strands → activities → collectibles → combat → open-world cleanup), each with its own progress bar, plus a “Next up” pointer.
- **Missables page** — the one trophy to watch, Positive Mental Attitude (meditate at all 18 spots before the final mission), with the story trophies confirmed unmissable and everything else flagged as free-roam cleanup.
- **A cited guide for every trophy** — what to do, where, when it can be missed, difficulty (1–5), estimated time and step-by-step method, in our own words.

## Sources

Official trophy names, descriptions, grades and PSN targets were cross-checked on 2026-11-20 against [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi), which agree on every entry and with the kit's frozen list. Method advice is our own walkthrough built from the official descriptions; where a description does not pin down a place, the guide says so instead of inventing one. Further reading: [PowerPyx](https://www.powerpyx.com/) and [GTA Zone](https://www.gtazone.com/).

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The app is plain static files under `app/` and works with the network off — every file it loads lives under `app/`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory (it clears only the directory's contents, never the directory itself) and writes `dossier.json` with the vendored make.fun library.

## Screenshots

Four real renders of the app in desktop Chrome (1280×800):

1. `1-checklist.jpg` — the checklist with a trophy guide open, progress and filters visible
2. `2-roadmap.jpg` — the platinum roadmap with per-phase progress
3. `3-missables.jpg` — the missables page
4. `4-spoiler.jpg` — the checklist with the spoiler setting on

## License

MIT — see [LICENSE](LICENSE).
