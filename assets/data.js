/* ==========================================================
   Beyond Coesa — contenuti della piattaforma
   Catalogo strumenti, piano di sviluppo, backlog, registro decisioni e indicatori.

   ATTENZIONE: tutto ciò che è marcato "esempio: true" è un DATO DI ESEMPIO
   per mostrare il funzionamento delle pagine. Sostituiscilo con i dati reali
   dopo ogni Comitato AI (o collega una fonte dati esterna).
   ========================================================== */
window.BEYOND_DATA = {
  esempio: true,
  aggiornato: "2026-11-10",

  /* ---------- Catalogo degli strumenti ----------
     stato: "attivo" | "pilota" | "sviluppo" | "arrivo"
     Se in config.js c'è un link per l'id, lo strumento diventa apribile. */
  strumenti: [
    {
      id: "verbali",
      nome: "Verbali di cantiere",
      descrizione: "Detta il sopralluogo, raccogli le firme in cantiere e carica il verbale su Odoo.",
      funzione: "Cantiere",
      progetto: "P5 · Cantiere digitale",
      stato: "pilota",
      icona: "verbale"
    },
    {
      id: "cashflow",
      nome: "Flusso di cassa",
      descrizione: "Entrate, uscite, scadenze e saldo dei conti con i dati aggiornati da Odoo.",
      funzione: "Amministrazione e Finanza",
      progetto: "Richiesta di funzione",
      stato: "attivo",
      icona: "cashflow"
    },
    {
      id: "isabella",
      nome: "Isabella · Fornitori",
      descrizione: "Telefonate ed email dei fornitori sui pagamenti: stato, note e storico per l'amministrazione.",
      funzione: "Amministrazione e Finanza",
      progetto: "Richiesta di funzione",
      stato: "pilota",
      icona: "telefono"
    },
    {
      id: "cme",
      nome: "Aggiornamento CME",
      descrizione: "Confronta il CME in Excel con il prezzario aggiornato in PDF e restituisce l'Excel con le variazioni di prezzo.",
      funzione: "Cantiere",
      progetto: "Richiesta di funzione",
      stato: "attivo",
      icona: "offerta"
    },
    {
      id: "offerta",
      nome: "Fabbrica digitale dell'offerta",
      descrizione: "Dalla richiesta del cliente all'offerta tecnica ed economica, con testi e calcoli pre-compilati.",
      funzione: "Commerciale",
      progetto: "P1 · Portafoglio strategico",
      stato: "sviluppo",
      icona: "offerta"
    }
  ],

  /* ---------- Comitato AI e trimestre ---------- */
  trimestre: {
    nome: "Q4 2026",
    dal: "2026-10-01",
    al: "2026-12-31",
    prossimoComitato: "2026-12-02",
    giornateDisponibili: 120,
    // Quote di capacità (peso iniziale del documento di governance)
    quote: [
      { id: "strategico",   nome: "Portafoglio strategico",     peso: 50, usate: 58 },
      { id: "funzioni",     nome: "Richieste delle funzioni",   peso: 30, usate: 31 },
      { id: "manutenzione", nome: "Manutenzione e miglioramento", peso: 10, usate: 9 },
      { id: "sperimentazione", nome: "Sperimentazione e imprevisti", peso: 10, usate: 5 }
    ]
  },

  /* ---------- Backlog unico ----------
     fase: 0 Segnalazione · 1 MVP e istruzioni · 2 Triage · 3 Valutazione
           4 Priorità · 5 Piano · 6 Delivery · 7 Misura e chiusura
     esito (triage): "accettata" | "integrare" | "senza-ai" | "coperta" | "non-ora" | null
     colonna (piano): "now" | "next" | "later" | "nonora" | null
     stadio (delivery): "build" | "pilota" | "rollout" | null
     voti: valore, fattibilita, impegno, riuso, strategia, rischio (1-5) */
  backlog: [
    { id: "P1", titolo: "Fabbrica digitale dell'offerta", funzione: "Commerciale", origine: "portafoglio",
      quota: "strategico", ricevuta: "2026-10-06", fase: 6, esito: "accettata", colonna: "now", stadio: "build",
      referente: "Ufficio Innovazione", target: "2026-12-18", giornate: 34, semaforo: "giallo",
      voti: { valore: 5, fattibilita: 4, impegno: 2, riuso: 5, strategia: 5, rischio: 3 } },
    { id: "P5", titolo: "Cantiere digitale: verbali e sopralluoghi", funzione: "Cantiere", origine: "portafoglio",
      quota: "strategico", ricevuta: "2026-10-06", fase: 6, esito: "accettata", colonna: "now", stadio: "pilota",
      referente: "Ufficio Innovazione", target: "2026-11-28", giornate: 18, semaforo: "giallo",
      voti: { valore: 4, fattibilita: 4, impegno: 3, riuso: 4, strategia: 5, rischio: 3 } },
    { id: "R-014", titolo: "Flusso di cassa da Odoo", funzione: "Amministrazione e Finanza", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-09-22", fase: 7, esito: "accettata", colonna: "now", stadio: "rollout",
      referente: "Ufficio Innovazione", target: "2026-11-14", giornate: 12, semaforo: "giallo",
      voti: { valore: 4, fattibilita: 5, impegno: 4, riuso: 3, strategia: 4, rischio: 3 } },
    { id: "R-021", titolo: "Assistente per le schede tecniche dei moduli FV", funzione: "Ingegneria", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-10-20", fase: 4, esito: "accettata", colonna: "next", stadio: null,
      referente: "Ufficio Innovazione", target: "2027-01-30", giornate: 9, semaforo: "verde",
      voti: { valore: 3, fattibilita: 4, impegno: 4, riuso: 3, strategia: 3, rischio: 5 } },
    { id: "P3", titolo: "Monitoraggio incentivi e scadenze GSE", funzione: "Incentivi", origine: "portafoglio",
      quota: "strategico", ricevuta: "2026-10-06", fase: 4, esito: "accettata", colonna: "next", stadio: null,
      referente: "Ufficio Innovazione", target: "2027-02-27", giornate: 22, semaforo: "rosso",
      voti: { valore: 4, fattibilita: 3, impegno: 2, riuso: 3, strategia: 5, rischio: 2 } },
    { id: "R-024", titolo: "Riepilogo automatico delle email fornitori", funzione: "Acquisti", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-10-27", fase: 3, esito: "accettata", colonna: "later", stadio: null,
      referente: "Ufficio Innovazione", target: null, giornate: 6, semaforo: "giallo",
      voti: { valore: 3, fattibilita: 3, impegno: 4, riuso: 2, strategia: 2, rischio: 3 } },
    { id: "P7", titolo: "Base di conoscenza tecnica interna", funzione: "Trasversale", origine: "portafoglio",
      quota: "strategico", ricevuta: "2026-10-06", fase: 3, esito: "accettata", colonna: "later", stadio: null,
      referente: "Ufficio Innovazione", target: null, giornate: 25, semaforo: "giallo",
      voti: { valore: 3, fattibilita: 3, impegno: 2, riuso: 5, strategia: 4, rischio: 3 } },
    { id: "R-019", titolo: "Chatbot per il sito pubblico", funzione: "Marketing", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-10-13", fase: 4, esito: "non-ora", colonna: "nonora", stadio: null,
      referente: "Ufficio Innovazione", target: null, giornate: 15, semaforo: "verde",
      motivo: "Valore non ancora misurato: servono i dati sulle richieste in arrivo dal sito.",
      riesame: "2027-03-03",
      voti: { valore: 2, fattibilita: 4, impegno: 3, riuso: 2, strategia: 2, rischio: 4 } },
    { id: "R-026", titolo: "Promemoria scadenze manutenzione impianti", funzione: "O&M", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-11-03", fase: 2, esito: "senza-ai", colonna: null, stadio: null,
      motivo: "Risolvibile con le attività pianificate di Odoo: l'Ufficio Innovazione affianca la funzione nella configurazione.",
      semaforo: "verde", voti: null },
    { id: "R-027", titolo: "Compilazione automatica del DURC", funzione: "Amministrazione e Finanza", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-11-05", fase: 1, esito: "integrare", colonna: null, stadio: null,
      motivo: "Mancano le istruzioni d'uso e i tre casi di prova con il risultato atteso.",
      semaforo: "rosso", voti: null },
    { id: "R-028", titolo: "Stima rapida della producibilità da foto satellitare", funzione: "Commerciale", origine: "funzione",
      quota: "funzioni", ricevuta: "2026-11-07", fase: 2, esito: null, colonna: null, stadio: null,
      semaforo: "verde", voti: null }
  ],

  /* ---------- Registro decisioni ---------- */
  decisioni: [
    { data: "2026-11-04", voce: "R-019", decisione: "Non ora", motivo: "Valore non ancora misurato. Riesame a marzo 2027.", chi: "Comitato AI" },
    { data: "2026-11-04", voce: "P3", decisione: "Next", motivo: "Dati GSE da consolidare prima dell'avvio: ingresso nel prossimo trimestre.", chi: "Comitato AI" },
    { data: "2026-11-04", voce: "R-021", decisione: "Next", motivo: "Corsia rapida: semaforo verde, 9 giornate.", chi: "Ufficio Innovazione" },
    { data: "2026-11-06", voce: "R-026", decisione: "Risolvibile senza AI", motivo: "Coperta dalle attività pianificate di Odoo.", chi: "Ufficio Innovazione" },
    { data: "2026-11-07", voce: "R-027", decisione: "Da integrare", motivo: "Pacchetto incompleto: istruzioni e casi di prova.", chi: "Ufficio Innovazione" },
    { data: "2026-10-14", voce: "P1", decisione: "Now", motivo: "Priorità fissata dalla Direzione per il 2026.", chi: "Comitato AI" },
    { data: "2026-10-14", voce: "P5", decisione: "Now", motivo: "Priorità fissata dalla Direzione per il 2026.", chi: "Comitato AI" }
  ],

  /* ---------- Indicatori di processo ----------
     verso: "max" (più è alto meglio è) | "min" | "range" | "osserva" */
  indicatori: [
    { nome: "Tempo dalla segnalazione all'esito", misura: "Giorni lavorativi medi", valore: 11, unita: "gg", target: "Entro 15", verso: "min", soglia: 15 },
    { nome: "Pacchetti completi al primo invio", misura: "Percentuale sulle richieste", valore: 67, unita: "%", target: "Almeno 70%", verso: "max", soglia: 70 },
    { nome: "Consegne nel trimestre pianificato", misura: "Voci chiuse sul piano", valore: 83, unita: "%", target: "Almeno 80%", verso: "max", soglia: 80 },
    { nome: "Saturazione della capacità", misura: "Giornate assegnate sulle disponibili", valore: 86, unita: "%", target: "Tra 80% e 90%", verso: "range", min: 80, max: 90 },
    { nome: "Benefici verificati", misura: "Consegne con scheda benefici a 60 giorni", valore: 100, unita: "%", target: "100%", verso: "max", soglia: 100 },
    { nome: "Adozione", misura: "Utenti attivi sul totale previsto a 60 giorni", valore: 74, unita: "%", target: "Almeno 70%", verso: "max", soglia: 70 },
    { nome: "Richieste risolte senza AI", misura: "Percentuale sugli esiti di triage", valore: 14, unita: "%", target: "Da osservare", verso: "osserva" }
  ]
};

/* Dati da Odoo: se config.js indica "dati", lo script di Odoo sostituisce
   window.BEYOND_DATA prima che le pagine lo leggano. Se non risponde, restano i dati qui sopra. */
(function () {
  var u = (window.BEYOND_CONFIG || {}).dati;
  if (u && /^https:\/\//.test(u)) document.write('<script src="' + u.replace(/"/g, "") + '"><\/script>');
})();
