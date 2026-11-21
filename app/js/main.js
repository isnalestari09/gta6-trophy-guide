// main.js — Leonida Platinum boot, routing, audit line, spoiler toggle.
var DATA = { trophies: [], audit: null, roadmap: null, openTrophy: null, tab: 'tracker' };
function loadJson(path) {
  return fetch(path).then(function (r) { if (!r.ok) throw new Error(path + ' HTTP ' + r.status); return r.json(); });
}
function renderAudit() {
  var a = DATA.audit;
  var el = document.getElementById('audit');
  if (!a) { el.textContent = 'Citation audit unavailable.'; return; }
  el.innerHTML = '<b>Citation audit:</b> ' + a.claims_cited + '/' + a.claims_total + ' claims cited · ' +
    a.claims_backed_2plus + ' backed by 2+ sources · ' + a.pages_read + ' pages · ' + a.sites_read + ' sites · read ' + a.read_date +
    ' · <b>' + a.disputes + ' disputes shown both ways</b> · ' + a.unconfirmed + ' unconfirmed' +
    (a.psnprofiles_blocked_403 ? ' · <span class="warn">PSNProfiles blocked (403) — targets cross-checked via search</span>' : '');
}
function renderSpoilerBtn() {
  var b = document.getElementById('spoilerBtn');
  var shieldOn = !Store.spoilersOn();
  b.textContent = shieldOn ? 'ON — hiding 28 hidden trophies' : 'OFF — showing all 55';
  b.classList.toggle('off', !shieldOn);
  b.setAttribute('aria-pressed', shieldOn ? 'true' : 'false');
}
function currentTab() {
  var m = location.hash.match(/#\/(tracker|roadmap|missables|sources)/);
  return m ? m[1] : 'tracker';
}
function render() {
  DATA.tab = currentTab();
  var m = location.hash.match(/#trophy=(\d+)/);
  DATA.openTrophy = m ? parseInt(m[1], 10) : null;
  document.querySelectorAll('.tabs a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-tab') === DATA.tab); });
  var view = document.getElementById('view');
  if (DATA.tab === 'roadmap') view.innerHTML = Views.roadmap();
  else if (DATA.tab === 'missables') view.innerHTML = Views.missables();
  else if (DATA.tab === 'sources') view.innerHTML = Views.sources();
  else view.innerHTML = Views.tracker();
  wire();
}
function wire() {
  var view = document.getElementById('view');
  view.querySelectorAll('.tlist li').forEach(function (li) {
    li.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'INPUT') return;
      var id = parseInt(li.getAttribute('data-id'), 10);
      if (e.target && e.target.classList.contains('ck')) { Store.toggle(id); render(); return; }
      location.hash = '#trophy=' + id;
    });
  });
  view.querySelectorAll('input[data-count]').forEach(function (inp) {
    inp.addEventListener('change', function () { Store.setCount(parseInt(inp.getAttribute('data-count'), 10), inp.value); render(); });
  });
  var g = document.getElementById('fGrade');
  if (g) g.addEventListener('change', function () { Filters.set({ grade: g.value }); render(); });
  var k = document.getElementById('fKind');
  if (k) k.addEventListener('change', function () { Filters.set({ kind: k.value }); render(); });
  var q = document.getElementById('fQ');
  if (q) q.addEventListener('input', function () { Filters.set({ q: q.value }); render(); });
  var fm = document.getElementById('fMiss');
  if (fm) fm.addEventListener('change', function () { Filters.set({ missableOnly: fm.checked }); render(); });
  var fe = document.getElementById('fEarn');
  if (fe) fe.addEventListener('change', function () { Filters.set({ earnedOnly: fe.checked }); render(); });
  var ex = document.getElementById('btnExport');
  if (ex) ex.addEventListener('click', function () {
    var blob = new Blob([Store.exportJson()], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leonida-platinum-progress.json'; a.click();
  });
  var im = document.getElementById('btnImport');
  if (im) im.addEventListener('click', function () {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json';
    inp.addEventListener('change', function () {
      var f = inp.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () { try { Store.importJson(r.result); render(); } catch (e) { alert('Import failed: ' + e.message); } };
      r.readAsText(f);
    });
    inp.click();
  });
  var sh = document.getElementById('btnShare');
  if (sh) sh.addEventListener('click', function () {
    var link = Store.shareLink();
    if (navigator.clipboard) navigator.clipboard.writeText(link).then(function () { sh.textContent = 'Link copied!'; }, function () { prompt('Copy your share link:', link); });
    else prompt('Copy your share link:', link);
  });
  var rs = document.getElementById('btnReset');
  if (rs) rs.addEventListener('click', function () { if (confirm('Reset all earned trophies and counters?')) { Store.reset(); render(); } });
}
function applyQuery() {
  var q = new URLSearchParams(location.search);
  if (q.get('demo') === '1') {
    // Demo seed: ~13/55 earned so progress bars and counters show real state.
    [2, 3, 4, 8, 20, 21, 35, 42, 44, 46, 53, 54, 55].forEach(function (id) { if (!Store.isEarned(id)) Store.toggle(id); });
    Store.setCount(28, 3);
    Store.setCount(15, 250);
  }
  if (q.get('spoilers') === 'on') Store.setSpoilers(true);
}
document.addEventListener('DOMContentLoaded', function () {
  Store.load();
  applyQuery();
  Promise.all([loadJson('data/trophies.json'), loadJson('data/audit.json'), loadJson('data/roadmap.json')])
    .then(function (res) {
      DATA.trophies = res[0].trophies; DATA.audit = res[1]; DATA.roadmap = res[2];
      renderAudit(); renderSpoilerBtn(); render();
    })
    .catch(function (e) {
      document.getElementById('view').innerHTML = '<p>Failed to load trophy data: ' + e.message + '</p>';
    });
  document.getElementById('spoilerBtn').addEventListener('click', function () {
    Store.setSpoilers(!Store.spoilersOn());
    renderSpoilerBtn(); render();
  });
  window.addEventListener('hashchange', render);
});
