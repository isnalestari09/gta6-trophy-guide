// store.js — Leonida Platinum tracker state (localStorage + URL hash share link).
var Store = (function () {
  var KEY = 'leonida-platinum-v4';
  var state = { earned: {}, counts: {}, spoilers: false };
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var p = JSON.parse(raw); if (p && typeof p === 'object') state = p; }
    } catch (e) { /* private mode: keep in-memory state */ }
    // Share link: earned ids live in the URL hash, e.g. #/tracker?earned=1,2,3
    var m = location.hash.match(/earned=([0-9,]+)/);
    if (m) {
      m[1].split(',').forEach(function (s) { var id = parseInt(s, 10); if (id > 0) state.earned[id] = true; });
    }
    return state;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function toggle(id) { state.earned[id] = !state.earned[id]; if (!state.earned[id]) delete state.earned[id]; save(); }
  function isEarned(id) { return !!state.earned[id]; }
  function earnedCount() { return Object.keys(state.earned).length; }
  function earnedIds() { return Object.keys(state.earned).map(function (x) { return parseInt(x, 10); }).sort(function (a, b) { return a - b; }); }
  function setCount(id, n) { n = Math.max(0, parseInt(n, 10) || 0); if (n === 0) delete state.counts[id]; else state.counts[id] = n; save(); }
  function getCount(id) { return state.counts[id] || 0; }
  function setSpoilers(on) { state.spoilers = !!on; save(); }
  function spoilersOn() { return !!state.spoilers; }
  function exportJson() { return JSON.stringify({ earned: earnedIds(), counts: state.counts, exported: new Date().toISOString() }, null, 2); }
  function importJson(text) {
    var p = JSON.parse(text);
    if (Array.isArray(p.earned)) { state.earned = {}; p.earned.forEach(function (id) { state.earned[id] = true; }); }
    if (p.counts && typeof p.counts === 'object') state.counts = p.counts;
    save();
  }
  function shareLink() {
    var base = location.href.split('#')[0];
    return base + '#/tracker?earned=' + earnedIds().join(',');
  }
  function reset() { state = { earned: {}, counts: {}, spoilers: state.spoilers }; save(); }
  return { load: load, save: save, toggle: toggle, isEarned: isEarned, earnedCount: earnedCount, earnedIds: earnedIds, setCount: setCount, getCount: getCount, setSpoilers: setSpoilers, spoilersOn: spoilersOn, exportJson: exportJson, importJson: importJson, shareLink: shareLink, reset: reset };
})();
