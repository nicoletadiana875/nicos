// Controlla che le informazioni legali richieste siano state compilate prima della pubblicazione.
//   npm run check:legal
// Esce con codice 1 se mancano dati o se le pagine sono ancora in modalita' bozza.

import { fieldKinds, fieldLabels, getValue, kindTitles, legal, missingFields, requiredFields } from "../src/config/legal.mjs";

const missing = missingFields();
let problems = 0;

if (legal.draft) {
  problems += 1;
  console.log("• Le pagine legali sono ancora in modalità BOZZA (legal.draft = true in src/config/legal.mjs).\n");
}

if (missing.length) {
  problems += missing.length;
  console.log(`• Dati ancora da fornire (${missing.length}), per tipo:\n`);
  for (const kind of Object.keys(kindTitles)) {
    const list = missing.filter((path) => fieldKinds[path] === kind);
    if (!list.length) continue;
    console.log(`  ${kindTitles[kind]}:`);
    for (const path of list) console.log(`    - ${fieldLabels[path]}  [${path}]`);
    console.log("");
  }
}

// Valori gia' compilati ma ricavati dal progetto: vanno confermati
const toConfirm = requiredFields().filter((p) => fieldKinds[p] === "verificato" && !missing.includes(p));
if (toConfirm.length) {
  console.log("• Compilati dal progetto, da confermare:");
  for (const path of toConfirm) console.log(`    - ${fieldLabels[path]}: ${getValue(path)}`);
  console.log("");
}

if (!problems) {
  console.log("OK: dati completi. Ricorda comunque la verifica finale di un professionista.");
  process.exit(0);
}

console.log("Non pubblicare finché l'elenco non è vuoto e i testi non sono stati verificati da un professionista.");
process.exit(1);
