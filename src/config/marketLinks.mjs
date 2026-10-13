// Pagine ufficiali dove i mercati si consultano in tempo reale.
// Sono semplici collegamenti: il sito NON riproduce i loro dati, quindi non servono licenze.
// Verificati raggiungibili (HTTP 200) il 13 ottobre 2026.

export const marketLinks = [
  {
    id: "gme-pun",
    title: "PUN e prezzi zonali (elettricità)",
    description: "Esiti giornalieri del mercato elettrico del giorno prima (MGP).",
    provider: "Gestore dei Mercati Energetici S.p.A.",
    url: "https://www.mercatoelettrico.org/it-it/Home/Esiti/Elettricita/MGP/Esiti/PUN",
  },
  {
    id: "gme-gas",
    title: "Prezzi del gas (MGP-GAS)",
    description: "Esiti del mercato del gas naturale, da cui deriva il riferimento PSV.",
    provider: "Gestore dei Mercati Energetici S.p.A.",
    url: "https://www.mercatoelettrico.org/it-it/Home/Esiti/Gas/MGP-GAS/Esiti/Asta",
  },
  {
    id: "gme-igi",
    title: "Indice gas IGI",
    description: "Indice giornaliero ufficiale del gas italiano.",
    provider: "Gestore dei Mercati Energetici S.p.A.",
    url: "https://www.mercatoelettrico.org/it-it/Home/Pubblicazioni/Indici-GME/IGIndexGmeEsiti",
  },
  {
    id: "energy-charts",
    title: "Prezzi elettrici in tempo reale",
    description: "Grafico interattivo dei prezzi day-ahead per zona di mercato.",
    provider: "Energy-Charts (Fraunhofer ISE)",
    url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=it&c=IT&bzn=IT-North",
  },
];

/** Pagina da consultare quando il dato non e' disponibile sul sito. */
export const fallbackLinks = {
  electricity: marketLinks[0],
  gas: marketLinks[1],
};
