/* ==========================================================
   Beyond Coesa — configurazione
   Modifica qui link e destinazione del form, senza toccare l'HTML.
   ========================================================== */
window.BEYOND_CONFIG = {
  // Link degli strumenti nel catalogo (la chiave è l'id in data.js).
  // Lascia "" per mostrare lo strumento come "In arrivo".
  links: {
    verbali: "https://coesaenergy.netlify.app",      // in locale: cartella verbali/. Su GitHub Pages diventa la variabile VERBALI_URL (app su Netlify)
    cashflow: "",             // es. "https://beyond.coesaenergy.it/cashflow/"
    isabella: "https://beyondcoesa.github.io/isabella/",  // app tool-isabella (login proprio), pubblicata dalla sua repo
    cme: "https://web-production-a5e350.up.railway.app/"   // Aggiornamento CME (cartella aggiornamento-cme/, backend Python su Railway): indirizzo del servizio
  },

  // Accesso (accesso.html): durata della sessione in ore.
  // "ricordami" = durata se l'utente spunta "Ricordami su questo dispositivo".
  accesso: {
    ore: 12,
    ricordamiOre: 24 * 7
  },

  // Odoo con il modulo coesa_beyond installato (vedi odoo/INSTALLAZIONE-ODOO-SH.md).
  // Produzione: "https://coesaenergy.odoo.com". Vuoto = sito scollegato da Odoo.
  // Con un indirizzo, "Carica il tuo progetto" invia a <odoo>/beyond/api/richiesta.
  odoo: "https://coesaenergy.odoo.com",

  // true = strumenti, piano, backlog, decisioni e indicatori letti da <odoo>/beyond/api/data.js.
  // Attivalo quando in Odoo sono compilati strumenti, trimestre e voci "Pubblica su Beyond".
  // Se Odoo non risponde restano i dati di assets/data.js.
  datiDaOdoo: false,

  // Indirizzo esplicito dei dati (sostituisce il precedente). Di norma resta vuoto.
  dati: "",

  // Form "Carica il tuo progetto" (Idea Card + Pacchetto di richiesta)
  proponi: {
    // URL che riceve il form in POST (multipart/form-data). Di norma resta vuoto: con "odoo"
    // compilato si usa <odoo>/beyond/api/richiesta. Serve solo per un ricevitore diverso da Odoo.
    // Campi testuali: vedi README. File: "mvp_files" e "dati_files" (uno per file).
    // Se non c'è né questo né "odoo" la pagina funziona in modalità anteprima e non invia nulla.
    endpoint: "",
    dominiEmail: ["coesaenergy.com", "coesaenergy.it"],   // email accettate (vuoto = tutte)
    maxFileMB: 15,     // dimensione massima per singolo file
    maxFiles: 10,      // numero massimo di file per ciascuna area di caricamento
    maxTesto: 2000     // lunghezza massima dei campi descrittivi
  }
};

/* ----------------------------------------------------------
   Collegamento a Odoo: configurazione effettiva.
   Modalità prova: aprendo una pagina con ?odoo=<indirizzo> il sito, solo in quella scheda
   del browser, si collega a un altro Odoo (es. la build di staging di Odoo.sh) con
   invio e dati. ?odoo=off torna alla configurazione normale. Sono ammessi solo indirizzi
   *.odoo.com con "coesa" nel nome e, per le prove dal PC, 127.0.0.1 / localhost.
   ---------------------------------------------------------- */
(function (C) {
  "use strict";
  var CHIAVE = "beyond-odoo-prova";
  var AMMESSI = /^(https:\/\/[a-z0-9-]*coesa[a-z0-9-]*\.(dev\.)?odoo\.com|http:\/\/(127\.0\.0\.1|localhost)(:\d+)?)$/i;
  var prova = null;
  try {
    var q = new URLSearchParams(location.search).get("odoo");
    if (q !== null) {
      q = q.trim().replace(/\/+$/, "");
      if (q === "" || q === "off") sessionStorage.removeItem(CHIAVE);
      else if (AMMESSI.test(q)) sessionStorage.setItem(CHIAVE, q);
      else console.warn("Beyond: indirizzo Odoo di prova non ammesso:", q);
    }
    prova = sessionStorage.getItem(CHIAVE);
  } catch (e) {}

  var base = (prova || C.odoo || "").replace(/\/+$/, "");
  var p = C.proponi = C.proponi || {};
  if (prova) {
    p.endpoint = base + "/beyond/api/richiesta";
    C.dati = base + "/beyond/api/data.js";
  } else if (base) {
    if (!p.endpoint) p.endpoint = base + "/beyond/api/richiesta";
    if (!C.dati && C.datiDaOdoo) C.dati = base + "/beyond/api/data.js";
  }
  C.odooAttivo = base;
  C.odooProva = prova || "";
})(window.BEYOND_CONFIG);
