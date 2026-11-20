/* store.js — earned progress in localStorage, export/import, share links, demo seed. */
export const STORAGE_KEY = "leonida-platinum-v2";
export const DEMO_EARNED = [2, 3, 8, 10, 20, 21, 33, 44, 46, 49, 51, 53, 55];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    /* Storage full or blocked: progress stays in memory for this session. */
  }
}

export function exportEarned(earned) {
  const blob = new Blob([JSON.stringify({ game: "Grand Theft Auto VI", earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leonida-platinum-progress.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importEarned(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error("not a progress file");
  return new Set(list.filter((n) => Number.isInteger(n)));
}

/* Read view, demo seed and opened trophy from the URL hash, e.g.
   #view=roadmap&demo=1&open=17 — the share link encodes earned ids too. */
export function readHashState() {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const view = hash.get("view") || "checklist";
  const demo = hash.get("demo") === "1";
  const openId = Number(hash.get("open") || 0) || null;
  const spoilers = hash.get("spoilers") === "1";
  const earned = hash.get("earned");
  const shared = earned ? new Set(earned.split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0)) : null;
  return { view, demo, openId, shared, spoilers };
}

export function writeHashState(view, earned, openId) {
  const hash = new URLSearchParams();
  if (view && view !== "checklist") hash.set("view", view);
  if (earned && earned.size) hash.set("earned", [...earned].sort((a, b) => a - b).join(","));
  if (openId) hash.set("open", String(openId));
  const next = hash.toString();
  history.replaceState(null, "", next ? `#${next}` : window.location.pathname + window.location.search);
}

export function shareLink(earned) {
  const hash = new URLSearchParams();
  hash.set("earned", [...earned].sort((a, b) => a - b).join(","));
  return `${window.location.origin}${window.location.pathname}#${hash.toString()}`;
}
