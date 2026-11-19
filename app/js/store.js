// Progress store: earned trophy ids kept in localStorage, with export and import.
// The key is namespaced to this guide so it never collides with another app.
const STORE_KEY = 'leonida-platinum-progress-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function exportEarned(earned) {
  const blob = new Blob(
    [JSON.stringify({ app: 'leonida-platinum', version: 1, earned: [...earned].sort((a, b) => a - b) }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importEarned(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('Not a progress file');
  return new Set(list.filter((id) => Number.isInteger(id)));
}
