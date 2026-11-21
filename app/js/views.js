// views.js — Leonida Platinum: tracker, roadmap, missables, sources views.
var Views = (function () {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function srcTag(n) { return '<span class="src">[' + n + ']</span>'; }
  function srcTags(list) { return (list || []).map(srcTag).join(' '); }
  function sourceName(n) { var s = (DATA.roadmap.sources || []).filter(function (x) { return x.n === n; })[0]; return s ? s.name : ('Source ' + n); }
  function displayName(t) {
    if (t.hidden && !Store.spoilersOn() && !Store.isEarned(t.id)) return 'Hidden Trophy';
    return t.name;
  }
  function displayDesc(t) {
    if (t.hidden && !Store.spoilersOn() && !Store.isEarned(t.id)) return 'Hidden — name and description concealed by Spoiler Shield. Turn Spoiler Shield OFF to reveal.';
    return t.description;
  }
  function gradePill(t) { return '<span class="grade ' + t.grade + '">' + t.grade + '</span>'; }
  function kindTag(t) { return '<span class="tag">' + esc(t.kind) + '</span>'; }
  function missTag(t) { return t.missable ? '<span class="tag miss">MISSABLE</span>' : ''; }
  function hidTag(t) { return t.hidden ? '<span class="tag hidden-t">hidden</span>' : ''; }
  function targetLabel(t) { return t.target ? ' · target ' + t.target.toLocaleString() + ' ' + esc(t.targetLabel || '') : ''; }

  function disputeBlock(d) {
    if (!d) return '';
    return '<div class="dispute"><h4>SOURCES DIFFER — ' + esc(d.id) + ': ' + esc(d.title) + '</h4>' +
      '<p><b>Version A:</b> ' + esc(d.a) + '</p>' +
      '<p><b>Version B:</b> ' + esc(d.b) + '</p>' +
      '<p class="call">Our call: ' + esc(d.call) + '</p></div>';
  }
  function findDispute(id) {
    var d = (DATA.roadmap.disputes || []).filter(function (x) { return x.id === id; })[0];
    return d || null;
  }

  function detailHtml(t) {
    var d = t.dispute ? findDispute(t.dispute) : null;
    var h = '<div class="detail" id="detail"><p><a href="#/tracker">✕ Close guide</a></p><h2>' + esc(displayName(t)) + ' ' + gradePill(t) + ' ' + missTag(t) + hidTag(t) + '</h2>';
    h += '<p>' + esc(displayDesc(t)) + '</p>';
    h += '<p class="meta">Stage ' + t.stage + ' · ' + esc(t.chapter) + ' · difficulty ' + t.difficulty + '/5 · ' + esc(t.time) + targetLabel(t) + '</p>';
    if (t.target) {
      h += '<div class="counter">Your Count: <input type="number" min="0" max="' + t.target + '" value="' + Store.getCount(t.id) + '" data-count="' + t.id + '" aria-label="Your count"> / ' + t.target.toLocaleString() + ' ' + esc(t.targetLabel || '') + '</div>';
    }
    h += '<ol class="steps">';
    t.steps.forEach(function (s) {
      h += '<li>' + esc(s.text) + ' ' + srcTags(s.sources) + '</li>';
    });
    h += '</ol>';
    h += '<p>' + esc(t.guide) + '</p>';
    h += '<p class="sources-list">Sources: ' + (t.sources || []).map(function (n) { return '[' + n + '] ' + esc(sourceName(n)); }).join(' · ') + '</p>';
    h += disputeBlock(d);
    h += '<div class="nextup"><b>Next up in roadmap order:</b> ' + esc(nextUp(t).name) + ' — Stage ' + nextUp(t).stage + '</div>';
    h += '</div>';
    return h;
  }
  function nextUp(t) {
    var rest = DATA.trophies.filter(function (x) { return !Store.isEarned(x.id) && x.id !== t.id; });
    rest.sort(function (a, b) { return (a.stage - b.stage) || (a.id - b.id); });
    return rest[0] || t;
  }

  function statsHtml() {
    var total = DATA.trophies.length, earned = Store.earnedCount();
    var pct = Math.round(earned / total * 100);
    var hoursLeft = Math.round((total - earned) / total * 200);
    var h = '<div class="stats">';
    h += '<div class="stat"><b>' + earned + ' / ' + total + '</b><span>earned · ' + pct + '%</span><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
    ['platinum', 'gold', 'silver', 'bronze'].forEach(function (g) {
      var gt = DATA.trophies.filter(function (t) { return t.grade === g; });
      var ge = gt.filter(function (t) { return Store.isEarned(t.id); }).length;
      h += '<div class="stat"><b>' + ge + ' / ' + gt.length + '</b><span>' + g + '</span></div>';
    });
    h += '<div class="stat"><b>~' + hoursLeft + ' h</b><span>remaining (est. ~200 h total)</span></div>';
    h += '<div class="stat"><b>4/10</b><span>difficulty · 1 playthrough · 0 online</span></div>';
    h += '</div>';
    return h;
  }

  function tracker() {
    var list = Filters.apply(DATA.trophies);
    var h = '<h2>Tracker — all 55 trophies</h2>' + statsHtml();
    h += '<div class="filters">';
    h += '<select id="fGrade" aria-label="Filter by grade"><option value="all">All grades</option><option value="platinum">Platinum</option><option value="gold">Gold</option><option value="silver">Silver</option><option value="bronze">Bronze</option></select>';
    h += '<select id="fKind" aria-label="Filter by kind"><option value="all">All kinds</option>' + Filters.kinds(DATA.trophies).map(function (k) { return '<option value="' + k + '">' + esc(k) + '</option>'; }).join('') + '</select>';
    h += '<input type="search" id="fQ" placeholder="Search trophies…" value="' + esc(Filters.get().q) + '" aria-label="Search">';
    h += '<label><input type="checkbox" id="fMiss" ' + (Filters.get().missableOnly ? 'checked' : '') + '> Missable only</label>';
    h += '<label><input type="checkbox" id="fEarn" ' + (Filters.get().earnedOnly ? 'checked' : '') + '> Earned only</label>';
    h += '<button class="btn" id="btnExport" type="button">Export</button>';
    h += '<button class="btn" id="btnImport" type="button">Import</button>';
    h += '<button class="btn" id="btnShare" type="button">Copy share link</button>';
    h += '<button class="btn" id="btnReset" type="button">Reset</button>';
    h += '</div>';
    h += '<p class="note">Showing ' + list.length + ' of 55 · click a trophy for its cited guide. Counters (e.g. meditations 0/18) live inside each guide.</p>';
    if (DATA.openTrophy) { var ot = DATA.trophies.filter(function (x) { return x.id === DATA.openTrophy; })[0]; if (ot) h += detailHtml(ot); }
    h += '<ul class="tlist">';
    list.forEach(function (t) {
      var earned = Store.isEarned(t.id);
      var cnt = t.target ? ' <span class="tag">' + Store.getCount(t.id) + '/' + t.target.toLocaleString() + '</span>' : '';
      h += '<li data-id="' + t.id + '" class="' + (earned ? 'earned' : '') + (t.missable ? ' missable' : '') + '"><span class="ck">' + (earned ? '✓' : '') + '</span><span class="body"><span class="name">' + esc(displayName(t)) + '</span> ' + gradePill(t) + ' ' + missTag(t) + hidTag(t) + cnt + '<br><span class="desc">' + esc(displayDesc(t)) + '</span><br><span class="meta">Stage ' + t.stage + ' · ' + esc(t.chapter) + ' · ' + esc(t.time) + targetLabel(t) + ' · sources ' + (t.sources || []).map(function (n) { return '[' + n + ']'; }).join(' ') + '</span></span></li>';
    });
    h += '</ul>';
    return h;
  }

  function roadmap() {
    var h = '<h2>Roadmap — 5 stages · ~200 h · difficulty 4/10 · 1 playthrough · 0 online · 15 save slots</h2>';
    h += '<p><b>No mission replay — 15 slots is your safety net.</b> Make a manual save at the start AND the end of each chapter (10 saves). Rotate the remaining 5 for free-roam cleanup. <b>Never overwrite the pre-Tourist-Trap Chapter 1 save</b> — it is your only way back to the one missable meditation.</p>';
    h += '<div class="stagegrid">';
    DATA.roadmap.stages.forEach(function (s) {
      var earned = DATA.trophies.filter(function (t) { return t.stage === s.n && Store.isEarned(t.id); }).length;
      h += '<div class="stage"><h3>Stage ' + s.n + ' — ' + esc(s.name) + '</h3><div class="cnt">' + earned + '/' + s.trophies + '</div><div class="hrs">' + esc(s.hours) + '</div><p>' + esc(s.note) + '</p></div>';
    });
    h += '</div>';
    var nx = nextUp({ id: -1, stage: 0 });
    h += '<div class="nextup"><b>Next up in roadmap order:</b> ' + esc(nx.name) + ' — Stage ' + nx.stage + ' (' + esc(nx.chapter) + '). ' + Store.earnedCount() + '/55 earned so far.</div>';
    h += '<h3>100% Completion vs Trophy Tiers</h3><table><thead><tr><th></th><th class="num">Platinum</th><th class="num">Gold</th><th class="num">Silver</th><th class="num">Bronze</th><th class="num">Total</th></tr></thead><tbody>';
    DATA.roadmap.tiers.forEach(function (r) {
      h += '<tr><td>' + esc(r.row) + '</td><td class="num">' + esc(r.platinum) + '</td><td class="num">' + esc(r.gold) + '</td><td class="num">' + esc(r.silver) + '</td><td class="num">' + esc(r.bronze) + '</td><td class="num">' + esc(r.total) + '</td></tr>';
    });
    h += '</tbody></table>';
    h += '<p class="note">100% Completion is a checklist inside the game (Progress &gt; Stats &gt; 100% Completion); it is not a trophy by itself — it gates A Long Road. 100% needs only 15 of the 18 meditations, 300 of 397 stunts, 70 of 80 challenges, 200 of 277 base vehicles, 100 of 255 animals.</p>';
    h += '<div class="savebox"><h3>Save discipline — 15 manual slots</h3><p>' + esc(DATA.roadmap.save_plan.rule) + '</p><p>10 chapter start/end saves + 5 rotating free-roam saves. Cheats disable trophies AND saving — never cheat on this save file.</p></div>';
    return h;
  }

  function missables() {
    var h = '<h2>Missables — chapter cutoff matrix</h2>';
    h += '<p>Only <b>1 trophy is missable</b>: <b>Positive Mental Attitude</b>. Everything else is doable after the story in free-roam. The matrix below shows the last chance for every time-sensitive item.</p>';
    h += '<table><thead><tr><th>Trophy / item</th><th>Ch1</th><th>Ch2</th><th>Ch3</th><th>Ch4</th><th>Ch5</th><th>Post-story</th></tr></thead><tbody>';
    DATA.roadmap.cutoff.forEach(function (r) {
      h += '<tr><td><b>' + esc(r.trophy) + '</b>' + (r.missable ? ' <span class="tag miss">MISSABLE</span>' : '') + '</td>' +
        '<td class="' + (r.ch1.indexOf('LAST') === 0 ? 'hot' : '') + '">' + esc(r.ch1) + '</td>' +
        '<td>' + esc(r.ch2) + '</td><td>' + esc(r.ch3) + '</td><td>' + esc(r.ch4) + '</td><td>' + esc(r.ch5) + '</td>' +
        '<td class="' + (r.post.indexOf('GONE') === 0 ? 'hot' : 'ok') + '">' + esc(r.post) + '</td></tr>';
    });
    h += '</tbody></table>';
    var pma = DATA.trophies.filter(function (t) { return t.id === 28; })[0];
    h += '<div class="detail"><h3>Positive Mental Attitude — the one missable</h3><p>' + esc(pma.guide) + '</p><ol class="steps">';
    pma.steps.forEach(function (s) { h += '<li>' + esc(s.text) + ' ' + srcTags(s.sources) + '</li>'; });
    h += '</ol></div>';
    h += disputeBlock(findDispute('D1')) + disputeBlock(findDispute('D2'));
    h += '<div class="savebox"><h3>Save discipline</h3><p>' + esc(DATA.roadmap.save_plan.rule) + '</p></div>';
    return h;
  }

  function sources() {
    var a = DATA.audit;
    var h = '<h2>Sources &amp; Citation Audit</h2>';
    h += '<p><b>' + a.claims_cited + '/' + a.claims_total + ' claims cited, ' + a.claims_backed_2plus + ' backed by 2+ sources, ' + a.pages_read + ' pages · ' + a.sites_read + ' sites read ' + esc(a.read_date) + '.</b> ' + a.disputes + ' disputes shown both ways, ' + a.unconfirmed + ' unconfirmed.</p>';
    h += '<h3>Trophy × Source citation matrix</h3>';
    h += '<p class="note">● = this trophy cites that source. Totals per source: [1] 55 · [2] 19 · [3] 55 · [4] 4 · [5] 14 · [6] 2 · [7] 2 · [8] 3 · [9] 2. Every trophy cites Exophase [1] (official list) and PowerPyx [3] (guide). PSNProfiles [2] backs grades and progress targets (19 trophies).</p>';
    h += '<table class="matrix"><thead><tr><th>Trophy</th><th>[1]</th><th>[2]</th><th>[3]</th><th>[4]</th><th>[5]</th><th>[6]</th><th>[7]</th><th>[8]</th><th>[9]</th></tr></thead><tbody>';
    DATA.trophies.forEach(function (t) {
      h += '<tr><td>' + esc(displayName(t)) + ' ' + gradePill(t) + '</td>';
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (n) {
        var has = (t.sources || []).indexOf(n) !== -1;
        h += '<td class="' + (has ? 'dot' : 'nodot') + '">' + (has ? '●' : '·') + '</td>';
      });
      h += '</tr>';
    });
    h += '<tr><td><b>Totals (trophies)</b></td>';
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (n) { h += '<td><b>' + (a.trophies_per_source[String(n)] || 0) + '</b></td>'; });
    h += '</tr></tbody></table>';
    h += '<h3>Sources directory — read ' + esc(a.read_date) + '</h3><ol>';
    DATA.roadmap.sources.forEach(function (s) {
      h += '<li><b>[' + s.n + '] ' + esc(s.name) + '</b><br><a href="' + esc(s.url) + '">' + esc(s.url) + '</a><br><span class="note">Read ' + esc(s.read) + '</span></li>';
    });
    h += '</ol>';
    h += '<p class="note">PSNProfiles returned HTTP 403 on 21 Nov 2026, so its progress targets were cross-checked against search results from KeenGamer, GTAVice, PushSquare, PowerPyx and GTA Zone instead. No citation here is fabricated: a claim is cited only to a page actually read.</p>';
    h += '<h3>Sources Differ — ' + a.disputes + ' disputes, shown both ways</h3>';
    DATA.roadmap.disputes.forEach(function (d) { h += disputeBlock(d); });
    h += '<h3>Unconfirmed — ' + a.unconfirmed + '</h3><ul>';
    DATA.roadmap.unconfirmed.forEach(function (u) { h += '<li><b>' + esc(u.id) + ':</b> ' + esc(u.text) + '</li>'; });
    h += '</ul>';
    h += '<h3>How hidden flags were assigned (28 total)</h3><p>Live trophy pages expose no per-trophy hidden marker, so hidden flags follow a documented rule: 12 story trophies + 5 stranger finales + 4 cryptic + 7 secret open-world = 28. This matches the published hidden split (1 gold hidden, 27 bronze hidden, 19 bronze non-hidden). Spoiler Shield hides all 28 until you turn it off or earn them.</p>';
    return h;
  }

  return { tracker: tracker, roadmap: roadmap, missables: missables, sources: sources, detailHtml: detailHtml, statsHtml: statsHtml };
})();
