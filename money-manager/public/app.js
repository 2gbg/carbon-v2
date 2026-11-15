(() => {
  /* ================= constants ================= */
  const IN_CATS = [["Taschengeld","wallet","--green"],["Bayram","moon","--purple"],["Geburtstag","cake","--orange"],["Geschenk","gift","--red"],["Job / Hilfe","case","--teal"],["Sonstiges","spark","--blue"]];
  const OUT_CATS = [["Essen & Trinken","food","--orange"],["Spiele","game","--purple"],["Kleidung","shirt","--blue"],["Freizeit","ticket","--teal"],["Schule","book","--green"],["Sonstiges","bag","--red"]];
  const FILTERS = ["Alle","Bekommen","Ausgaben","Taschengeld","Bayram","Geburtstag"];
  const LS_KEY = "money-manager-v2", LS_OLD = "money-manager-v1", LS_TAB = "money-manager-tab";
  const PATHS = {
    wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="15" r="1.2" fill="currentColor"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    cake: '<path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 16.5c2 1.3 4 1.3 6 0s4-1.3 6 0 3 1 4 0"/><path d="M12 12V8"/><path d="M12 3.5c1 1 1 2.2 0 2.8-1-.6-1-1.8 0-2.8z"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13"/><path d="M12 8C10.5 4.5 7 4 7 6.2S10 8 12 8c2 0 5 .4 5-1.8S13.5 4.5 12 8z"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z"/>',
    food: '<path d="M5 3v5a2 2 0 0 0 4 0V3M7 10v11"/><path d="M17 21V3c-2 0-3.5 2.5-3.5 6s1.5 4 3.5 4"/>',
    game: '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor"/><circle cx="17.5" cy="14" r="1" fill="currentColor"/>',
    shirt: '<path d="M8.5 3L3 6l2 4.5 2.5-1.2V21h9V9.3L19 10.5 21 6l-5.5-3c0 1.8-1.6 3-3.5 3S8.5 4.8 8.5 3z"/>',
    ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M14.5 7v2M14.5 11v2M14.5 15v2"/>',
    book: '<path d="M2.5 5h6A3.5 3.5 0 0 1 12 8.5V20a2.5 2.5 0 0 0-2.5-2.5h-7z"/><path d="M21.5 5h-6A3.5 3.5 0 0 0 12 8.5V20a2.5 2.5 0 0 1 2.5-2.5h7z"/>',
    bag: '<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 8.6A4 4 0 1 0 15 15.4M7.5 11h5.5M7.5 13h5.5"/>',
    chart: '<path d="M3 21h18"/><rect x="5" y="11" width="3.5" height="7" rx="1"/><rect x="10.25" y="5" width="3.5" height="13" rx="1"/><rect x="15.5" y="8" width="3.5" height="10" rx="1"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    other: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>'
  };
  const svg = (k, size = 22, sw = 1.9) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[k] || PATHS.other}</svg>`;

  /* ================= helpers ================= */
  const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  const euro0 = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const fmt = c => euro.format(c / 100);
  const fmtShort = c => (c % 100 === 0 ? euro0 : euro).format(c / 100);
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const pad = n => String(n).padStart(2, "0");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const monthKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  const parseDate = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d || 1); };
  const monthName = (key, opts = { month: "long", year: "numeric" }) => parseDate(key + "-01").toLocaleDateString("de-DE", opts);
  const toCents = s => { const v = parseFloat(String(s).replace(/[\s€]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".")); return isFinite(v) && v > 0 ? Math.round(v * 100) : 0; };
  const centsToInput = c => c ? (c / 100).toFixed(2).replace(".", ",").replace(/,00$/, "") : "";
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const catInfo = (type, cat) => cat === "Sparziel" ? ["Sparziel", "target", "--orange"] : ((type === "in" ? IN_CATS : OUT_CATS).find(c => c[0] === cat) || [cat, "other", "--blue"]);
  const icoHTML = (type, cat) => { const [, k, col] = catInfo(type, cat); return `<span class="ico" style="background:color-mix(in srgb, var(${col}) 18%, transparent);color:var(${col})">${svg(k)}</span>`; };

  /* ================= model ================= */
  const blank = () => ({ v: 2, tx: [], goals: [], allowance: { enabled: false, amount: 2000, day: 1, paidThrough: null }, prefs: { hideBalance: false } });

  function migrate(raw) {
    if (!raw || typeof raw !== "object") return blank();
    const b = blank();
    if (raw.v === 2) {
      return {
        v: 2,
        tx: Array.isArray(raw.tx) ? raw.tx.filter(t => t && t.id && Number.isInteger(t.amount) && t.amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(t.date)) : [],
        goals: Array.isArray(raw.goals) ? raw.goals.filter(g => g && g.id && g.name && Number.isInteger(g.target)) : [],
        allowance: { ...b.allowance, ...(raw.allowance || {}) },
        prefs: { ...b.prefs, ...(raw.prefs || {}) },
      };
    }
    // v1 (Euro floats) -> v2 (cents)
    const a = raw.allowance || {};
    return {
      v: 2,
      tx: (raw.transactions || []).filter(t => t && !t.demo && +t.amount > 0).map(t => ({
        id: t.id || uid(), type: t.type === "out" ? "out" : "in", amount: Math.round(+t.amount * 100),
        cat: t.category || "Sonstiges", note: t.note || "", date: t.date || today(), ts: 0, auto: /automatisch/i.test(t.note || ""),
      })),
      goals: (raw.goals || []).map(g => ({ id: g.id || uid(), name: String(g.name || "Sparziel"), target: Math.round((+g.target || 0) * 100), saved: Math.round((+g.saved || 0) * 100), deadline: null })),
      allowance: { enabled: !!a.enabled, amount: Math.round((+a.amount || 20) * 100), day: Math.min(28, Math.max(1, +a.day || 1)), paidThrough: a.lastApplied || null },
      prefs: b.prefs,
    };
  }

  /** Books the monthly allowance for every pay day that has passed and was not booked yet. Pure. */
  function applyAllowance(s, now = new Date()) {
    const a = s.allowance;
    if (!a.enabled || a.amount <= 0) return s;
    let cursor = a.paidThrough ? (([y, m]) => new Date(y, m, 1))(a.paidThrough.split("-").map(Number)) : new Date(now.getFullYear(), now.getMonth(), 1);
    const add = []; let last = a.paidThrough;
    for (let i = 0; i < 240; i++) {
      const pay = new Date(cursor.getFullYear(), cursor.getMonth(), a.day);
      if (pay > now) break;
      add.push({ id: uid(), type: "in", amount: a.amount, cat: "Taschengeld", note: "Monatliches Taschengeld", date: iso(pay), ts: pay.getTime(), auto: true });
      last = monthKey(pay);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }
    return add.length ? { ...s, tx: [...add, ...s.tx], allowance: { ...a, paidThrough: last } } : s;
  }
  function nextPayday(a, now = new Date()) {
    let d = a.paidThrough ? (([y, m]) => new Date(y, m, a.day))(a.paidThrough.split("-").map(Number)) : new Date(now.getFullYear(), now.getMonth(), a.day);
    if (d <= now && !a.paidThrough) d = new Date(now.getFullYear(), now.getMonth() + 1, a.day);
    return d;
  }

  const balanceOf = (s, excludeId) => s.tx.reduce((sum, t) => t.id === excludeId ? sum : sum + (t.type === "in" ? t.amount : -t.amount), 0);
  const sumWhere = (s, fn) => s.tx.filter(fn).reduce((a, t) => a + t.amount, 0);
  const sortTx = list => list.slice().sort((a, b) => b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0));

  /* ================= app state ================= */
  let state = blank();
  let updatedAt = 0;               // when `state` last changed (local or remote)
  const ui = { tab: "home", filter: "Alle", q: "", demo: false, shown: 0, sheet: null, resetArmed: false, undo: null };
  let docRef = null, saveTimer = null, toastTimer = null, downloads = null;

  /* ================= persistence ================= */
  function setSync(text, ok = true) { $("sync").textContent = text; $("syncPill").classList.toggle("off", !ok); }
  function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify({ state, updatedAt })); } catch {} }
  function queueRemote() {
    if (!docRef) return;
    clearTimeout(saveTimer);
    setSync("Speichert …");
    saveTimer = setTimeout(async () => {
      saveTimer = null;
      try { await docRef.set({ state: clone(state), updated: updatedAt }); setSync("Synchronisiert"); }
      catch { setSync("Auf diesem Gerät", false); }
    }, 350);
  }
  /** The single way state changes: mutate a copy, then render + persist. */
  function change(mutator, undoLabel) {
    const before = clone(state);
    const next = clone(state);
    mutator(next);
    state = applyAllowance(next);
    updatedAt = Date.now();
    ui.demo = false;
    render(); saveLocal(); queueRemote();
    if (undoLabel) showToast(undoLabel, before);
  }

  /* ================= toast + undo ================= */
  function showToast(text, before) {
    ui.undo = before || null;
    $("toastText").textContent = text;
    $("toastUndo").hidden = !before;
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $("toast").hidden = true; ui.undo = null; }, before ? 6000 : 3000);
  }
  $("toastUndo").onclick = () => {
    if (!ui.undo) return;
    const prev = ui.undo; ui.undo = null;
    state = prev; updatedAt = Date.now(); render(); saveLocal(); queueRemote();
    showToast("Wiederhergestellt");
  };

  /* ================= render ================= */
  function animateBalance(to) {
    const el = $("balance");
    if (state.prefs.hideBalance) { el.textContent = "••••• €"; ui.shown = to; return; }
    const from = ui.shown; ui.shown = to;
    if (reduceMotion || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(from + (to - from) * e)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  function viewTx() { return ui.demo && !state.tx.length ? demoTx() : state.tx; }

  function renderHome() {
    const list = viewTx();
    const s = { ...state, tx: list };
    const now = new Date(), m = monthKey(now), pm = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const hide = state.prefs.hideBalance;
    const money = c => hide ? "•••" : fmt(c);
    const inM = sumWhere(s, t => t.type === "in" && t.cat !== "Sparziel" && t.date.startsWith(m));
    const outM = sumWhere(s, t => t.type === "out" && t.cat !== "Sparziel" && t.date.startsWith(m));
    const outPM = sumWhere(s, t => t.type === "out" && t.cat !== "Sparziel" && t.date.startsWith(pm));
    animateBalance(balanceOf(s));
    $("mIn").textContent = money(inM);
    $("mOut").textContent = money(outM);
    $("mSaved").textContent = money(state.goals.reduce((a, g) => a + g.saved, 0));
    $("eye").innerHTML = svg(hide ? "eyeOff" : "eye", 20);
    $("eye").setAttribute("aria-label", hide ? "Kontostand anzeigen" : "Kontostand verbergen");

    let tip = "";
    if (list.length) {
      if (outPM > 0 && outM < outPM) tip = `Du hast diesen Monat ${fmt(outPM - outM)} weniger ausgegeben als im ${monthName(pm, { month: "long" })}. Weiter so!`;
      else if (outPM > 0 && outM > outPM) tip = `Du hast diesen Monat schon ${fmt(outM - outPM)} mehr ausgegeben als im ${monthName(pm, { month: "long" })}.`;
      else if (state.allowance.enabled) tip = `Nächstes Taschengeld: ${fmt(state.allowance.amount)} am ${nextPayday(state.allowance).toLocaleDateString("de-DE", { day: "numeric", month: "long" })}.`;
      else if (outM === 0 && inM > 0) tip = "Diesen Monat noch nichts ausgegeben.";
    }
    if (hide) tip = "";
    $("insight").hidden = !tip;
    $("insight").innerHTML = tip ? `${svg("info", 16)}<span>${esc(tip)}</span>` : "";

    $("filterChips").innerHTML = FILTERS.map(f => `<button type="button" class="chip" data-filter="${f}" aria-pressed="${f === ui.filter}">${f}</button>`).join("");
    const q = ui.q.trim().toLowerCase();
    const shown = sortTx(list).filter(t => {
      const f = ui.filter;
      if (f === "Bekommen" && t.type !== "in") return false;
      if (f === "Ausgaben" && t.type !== "out") return false;
      if (!["Alle", "Bekommen", "Ausgaben"].includes(f) && t.cat !== f) return false;
      return !q || (t.cat + " " + t.note + " " + fmt(t.amount)).toLowerCase().includes(q);
    });
    $("countLabel").textContent = list.length ? `${shown.length} ${shown.length === 1 ? "Eintrag" : "Einträge"}` : "";

    if (!list.length) {
      $("history").innerHTML = `<div class="empty"><span class="big-ico">${svg("coin", 36)}</span><span>Noch keine Einträge. Tippe auf <b>+</b> unten rechts und trag dein erstes Geld ein, zum Beispiel dein Bayram- oder Geburtstagsgeld.</span><button class="btn ghost" type="button" id="demoBtn" style="padding:9px 18px;font-size:.9rem">Beispiel ansehen</button></div>`;
      return;
    }
    if (!shown.length) { $("history").innerHTML = `<div class="empty">Nichts gefunden.</div>`; return; }

    const groups = new Map();
    shown.forEach(t => { const k = t.date.slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(t); });
    let html = ui.demo ? `<p class="hint" style="margin:4px 2px 0">Das sind Beispiel-Einträge. Sobald du selbst etwas einträgst, verschwinden sie.</p>` : "";
    for (const [k, items] of groups) {
      const net = items.reduce((a, t) => a + (t.type === "in" ? t.amount : -t.amount), 0);
      html += `<div class="month-h"><span>${monthName(k)}</span><span class="num">${net >= 0 ? "+" : "−"}${fmt(Math.abs(net))}</span></div><ul class="list">`;
      html += items.map(t => {
        const editable = t.cat !== "Sparziel" && !ui.demo;
        const d = parseDate(t.date).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
        const inner = `${icoHTML(t.type, t.cat)}<span class="meta"><b>${esc(t.cat)}${t.auto ? '<span class="tag">Auto</span>' : ""}</b><small>${d}${t.note ? " · " + esc(t.note) : ""}</small></span><span class="amt ${t.type}">${t.type === "in" ? "+" : "−"}${fmt(t.amount)}</span>`;
        return `<li>${editable ? `<button type="button" class="row-btn" data-edit="${t.id}">${inner}</button>` : `<div class="row-btn">${inner}</div>`}</li>`;
      }).join("") + "</ul>";
    }
    $("history").innerHTML = html;
  }

  function niceMax(v) { if (v <= 0) return 1000; const e = Math.pow(10, Math.floor(Math.log10(v))); const f = v / e; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * e; }

  function renderStats() {
    const s = { ...state, tx: viewTx() };
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => monthKey(new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)));
    const data = months.map(m => ({
      m,
      inn: sumWhere(s, t => t.type === "in" && t.cat !== "Sparziel" && t.date.startsWith(m)),
      out: sumWhere(s, t => t.type === "out" && t.cat !== "Sparziel" && t.date.startsWith(m)),
    }));
    const max = niceMax(Math.max(...data.map(d => Math.max(d.inn, d.out))));
    const W = 320, H = 180, L = 44, R = 8, T = 12, B = 150;
    const gw = (W - L - R) / 6, bw = Math.min(14, gw / 2 - 4);
    const y = v => B - (v / max) * (B - T);
    let g = "";
    [0, .5, 1].forEach(f => { const yy = y(max * f); g += `<line class="grid" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/><text x="${L - 6}" y="${yy + 3}" text-anchor="end">${fmtShort(Math.round(max * f))}</text>`; });
    data.forEach((d, i) => {
      const cx = L + gw * i + gw / 2;
      const hi = B - y(d.inn), ho = B - y(d.out);
      if (d.inn) g += `<rect x="${cx - bw - 1.5}" y="${y(d.inn)}" width="${bw}" height="${Math.max(hi, 2)}" rx="4" fill="var(--green)"><title>${monthName(d.m)}: ${fmt(d.inn)} bekommen</title></rect>`;
      if (d.out) g += `<rect x="${cx + 1.5}" y="${y(d.out)}" width="${bw}" height="${Math.max(ho, 2)}" rx="4" fill="var(--red)"><title>${monthName(d.m)}: ${fmt(d.out)} ausgegeben</title></rect>`;
      g += `<text x="${cx}" y="${B + 16}" text-anchor="middle" style="${i === 5 ? "fill:var(--fg);font-weight:700" : ""}">${monthName(d.m, { month: "short" }).replace(".", "")}</text>`;
    });
    $("chart").innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Bekommen und ausgegeben, letzte 6 Monate">${g}</svg>`;

    const m = monthKey(now);
    $("outMonthLabel").textContent = monthName(m, { month: "long" });
    const bars = (type, filterFn, cats, emptyText) => {
      const rows = cats.map(([name, , col]) => ({ name, col, v: sumWhere(s, t => t.type === type && t.cat === name && filterFn(t)) })).filter(r => r.v > 0).sort((a, b) => b.v - a.v);
      const total = rows.reduce((a, r) => a + r.v, 0);
      if (!rows.length) return `<p class="hint" style="text-align:center;padding:8px 0">${emptyText}</p>`;
      return rows.map(r => `<div class="bar-row">${icoHTML(type, r.name)}<div style="min-width:0"><div class="lbl">${esc(r.name)}<span>${Math.round(r.v / total * 100)} %</span></div><div class="track"><i style="width:${(r.v / rows[0].v * 100).toFixed(1)}%;background:var(${r.col})"></i></div></div><span class="v">${fmt(r.v)}</span></div>`).join("");
    };
    $("catOut").innerHTML = bars("out", t => t.date.startsWith(m), OUT_CATS, "Diesen Monat noch keine Ausgaben.");
    $("catIn").innerHTML = bars("in", () => true, IN_CATS, "Noch kein Geld eingetragen.");
  }

  function ring(pct) {
    const r = 27, c = 2 * Math.PI * r, off = c * (1 - Math.min(pct, 100) / 100);
    return `<svg class="ring${pct >= 100 ? " done" : ""}" viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="${r}"/><circle class="fg" cx="32" cy="32" r="${r}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/><text x="32" y="32">${pct >= 100 ? "✓" : pct + "%"}</text></svg>`;
  }

  function renderGoals() {
    if (!state.goals.length) {
      $("goalList").innerHTML = `<div class="glass card empty"><span class="big-ico">${svg("target", 36)}</span>Noch keine Sparziele. Worauf sparst du? Ein Fahrrad, ein Spiel, neue Schuhe?</div>`;
      return;
    }
    const now = new Date();
    $("goalList").innerHTML = state.goals.map(g => {
      const pct = Math.min(100, Math.floor(g.saved / g.target * 100));
      const left = Math.max(0, g.target - g.saved);
      let plan = left === 0 ? "Ziel erreicht!" : `Noch ${fmt(left)}`;
      if (left > 0 && g.deadline) {
        const days = Math.ceil((parseDate(g.deadline) - now) / 864e5);
        if (days <= 0) plan += " · Termin ist vorbei";
        else { const weeks = Math.max(1, Math.ceil(days / 7)); plan += ` · ca. ${fmt(Math.ceil(left / weeks))} pro Woche bis ${parseDate(g.deadline).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`; }
      }
      return `<div class="glass card">
        <div class="goal-head">
          <div class="ring-wrap">${ring(pct)}<div style="min-width:0"><b>${esc(g.name)}</b><div class="hint num">${fmt(g.saved)} von ${fmt(g.target)}</div><div class="hint">${plan}</div></div></div>
          <button class="x" data-gdel="${g.id}" aria-label="Sparziel ${esc(g.name)} löschen">${svg("x", 14, 2.4)}</button>
        </div>
        <div class="row">
          <input id="dep-${g.id}" inputmode="decimal" placeholder="Betrag" aria-label="Betrag für ${esc(g.name)}">
          <button class="btn green" data-gsave="${g.id}">Sparen</button>
          <button class="btn ghost" data-gtake="${g.id}">Nehmen</button>
        </div>
        <p class="msg" id="gmsg-${g.id}" style="margin-top:8px"></p>
      </div>`;
    }).join("");
  }

  function renderSettings() {
    const a = state.allowance;
    $("alEnabled").setAttribute("aria-checked", String(a.enabled));
    if (document.activeElement !== $("alAmount")) $("alAmount").value = centsToInput(a.amount) + " €";
    $("alDay").value = String(a.day);
    $("alHint").textContent = a.enabled
      ? `Nächste Zahlung: ${fmt(a.amount)} am ${nextPayday(a).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}. Verpasste Monate werden nachgetragen.`
      : "Schalte es ein, damit dein Taschengeld jeden Monat von selbst eingetragen wird.";
    $("hideToggle").setAttribute("aria-checked", String(state.prefs.hideBalance));
    $("resetGroup").innerHTML = ui.resetArmed
      ? `<button class="gr btnrow danger" id="resetYes" type="button"><span><b>Ja, wirklich alles löschen</b></span></button><button class="gr btnrow" id="resetNo" type="button"><span>Abbrechen</span></button>`
      : `<button class="gr btnrow danger" id="reset" type="button"><span>Alle Daten löschen</span></button>`;
  }

  function render() { renderHome(); renderStats(); renderGoals(); renderSettings(); }

  function demoTx() {
    const d = n => { const x = new Date(); x.setDate(x.getDate() - n); return iso(x); };
    return [
      { id: "d1", type: "in", amount: 2000, cat: "Taschengeld", note: "Von Mama", date: d(2), auto: true },
      { id: "d2", type: "out", amount: 650, cat: "Essen & Trinken", note: "Döner mit Freunden", date: d(4) },
      { id: "d3", type: "in", amount: 5000, cat: "Bayram", note: "Von Dede", date: d(9) },
      { id: "d4", type: "out", amount: 1999, cat: "Spiele", note: "Skin im Spiel", date: d(12) },
      { id: "d5", type: "in", amount: 3000, cat: "Geburtstag", note: "Von Tante", date: d(36) },
      { id: "d6", type: "out", amount: 1200, cat: "Freizeit", note: "Kino", date: d(40) },
    ];
  }

  /* ================= tabs ================= */
  const TAB_ICONS = { home: "wallet", stats: "chart", goals: "target", settings: "sliders" };
  const TAB_LABELS = { home: "Übersicht", stats: "Statistik", goals: "Sparziele", settings: "Einstellungen" };
  document.querySelectorAll(".tabbar button").forEach(b => b.innerHTML = svg(TAB_ICONS[b.dataset.tab], 24) + `<span>${b.dataset.tab === "settings" ? "Mehr" : TAB_LABELS[b.dataset.tab]}</span>`);
  $("fab").innerHTML = svg("plus", 28, 2.4);
  $("searchIco").innerHTML = svg("search", 18);
  function showTab(name) {
    if (!TAB_LABELS[name]) name = "home";
    ui.tab = name;
    document.querySelectorAll(".tabbar button").forEach(x => x.setAttribute("aria-selected", String(x.dataset.tab === name)));
    Object.keys(TAB_LABELS).forEach(v => $("view-" + v).hidden = v !== name);
    $("pageTitle").textContent = TAB_LABELS[name];
    try { localStorage.setItem(LS_TAB, name); } catch {}
  }
  document.querySelector(".tabbar").addEventListener("click", e => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    showTab(b.dataset.tab); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ================= sheet (add / edit) ================= */
  const QUICK = [100, 500, 1000, 2000, 5000];
  $("sQuick").innerHTML = QUICK.map(c => `<button type="button" data-q="${c}">+${fmtShort(c)}</button>`).join("");
  let lastFocus = null;

  function openSheet(tx) {
    lastFocus = document.activeElement;
    ui.sheet = tx ? { id: tx.id, type: tx.type, cat: tx.cat } : { id: null, type: "in", cat: IN_CATS[0][0] };
    $("sheetTitle").textContent = tx ? "Eintrag bearbeiten" : "Neuer Eintrag";
    $("sAmount").value = tx ? centsToInput(tx.amount) : "";
    $("sDate").value = tx ? tx.date : today();
    $("sNote").value = tx ? tx.note : "";
    $("sMsg").textContent = "";
    $("sDelete").hidden = !tx;
    $("sSave").textContent = tx ? "Änderungen sichern" : "Speichern";
    renderSheet();
    $("sheet").hidden = false;
    document.body.classList.add("locked");
    setTimeout(() => $("sAmount").focus({ preventScroll: true }), 60);
  }
  function closeSheet() {
    $("sheet").hidden = true; ui.sheet = null;
    document.body.classList.remove("locked");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function renderSheet() {
    const s = ui.sheet;
    $("sIn").setAttribute("aria-pressed", String(s.type === "in"));
    $("sOut").setAttribute("aria-pressed", String(s.type === "out"));
    const cats = s.type === "in" ? IN_CATS : OUT_CATS;
    $("sCats").innerHTML = cats.map(([n, k]) => `<button type="button" data-cat="${esc(n)}" aria-pressed="${n === s.cat}">${svg(k, 22)}<span>${esc(n)}</span></button>`).join("");
    $("sSave").className = "btn" + (s.type === "in" ? " green" : "");
  }
  const setType = type => { if (ui.sheet.type === type) return; ui.sheet.type = type; ui.sheet.cat = (type === "in" ? IN_CATS : OUT_CATS)[0][0]; renderSheet(); };
  $("sIn").onclick = () => setType("in");
  $("sOut").onclick = () => setType("out");
  $("sCats").onclick = e => { const b = e.target.closest("[data-cat]"); if (b) { ui.sheet.cat = b.dataset.cat; renderSheet(); } };
  $("sQuick").onclick = e => { const b = e.target.closest("[data-q]"); if (!b) return; $("sAmount").value = centsToInput(toCents($("sAmount").value) + Number(b.dataset.q)); };
  $("sheet").addEventListener("click", e => { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("sheet").hidden) closeSheet(); });
  $("fab").onclick = () => openSheet(null);

  $("sheetForm").onsubmit = e => {
    e.preventDefault();
    const s = ui.sheet;
    const amount = toCents($("sAmount").value);
    const date = $("sDate").value || today();
    if (!amount) { $("sMsg").textContent = "Gib einen Betrag ein, zum Beispiel 12,50."; $("sAmount").focus(); return; }
    if (amount > 10000000) { $("sMsg").textContent = "Der Betrag ist zu groß."; return; }
    if (s.type === "out") {
      const avail = balanceOf(state, s.id);
      if (amount > avail) { $("sMsg").textContent = `So viel Geld hast du nicht. Verfügbar: ${fmt(avail)}.`; return; }
    }
    const note = $("sNote").value.trim();
    const isEdit = !!s.id;
    change(st => {
      if (isEdit) {
        const t = st.tx.find(x => x.id === s.id);
        if (t) Object.assign(t, { type: s.type, cat: s.cat, amount, date, note, auto: t.auto && t.cat === s.cat && t.amount === amount });
      } else {
        st.tx.unshift({ id: uid(), type: s.type, amount, cat: s.cat, note, date, ts: Date.now() });
      }
    }, isEdit ? "Eintrag geändert" : (s.type === "in" ? `+${fmt(amount)} eingetragen` : `−${fmt(amount)} eingetragen`));
    closeSheet();
  };
  $("sDelete").onclick = () => {
    const id = ui.sheet.id;
    closeSheet();
    change(st => { st.tx = st.tx.filter(t => t.id !== id); }, "Eintrag gelöscht");
  };

  /* ================= home events ================= */
  $("view-home").addEventListener("click", e => {
    const f = e.target.closest("[data-filter]");
    if (f) { ui.filter = f.dataset.filter; renderHome(); return; }
    const ed = e.target.closest("[data-edit]");
    if (ed) { const t = state.tx.find(x => x.id === ed.dataset.edit); if (t) openSheet(t); return; }
    if (e.target.closest("#demoBtn")) { ui.demo = true; render(); }
  });
  $("q").addEventListener("input", e => { ui.q = e.target.value; renderHome(); });
  $("eye").onclick = () => change(st => { st.prefs.hideBalance = !st.prefs.hideBalance; });

  /* ================= goals events ================= */
  $("goalForm").onsubmit = e => {
    e.preventDefault();
    const name = $("goalName").value.trim(), target = toCents($("goalTarget").value), deadline = $("goalDeadline").value || null;
    if (!name || !target) { $("goalMsg").textContent = "Gib einen Namen und einen Zielbetrag ein."; return; }
    $("goalMsg").textContent = "";
    change(st => { st.goals.push({ id: uid(), name: name.slice(0, 60), target, saved: 0, deadline }); }, `Sparziel „${name}“ angelegt`);
    $("goalName").value = ""; $("goalTarget").value = ""; $("goalDeadline").value = "";
  };
  $("goalList").addEventListener("click", e => {
    const move = (id, dir) => {
      const g = state.goals.find(x => x.id === id); if (!g) return;
      const v = toCents($("dep-" + id).value), msg = $("gmsg-" + id);
      if (!v) { msg.textContent = "Gib einen Betrag ein."; return; }
      if (dir > 0 && v > balanceOf(state)) { msg.textContent = `Nicht genug Geld. Verfügbar: ${fmt(balanceOf(state))}.`; return; }
      if (dir < 0 && v > g.saved) { msg.textContent = `In diesem Sparziel sind nur ${fmt(g.saved)}.`; return; }
      const reached = dir > 0 && g.saved < g.target && g.saved + v >= g.target;
      change(st => {
        const gg = st.goals.find(x => x.id === id);
        gg.saved += dir * v;
        st.tx.unshift({ id: uid(), type: dir > 0 ? "out" : "in", amount: v, cat: "Sparziel", goalId: id, note: dir > 0 ? `Gespart für ${gg.name}` : `Aus ${gg.name} genommen`, date: today(), ts: Date.now() });
      }, reached ? `Geschafft! „${g.name}“ ist voll.` : (dir > 0 ? `${fmt(v)} gespart` : `${fmt(v)} zurück aufs Konto`));
    };
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.gsave) move(b.dataset.gsave, 1);
    else if (b.dataset.gtake) move(b.dataset.gtake, -1);
    else if (b.dataset.gdel) {
      const g = state.goals.find(x => x.id === b.dataset.gdel); if (!g) return;
      change(st => {
        if (g.saved > 0) st.tx.unshift({ id: uid(), type: "in", amount: g.saved, cat: "Sparziel", goalId: g.id, note: `${g.name} aufgelöst`, date: today(), ts: Date.now() });
        st.goals = st.goals.filter(x => x.id !== g.id);
      }, g.saved > 0 ? `Gelöscht · ${fmt(g.saved)} zurück aufs Konto` : "Sparziel gelöscht");
    }
  });
  $("goalList").addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id && e.target.id.startsWith("dep-")) { e.preventDefault(); $("goalList").querySelector(`[data-gsave="${e.target.id.slice(4)}"]`)?.click(); }
  });

  /* ================= settings events ================= */
  for (let i = 1; i <= 28; i++) $("alDay").insertAdjacentHTML("beforeend", `<option value="${i}">${i}.</option>`);
  $("alEnabled").onclick = () => {
    const turningOn = !state.allowance.enabled;
    const before = state.tx.length;
    change(st => {
      const a = st.allowance;
      a.enabled = turningOn;
      if (turningOn) {
        const now = new Date(), prev = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        if (!a.paidThrough || a.paidThrough < prev) a.paidThrough = prev; // never re-pay a month that was already booked
      }
    });
    const added = state.tx.length - before;
    showToast(turningOn ? (added ? `Taschengeld für ${monthName(monthKey(new Date()), { month: "long" })} eingetragen` : "Automatisches Taschengeld ist an") : "Automatisches Taschengeld ist aus");
  };
  $("alAmount").addEventListener("focus", e => { e.target.value = centsToInput(state.allowance.amount); });
  $("alAmount").addEventListener("change", e => {
    const v = toCents(e.target.value);
    if (!v) { renderSettings(); return; }
    change(st => { st.allowance.amount = v; });
  });
  $("alAmount").addEventListener("blur", () => renderSettings());
  $("alDay").addEventListener("change", e => change(st => { st.allowance.day = Number(e.target.value); }));
  $("hideToggle").onclick = () => change(st => { st.prefs.hideBalance = !st.prefs.hideBalance; });

  $("resetGroup").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "reset") { ui.resetArmed = true; renderSettings(); }
    else if (b.id === "resetNo") { ui.resetArmed = false; renderSettings(); }
    else if (b.id === "resetYes") { ui.resetArmed = false; change(st => { Object.assign(st, blank()); }, "Alle Daten gelöscht"); }
  });

  const backupJSON = () => JSON.stringify({ app: "money-manager", exported: new Date().toISOString(), state }, null, 2);
  function backupCSV() {
    const rows = [["Datum", "Art", "Kategorie", "Betrag (EUR)", "Notiz"]];
    sortTx(state.tx).forEach(t => rows.push([parseDate(t.date).toLocaleDateString("de-DE"), t.type === "in" ? "Bekommen" : "Ausgegeben", t.cat, (t.type === "in" ? "" : "-") + (t.amount / 100).toFixed(2).replace(".", ","), t.note]));
    return "﻿" + rows.map(r => r.map(c => /[;"\n]/.test(c) ? `"${String(c).replace(/"/g, '""')}"` : c).join(";")).join("\r\n");
  }
  async function save(filename, data) {
    if (!downloads) {
      const type = filename.endsWith(".csv") ? "text/csv;charset=utf-8" : "application/json";
      const url = URL.createObjectURL(new Blob([data], { type }));
      const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000); showToast("Gespeichert"); return;
    }
    try { const r = await downloads.save({ filename, data }); if (r === "saved" || r?.status === "saved") showToast("Gespeichert"); }
    catch (err) { if (err?.code !== "cancelled" && err?.code !== "dismissed") showToast("Speichern hat nicht geklappt"); }
  }
  $("expJson").onclick = () => save(`money-manager-backup-${today()}.json`, backupJSON());
  $("expCsv").onclick = () => save(`money-manager-${today()}.csv`, backupCSV());
  $("copyJson").onclick = () => {
    navigator.clipboard.writeText(backupJSON()).then(() => showToast("Backup kopiert"), () => showToast("Kopieren geht hier leider nicht"));
  };
  $("impFile").addEventListener("change", async e => {
    const file = e.target.files && e.target.files[0]; e.target.value = "";
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      const next = migrate(raw && raw.state ? raw.state : raw);
      if (!next.tx.length && !next.goals.length) throw new Error("empty");
      change(st => { Object.assign(st, next); }, `Backup geladen · ${next.tx.length} Einträge`);
    } catch { showToast("Diese Datei ist kein gültiges Money-Manager-Backup"); }
  });

  /* ================= boot ================= */
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (raw) { state = migrate(raw.state); updatedAt = raw.updatedAt || 0; }
    else { const old = JSON.parse(localStorage.getItem(LS_OLD) || "null"); if (old) state = migrate(old); }
  } catch {}
  state = applyAllowance(state);
  try { showTab(localStorage.getItem(LS_TAB) || "home"); } catch { showTab("home"); }
  render();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    const next = applyAllowance(state);
    if (next !== state) { state = next; updatedAt = Date.now(); render(); saveLocal(); queueRemote(); }
  });

  (async () => {
    const use = n => (window.claude && window.claude.use ? window.claude.use(n) : Promise.resolve(null));
    use("downloads").then(d => { downloads = d; $("copyJson").hidden = true; }).catch(() => {});
    const timer = setTimeout(() => setSync("Auf diesem Gerät", false), 10000);
    try {
      const [db, user] = await Promise.all([use("db"), use("user")]);
      const id = db && user ? await user.id() : null;
      if (!db || !id) {
        clearTimeout(timer); setSync("Auf diesem Gerät", false);
        $("footnote").textContent = "Deine Einträge werden in diesem Browser gespeichert. Mach ab und zu ein Backup unter „Mehr“.";
        return;
      }
      docRef = db.doc(`data/users/${id}/money`);
      docRef.onSnapshot(snap => {
        if (snap.metadata.hasPendingWrites) return;
        if (!snap.metadata.fromCache) clearTimeout(timer);
        const d = snap.exists ? snap.data() : null;
        if (!d || !d.state) {
          if (state.tx.length || state.goals.length || state.allowance.enabled) { updatedAt = updatedAt || Date.now(); queueRemote(); }
          else setSync("Bereit");
          return;
        }
        const remoteAt = Number(d.updated) || 0;
        if (remoteAt > updatedAt) {
          const remote = migrate(clone(d.state));
          const applied = applyAllowance(remote);
          state = applied; updatedAt = remoteAt; render(); saveLocal();
          if (applied !== remote) { updatedAt = Date.now(); queueRemote(); }
        } else if (remoteAt < updatedAt) {
          queueRemote(); // this device has newer changes (e.g. made offline)
        }
        if (!saveTimer || remoteAt >= updatedAt) setSync(snap.metadata.fromCache ? "Offline" : "Synchronisiert", !snap.metadata.fromCache);
      }, () => { clearTimeout(timer); docRef = null; setSync("Auf diesem Gerät", false); });
    } catch { clearTimeout(timer); docRef = null; setSync("Auf diesem Gerät", false); }
  })();
})();
