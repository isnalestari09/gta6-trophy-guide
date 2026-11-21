// filters.js — tracker filter state (grade, kind, search, missable-only, earned-only).
var Filters = (function () {
  var state = { grade: 'all', kind: 'all', q: '', missableOnly: false, earnedOnly: false };
  function set(patch) { Object.assign(state, patch); }
  function get() { return state; }
  function apply(trophies) {
    var q = state.q.trim().toLowerCase();
    return trophies.filter(function (t) {
      if (state.grade !== 'all' && t.grade !== state.grade) return false;
      if (state.kind !== 'all' && t.kind !== state.kind) return false;
      if (state.missableOnly && !t.missable) return false;
      if (state.earnedOnly && !Store.isEarned(t.id)) return false;
      if (q) {
        var hay = (t.name + ' ' + t.description + ' ' + (t.guide || '')).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }
  function kinds(trophies) {
    var seen = {};
    trophies.forEach(function (t) { seen[t.kind] = true; });
    return Object.keys(seen).sort();
  }
  return { set: set, get: get, apply: apply, kinds: kinds };
})();
