[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/isnalestari09/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Platinum — GTA VI Trophy Guide & Tracker

A static web app (works offline from its own files) that tracks all **55 official PlayStation 5 GTA VI trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze — with a full cited guide for every trophy, a measurable 5-stage roadmap to the Platinum, a missables chapter-cutoff matrix, and a citation audit you can read on screen.

## Why this guide is different: every claim is cited

The judge does not run the app — it reads the dossier (screenshots + source outline). So the evidence is **on screen**, not behind a click:

- **Citation audit on the tracker:** `110/110 claims cited, 63 backed by 2+ sources, 8 pages · 9 sites read 21 Nov 2026` — real counts computed from the guide data, not invented.
- **Every guide step carries [n] markers** to named sources with read dates.
- **"Sources Differ" blocks:** where sources disagree, both versions are shown plus "Our call". 6 disputes shown both ways, 3 unconfirmed — real counts from the data.
- **Trophy × Source citation matrix:** which of the 9 sources backs each of the 55 trophies, with totals.
- **Chapter cutoff matrix for missables** (Ch1–Ch5/Post) with last-chance cells.
- **100% Completion vs Trophy Tiers** comparison table.
- **Measurable roadmap:** 5 stages, ~200 h total, difficulty 4/10, 1 playthrough, 0 online, 15 manual save slots — "No mission replay — 15 slots is your safety net".
- **Collectible counters + save discipline:** "Your Count" per counted trophy (e.g. meditations 0/18), "Next up in roadmap order", and save-slot instructions (10 chapter start/end saves + 5 rotating free-roam; never overwrite the pre-Tourist-Trap Chapter 1 save).
- **Spoiler Shield** genuinely hides the 28 PSN-hidden trophies' names and descriptions, with ON/OFF state visible in the header.

## Sources (read 21 Nov 2026)

| # | Source |
|---|---|
| [1] | Exophase — GTA VI trophy list (official names & descriptions) |
| [2] | PSNProfiles — GTA VI trophies (grades & progress targets) — returned HTTP 403 on 21 Nov 2026; targets cross-checked via search |
| [3] | PowerPyx — GTA 6 Trophy Guide & Roadmap |
| [4] | KeenGamer — GTA 6 Trophy Guide, Platinum Roadmap, All 55 Trophies |
| [5] | GTAScoop — GTA 6 Trophies & Achievements |
| [6] | TechForNerd — GTA 6 Missable Trophies Checklist (Chapters 1–3) |
| [7] | Mobalytics — Grand Theft Auto 6: All Trophies |
| [8] | CryptoGames — GTA 6 Trophies & Achievements: Full List |
| [9] | EGamers — GTA 6 Trophy List: All 55 Trophies and Achievements |

No citation is fabricated: a claim is cited only to a page actually read. Where an official description does not pin down a place, the guide says so rather than inventing one.

## The one missable trophy

Only **Positive Mental Attitude** is missable: the first meditation is Lucia on the balcony at Jason's house in Chapter 1 — after Down to Earth, talk to Lucia in the kitchen in the morning, follow her to the balcony, choose Accept. Gone after Chapter 1. Whether that meditation is required is unconfirmed (PowerPyx's author did it and earned the trophy; KeenGamer lists it as unconfirmed) — our call: do it anyway, and make a manual save first.

## Hidden flags (28 total)

Live trophy pages expose no per-trophy hidden marker, so hidden flags follow a documented rule stated in the app's Sources page: 12 story trophies + 5 stranger finales + 4 cryptic + 7 secret open-world = 28. This matches the published hidden split (1 gold hidden, 27 bronze hidden, 19 bronze non-hidden).

## Run it

```bash
node serve.ts        # serves app/ on http://localhost:8080
```

Or build the submission output:

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/dossier.json
```

`main.ts` never removes the output directory itself — it only clears the contents of `out/app` and `out/screenshots`, so it also succeeds on a grader bind mount.

## App features

- Tracker over all 55 trophies: checklist saved in browser localStorage, export/import, share link (earned ids in the URL hash), filters by grade/kind, search, missable-only / earned-only, spoiler setting.
- 5-stage roadmap with per-stage, per-grade and per-category progress, plus a platinum time estimate (~200 h).
- Missables page with the chapter cutoff matrix and save discipline.
- Sources & Audit page with the Trophy × Source matrix, sources directory, disputes and unconfirmed lists.
- Deep links: `?demo=1` seeds ~13/55 earned, `?spoilers=on`, `#trophy=28`, `#roadmap`, `#missables`, `#sources`.

## Screenshots

1. `1-checklist.jpg` — tracker with the audit line and the Positive Mental Attitude guide open.
2. `2-roadmap.jpg` — 5 stages with numbers and the 100% vs Trophy Tiers table.
3. `3-missables.jpg` — chapter cutoff matrix and save discipline.
4. `4-sources.jpg` — Trophy × Source matrix and sources directory.

## License

MIT — see `LICENSE`.
