/* ==========================================================
   Beyond Coesa — accesso
   Va incluso nel <head> di ogni pagina, prima del foglio di stile.
   Senza una sessione valida porta alla pagina accesso.html; con la sessione
   aggiunge nell'intestazione il pulsante con le iniziali dell'utente e "Esci".

   Nota: il sito è statico, quindi questo è un cancello d'ingresso, non una cassaforte.
   I dati veri (Odoo) dovranno essere chiesti al server solo con un accesso verificato lì.
   ========================================================== */
(function () {
  "use strict";
  var CHIAVE = "beyond-sessione";

  function leggi() {
    try {
      var s = JSON.parse(localStorage.getItem(CHIAVE) || "null");
      if (s && s.scade > Date.now() && s.nome) return s;
      if (s) localStorage.removeItem(CHIAVE);
    } catch (e) {}
    return null;
  }

  var pagina = location.pathname.split("/").pop() || "index.html";
  var suLogin = pagina === "accesso.html";
  var sessione = leggi();

  window.BeyondAccesso = {
    CHIAVE: CHIAVE,
    sessione: sessione,
    salva: function (s) { try { localStorage.setItem(CHIAVE, JSON.stringify(s)); return true; } catch (e) { return false; } },
    esci: function () { try { localStorage.removeItem(CHIAVE); } catch (e) {} location.replace("accesso.html"); }
  };

  if (!sessione && !suLogin) {
    document.documentElement.style.visibility = "hidden";
    var torna = pagina + location.search + location.hash;
    location.replace("accesso.html" + (torna && torna !== "index.html" ? "?torna=" + encodeURIComponent(torna) : ""));
    return;
  }
  if (!sessione) return;

  /* ---------- utente nell'intestazione ---------- */
  function iniziali(nome) {
    var p = String(nome).trim().split(/\s+/);
    return ((p[0] || "").charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase();
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.querySelector(".top-actions");
    if (!box) return;
    var wrap = document.createElement("div");
    wrap.className = "user-menu";
    wrap.innerHTML =
      '<button type="button" class="user-btn" aria-haspopup="true" aria-expanded="false" title="' + esc(sessione.nome) + '">' +
        '<span class="av" aria-hidden="true">' + esc(iniziali(sessione.nome)) + "</span>" +
        '<span class="sr-only">Utente: ' + esc(sessione.nome) + "</span>" +
      "</button>" +
      '<div class="user-pop" role="menu" hidden>' +
        '<div class="who"><b>' + esc(sessione.nome) + "</b><span>Accesso valido fino alle " +
          new Date(sessione.scade).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) +
          (new Date(sessione.scade).toDateString() !== new Date().toDateString()
            ? " del " + new Date(sessione.scade).toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "") +
        "</span></div>" +
        '<button type="button" role="menuitem" data-esci>' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"/></svg>' +
          "Esci</button>" +
      "</div>";
    box.insertBefore(wrap, box.firstChild);

    var btn = wrap.querySelector(".user-btn"), pop = wrap.querySelector(".user-pop");
    function apri(on) { pop.hidden = !on; btn.setAttribute("aria-expanded", on ? "true" : "false"); }
    btn.addEventListener("click", function (e) { e.stopPropagation(); apri(pop.hidden); });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) apri(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") apri(false); });
    wrap.querySelector("[data-esci]").addEventListener("click", window.BeyondAccesso.esci);
  });

  // se la sessione scade mentre la pagina è aperta
  setInterval(function () { if (!leggi()) window.BeyondAccesso.esci(); }, 60000);
})();
