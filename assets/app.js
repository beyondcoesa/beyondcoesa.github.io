/* ==========================================================
   Beyond Coesa — script condiviso
   Tema chiaro/scuro, utilità comuni, animazione dell'hero.
   ========================================================== */
(function () {
  "use strict";
  var B = (window.Beyond = window.Beyond || {});
  var root = document.documentElement;

  /* ---------- tema ---------- */
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  B.storeGet = storeGet; B.storeSet = storeSet;

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    storeSet("beyond-theme", t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#08090A" : "#F4F4F1");
    document.dispatchEvent(new CustomEvent("beyond:theme", { detail: t }));
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-toggle]");
    if (!b) return;
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- etichette e formati ---------- */
  var MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  var MESI_L = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  B.parseDate = function (s) { if (!s) return null; var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  B.fmtDate = function (s, long) {
    var d = B.parseDate(s); if (!d) return "–";
    return d.getDate() + " " + (long ? MESI_L : MESI)[d.getMonth()] + (long || d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : "");
  };
  B.today = function () { var d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  B.daysTo = function (s) { var d = B.parseDate(s); return d ? Math.round((d - B.today()) / 86400000) : null; };
  // giorni lavorativi trascorsi da una data a oggi
  B.workdaysSince = function (s) {
    var d = B.parseDate(s); if (!d) return null;
    var n = 0, t = B.today();
    while (d < t) { d.setDate(d.getDate() + 1); var g = d.getDay(); if (g !== 0 && g !== 6) n++; }
    return n;
  };

  B.FASI = ["Segnalazione", "MVP e istruzioni", "Triage", "Valutazione", "Priorità", "Piano 90 giorni", "Delivery", "Misura e chiusura"];
  B.ESITI = {
    accettata: { t: "Accettata", c: "pos" },
    integrare: { t: "Da integrare", c: "amber" },
    "senza-ai": { t: "Risolvibile senza AI", c: "info" },
    coperta: { t: "Già coperta", c: "ghost" },
    "non-ora": { t: "Non ora", c: "line" }
  };
  B.COLONNE = { now: "Now", next: "Next", later: "Later", nonora: "Non ora" };
  B.STADI = { build: { t: "Build", c: "info" }, pilota: { t: "Pilota", c: "amber" }, rollout: { t: "Rollout", c: "pos" } };
  B.SEMAFORO = { verde: "Verde", giallo: "Giallo", rosso: "Rosso" };

  /* ---------- punteggio (documento di governance) ----------
     Voti 1-5 per criterio; punteggio 0-100 = somma dei voti pesati × 20 */
  B.CRITERI = [
    { id: "valore", nome: "Valore per il business", peso: 0.30, dom: "Ore liberate, margine o qualità guadagnati, rischio evitato" },
    { id: "fattibilita", nome: "Fattibilità e dati", peso: 0.20, dom: "I dati ci sono e sono utilizzabili? La tecnologia è matura?" },
    { id: "impegno", nome: "Impegno (inverso)", peso: 0.15, dom: "Quante giornate servono? Meno giornate, più punti" },
    { id: "riuso", nome: "Riuso e scalabilità", peso: 0.15, dom: "Altre funzioni o progetti del portafoglio ne beneficiano?" },
    { id: "strategia", nome: "Allineamento strategico", peso: 0.10, dom: "Sostiene le priorità fissate dalla Direzione per l'anno?" },
    { id: "rischio", nome: "Rischio (inverso)", peso: 0.10, dom: "Dati sensibili, compliance, dipendenze da terzi" }
  ];
  B.score = function (v) {
    if (!v) return null;
    var s = 0; B.CRITERI.forEach(function (c) { s += (v[c.id] || 0) * c.peso; });
    return Math.round(s * 20);
  };

  B.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  B.pill = function (t, c, dot) { return '<span class="pill ' + c + '">' + (dot ? '<i class="dot"></i>' : "") + B.esc(t) + "</span>"; };
  B.sem = function (s) { return s ? '<span class="sem ' + s + '"><i></i>' + B.SEMAFORO[s] + "</span>" : ""; };

  /* ---------- icone ---------- */
  var HEX = '<rect class="hx" x="5" y="2" width="38" height="38" rx="11"/>';
  B.ICONS = {
    verbale: '<g class="gl" transform="translate(12 9)"><rect x="4" y="3" width="16" height="20" rx="2.5"/><path d="M8.5 3V1.5h7V3M8.5 10h7M8.5 14h7M8.5 18h4"/></g>',
    cashflow: '<g class="gl" transform="translate(12 9)"><path d="M2 22h20"/><path d="M3.5 17 9 11.5l4 3.5 7.5-8.5"/><path d="M15.5 6.5h5v5"/></g>',
    offerta: '<g class="gl" transform="translate(12 9)"><path d="M6 2.5h9l5 5V21a1.5 1.5 0 0 1-1.5 1.5h-12.5A1.5 1.5 0 0 1 4.5 21V4A1.5 1.5 0 0 1 6 2.5z"/><path d="M14.5 2.5V8h5.5"/><path d="M9 15l2.2 2.2L16 12.5"/></g>',
    plus: '<g class="gl" transform="translate(12 9)"><path d="M12 6v14M5 13h14"/></g>',
    telefono: '<g class="gl" transform="translate(12 9)"><path d="M6.5 2.5h3l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4.5 4.5a2 2 0 0 1 2-2z"/></g>',
    tool: '<g class="gl" transform="translate(12 9)"><circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5"/></g>',
    idea: '<g class="gl" transform="translate(12 9)"><path d="M9 18.5h6M10 21.5h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2v.5h5V16c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></g>',
    piano: '<g class="gl" transform="translate(12 9)"><rect x="3" y="4" width="18" height="17" rx="2.5"/><path d="M9 4v17M15 4v17"/><path d="M5.5 8.5h1.5M11 8.5h2M11 12h2M17 8.5h1.5"/></g>',
    processo: '<g class="gl" transform="translate(12 9)"><circle cx="5.5" cy="6.5" r="2.5"/><circle cx="18.5" cy="6.5" r="2.5"/><circle cx="12" cy="18.5" r="2.5"/><path d="M8 6.5h8M7 8.7l3.6 7.6M17 8.7l-3.6 7.6"/></g>'
  };
  B.toolIcon = function (k) {
    return '<svg class="tool-ico" viewBox="0 0 48 42" aria-hidden="true">' + HEX + (B.ICONS[k] || B.ICONS.tool) + "</svg>";
  };
  B.GRID = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>';
  B.ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  B.CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  /* ---------- stato degli strumenti (dati + link di config.js) ---------- */
  B.STATI_TOOL = {
    attivo: { t: "Attivo", c: "pos" },
    pilota: { t: "In pilota", c: "amber" },
    sviluppo: { t: "In sviluppo", c: "info" },
    arrivo: { t: "In arrivo", c: "ghost" }
  };
  B.tools = function () {
    var D = window.BEYOND_DATA || {}, links = ((window.BEYOND_CONFIG || {}).links) || {};
    return (D.strumenti || []).map(function (t) {
      var url = links[t.id] || t.url || "";
      return Object.assign({}, t, { url: url, apribile: !!url });
    });
  };

  /* ---------- comparsa allo scorrimento ---------- */
  function reveal() {
    var els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  B.reveal = reveal;

  /* bagliore delle schede che segue il cursore */
  document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".tool,.app");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  /* ---------- hero: rete esagonale percorsa da impulsi di energia ---------- */
  function heroCanvas(cv) {
    var ctx = cv.getContext("2d");
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var W, H, dpr, nodes, edges, adj, cells, pulses = [], raf, density = +(cv.dataset.density || 1);

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var s = W < 700 ? 30 : 44;                     // lato dell'esagono
      var hw = s * 1.5, vh = Math.sqrt(3) * s;       // passo orizzontale / verticale (esagoni a punta piatta)
      var key = {}, id = 0; nodes = []; edges = []; adj = []; cells = [];
      function node(x, y) {
        var k = Math.round(x) + ":" + Math.round(y);
        if (key[k] == null) { key[k] = id++; nodes.push({ x: x, y: y }); adj.push([]); }
        return key[k];
      }
      var ek = {};
      for (var c = -1; c * hw < W + s * 2; c++) {
        for (var rr = -1; rr * vh < H + vh; rr++) {
          var cx = c * hw, cy = rr * vh + (c % 2 ? vh / 2 : 0), ids = [];
          for (var i = 0; i < 6; i++) {
            var a = Math.PI / 3 * i;
            ids.push(node(cx + s * Math.cos(a), cy + s * Math.sin(a)));
          }
          cells.push({ x: cx, y: cy, ids: ids, glow: Math.random() < 0.06 ? Math.random() : 0 });
          for (var j = 0; j < 6; j++) {
            var p = ids[j], q = ids[(j + 1) % 6], k2 = Math.min(p, q) + "-" + Math.max(p, q);
            if (!ek[k2]) { ek[k2] = 1; edges.push([p, q]); adj[p].push(q); adj[q].push(p); }
          }
        }
      }
      pulses = [];
      var n = Math.round((W * H) / 26000 * density);
      for (var z = 0; z < n; z++) pulses.push(newPulse());
    }
    function newPulse() {
      var a = Math.floor(Math.random() * nodes.length);
      var nb = adj[a]; var b = nb[Math.floor(Math.random() * nb.length)];
      // impulsi lilla, uno su cinque nel giallo Coesa
      var c = Math.random() < 0.3 ? "255,236,190" : "255,190,60";
      return { a: a, b: b, c: c, t: Math.random(), v: 0.006 + Math.random() * 0.012, trail: [], life: 120 + Math.random() * 260 };
    }
    // più visibile a destra, dove non c'è testo
    function fade(x) { var f = x / W; return Math.max(0.12, Math.min(1, (f - 0.25) * 1.6)); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // celle accese
      cells.forEach(function (c) {
        if (!c.glow) return;
        ctx.beginPath();
        c.ids.forEach(function (id, i) { var n = nodes[id]; i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y); });
        ctx.closePath();
        ctx.fillStyle = "rgba(255,190,60," + (0.05 * c.glow * fade(c.x)) + ")";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,190,60," + (0.3 * c.glow * fade(c.x)) + ")";
        ctx.lineWidth = 1.2; ctx.stroke();
      });
      // rete
      ctx.lineWidth = 1;
      edges.forEach(function (e) {
        var p = nodes[e[0]], q = nodes[e[1]];
        ctx.strokeStyle = "rgba(255,255,255," + (0.06 * fade((p.x + q.x) / 2)) + ")";
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      });
      // impulsi
      pulses.forEach(function (p) {
        var A = nodes[p.a], Bn = nodes[p.b];
        var x = A.x + (Bn.x - A.x) * p.t, y = A.y + (Bn.y - A.y) * p.t;
        p.trail.push({ x: x, y: y }); if (p.trail.length > 22) p.trail.shift();
        var f = fade(x) * Math.min(1, p.life / 60);
        for (var i = 1; i < p.trail.length; i++) {
          var a0 = p.trail[i - 1], a1 = p.trail[i];
          ctx.strokeStyle = "rgba(" + p.c + "," + (i / p.trail.length) * 0.6 * f + ")";
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(a1.x, a1.y); ctx.stroke();
        }
        var g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, "rgba(" + p.c + "," + 0.9 * f + ")");
        g.addColorStop(1, "rgba(" + p.c + ",0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      });
    }
    function step() {
      pulses.forEach(function (p, i) {
        p.t += p.v; p.life--;
        if (p.t >= 1) {
          var nb = adj[p.b].filter(function (n) { return n !== p.a; });
          p.a = p.b; p.b = nb[Math.floor(Math.random() * nb.length)]; p.t = 0;
        }
        if (p.life <= 0) pulses[i] = newPulse();
      });
      draw();
      raf = requestAnimationFrame(step);
    }
    build();
    if (reduce) { draw(); }
    else {
      raf = requestAnimationFrame(step);
      // pausa quando l'hero non è visibile
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) {
          cancelAnimationFrame(raf);
          if (en[0].isIntersecting) raf = requestAnimationFrame(step);
        }).observe(cv);
      }
    }
    var tmo;
    window.addEventListener("resize", function () { clearTimeout(tmo); tmo = setTimeout(function () { build(); if (reduce) draw(); }, 150); });
  }

  /* menu della barra (telefono) e stato "scrolled" */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-menu-toggle]");
    if (b) { var h = b.closest("header.top"); var o = h.classList.toggle("open"); b.setAttribute("aria-expanded", o); return; }
    var hd = document.querySelector("header.top.open");
    if (hd && !e.target.closest("header.top")) { hd.classList.remove("open"); }
  });
  function onScroll() {
    var y = window.scrollY || 0;
    var h = document.querySelector("header.top"); if (h) h.classList.toggle("scrolled", y > 24);
    root.style.setProperty("--sy", Math.min(y, 1200));
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-icon]").forEach(function (e) { e.outerHTML = B.toolIcon(e.getAttribute("data-icon")); });
    onScroll();
    document.querySelectorAll("canvas.hero-canvas").forEach(heroCanvas);
    reveal();
    // badge "dati di esempio" dove serve
    var D = window.BEYOND_DATA;
    if (!D || !D.esempio) document.querySelectorAll("[data-if-sample]").forEach(function (e) { e.remove(); });
  });
})();
