// Leonida Platinum v3 — saved progress: localStorage, export, import, share link.
const STORAGE_KEY = 'leonida-platinum-v3';

// A fixed preview set (13 trophies) used only when the page is opened with
// ?demo=1, so screenshots can show progress without touching saved data.
export const DEMO_EARNED = [2, 3, 4, 8, 15, 20, 21, 28, 35, 42, 46, 51, 52];

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: [], spoilers: false };
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter(Number.isInteger) : [],
      spoilers: parsed.spoilers === true,
    };
  } catch {
    return { earned: [], spoilers: false };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    earned: [...state.earned].sort((a, b) => a - b),
    spoilers: state.spoilers,
  }));
}

// Share links carry the earned trophy ids in the URL hash, e.g. #earned=2,3,4,
// so a reader can open someone else's progress without a file.
export function readShareHash() {
  const match = location.hash.match(/earned=([\d,]+)/);
  if (!match) return null;
  return match[1].split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0);
}

export function buildShareLink(earnedIds) {
  const url = new URL(location.href);
  url.hash = `earned=${[...earnedIds].sort((a, b) => a - b).join(',')}`;
  return url.toString();
}

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify({
    app: 'Leonida Platinum',
    version: 3,
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    spoilers: state.spoilers,
  }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-platinum-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.earned)) throw new Error('That file has no earned list.');
  return {
    earned: parsed.earned.filter(Number.isInteger),
    spoilers: parsed.spoilers === true,
  };
}
