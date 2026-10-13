// Salva la password per le app SOLO in .env.local, senza mostrarla e senza registrarla.
//
//   npm run setup:email
//
// - la password viene chiesta nel terminale con i caratteri nascosti (non finisce nella
//   cronologia dei comandi);
// - viene scritta unicamente nella riga SMTP_PASS di .env.local;
// - prima di scrivere si controlla che .env.local sia ignorato da git: se non lo fosse,
//   lo script si ferma e non salva nulla.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import readline from "node:readline";

const fileArg = process.argv.find((a) => a.startsWith("--file="));
const target = resolve(fileArg ? fileArg.slice(7) : ".env.local");
const projectDir = process.cwd();
const insideProject = !relative(projectDir, target).startsWith("..") && !isAbsolute(relative(projectDir, target));

// 1. il file deve essere ignorato da git (solo se e' dentro il progetto)
if (insideProject) {
  try {
    execFileSync("git", ["check-ignore", "-q", target], { cwd: projectDir, stdio: "ignore" });
  } catch {
    console.error("STOP: .env.local NON risulta ignorato da git. Non salvo la password.");
    console.error("Controlla il file .gitignore (deve contenere .env.* oppure .env.local).");
    process.exit(1);
  }
}

if (!existsSync(target)) {
  console.error(`STOP: file non trovato: ${target}`);
  console.error("Copia .env.example in .env.local e riprova.");
  process.exit(1);
}

const rawText = readFileSync(target, "utf8");
const host = (/^SMTP_HOST=(.*)$/m.exec(rawText)?.[1] ?? "").trim();

// 2. lettura della password, nascosta
function ask() {
  return new Promise((resolveAnswer) => {
    const interactive = Boolean(process.stdin.isTTY);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: interactive });
    if (interactive) {
      const out = rl;
      out._writeToOutput = (text) => {
        // mostra il prompt, ma al posto dei caratteri digitati stampa solo asterischi
        if (out._prompted) process.stdout.write(/[\r\n]/.test(text) ? text : "*");
        else process.stdout.write(text);
      };
    }
    rl.question("Incolla la password per le app e premi Invio (non verrà mostrata): ", (answer) => {
      rl.close();
      if (interactive) process.stdout.write("\n");
      resolveAnswer(answer);
    });
    if (interactive) rl._prompted = true;
  });
}

const typed = await ask();
const password = typed.replace(/\s+/g, "");

if (!password) {
  console.error("Nessuna password inserita: nulla salvato.");
  process.exit(1);
}

// 3. controllo di formato per Gmail: le password per le app sono 16 lettere
if (/gmail|googlemail/i.test(host) && !/^[a-z]{16}$/i.test(password)) {
  console.error("\nQuesta non sembra una 'password per le app' di Google (sono 16 lettere, senza numeri).");
  console.error("Non usare la password normale del tuo account: non funzionerebbe e non e' sicuro.");
  console.error("Creane una su https://myaccount.google.com/apppasswords (serve la verifica in due passaggi).");
  console.error("Nulla e' stato salvato.");
  process.exit(1);
}

// 4. scrittura: sostituisce solo la riga SMTP_PASS, il resto del file resta intatto
const eol = rawText.includes("\r\n") ? "\r\n" : "\n";
const line = `SMTP_PASS=${password}`;
let next;
if (/^SMTP_PASS=.*$/m.test(rawText)) {
  next = rawText.replace(/^SMTP_PASS=.*$/m, () => line);
} else {
  next = rawText.replace(/\s*$/, "") + eol + line + eol;
}
writeFileSync(target, next);

console.log("\nOK: password salvata in .env.local (file ignorato da git). Non e' stata mostrata ne' registrata.");
console.log("Ora esegui:  npm run test:email");
