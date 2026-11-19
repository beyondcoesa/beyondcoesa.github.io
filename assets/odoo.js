/* ==========================================================
   Beyond Coesa — dati da Odoo
   Va incluso DOPO assets/data.js e PRIMA di assets/app.js.
   Se in config.js c'è un indirizzo dei dati (odoo + datiDaOdoo, oppure la modalità prova)
   carica <odoo>/beyond/api/data.js, che sostituisce window.BEYOND_DATA prima che le pagine
   lo usino. Se Odoo non risponde restano i dati di assets/data.js.
   In modalità prova mostra una fascia in alto con l'Odoo collegato.
   ========================================================== */
(function () {
  "use strict";
  var C = window.BEYOND_CONFIG || {};

  if (C.dati && document.readyState === "loading") {
    // Script bloccante: le pagine leggono BEYOND_DATA subito, quindi i dati devono essere già lì.
    document.write('<script src="' + String(C.dati).replace(/["<>]/g, "") +
      '" onerror="console.warn(\'Beyond: dati da Odoo non raggiungibili, uso quelli locali\')"><\/script>');
  }

  if (!C.odooProva) return;
  document.addEventListener("DOMContentLoaded", function () {
    var host = C.odooProva.replace(/^https?:\/\//, "");
    var bar = document.createElement("div");
    bar.setAttribute("role", "status");
    bar.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;" +
      "display:flex;gap:12px;align-items:center;max-width:calc(100% - 24px);padding:9px 16px;" +
      "border-radius:999px;background:#FFC72C;color:#111;box-shadow:0 6px 24px rgba(0,0,0,.35);" +
      "font:600 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center";
    bar.innerHTML = "<span>Modalità prova · collegato a <code style=\"font:inherit;font-weight:700\"></code></span>" +
      "<a href=\"?odoo=off\" style=\"color:#111;text-decoration:underline\">Esci dalla prova</a>";
    bar.querySelector("code").textContent = host;
    document.body.appendChild(bar);
  });
})();
