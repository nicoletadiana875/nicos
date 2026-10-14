// Attivazione guidata, in un solo comando.
//
//   npm run attiva:email        invio email del modulo contatti (password per le app Gmail)
//
// Cosa fa, in ordine:
//   1. apre nel browser la pagina dove si ottiene il segreto;
//   2. ti chiede di incollarlo (caratteri nascosti, mai stampato né registrato);
//   3. lo salva SOLO in .env.local (file ignorato da git);
//   4. lo prova subito (login al server di posta / chiamata all'API);
//   5. se vuoi, lo carica su Vercel come variabile riservata e ripubblica il sito;
//   6. fa un test finale dal sito pubblico.
//
// Opzioni di prova: --simulate (non tocca Vercel né il browser), --file=percorso.env

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import readline from "node:readline";
import { readTerminalLine } from "./prompt.mjs";

const mode = process.argv[2];
const flags = process.argv.slice(3);
const SIM = flags.includes("--simulate");
const fileArg = flags.find((a) => a.startsWith("--file="));
const SCOPE = "nicoleta-stinga";
const SITE = (flags.find((a) => a.startsWith("--site="))?.slice(7) ?? "https://nicos-zeta.vercel.app").replace(/\/$/, "");
const projectDir = process.cwd();
const envFile = resolve(fileArg ? fileArg.slice(7) : ".env.local");

const CONFIG = {
  email: {
    envName: "SMTP_PASS",
    url: "https://myaccount.google.com/apppasswords",
    title: "Invio email del modulo contatti",
    steps: [
      "Si aprirà la pagina Google delle password per le app.",
      "Se non è disponibile: attiva prima la 'Verifica in due passaggi' nel tuo account Google.",
      "Dai un nome (es. 'Sito consulenza') e premi Crea: Google mostra 16 lettere UNA SOLA VOLTA.",
      "Copiale e incollale qui sotto.",
    ],
    prompt: "Incolla la password per le app (16 lettere) e premi Invio",
    normalize: (v) => v.replace(/\s+/g, ""),
    valid: (v) => /^[a-z]{16}$/i.test(v),
    invalidMsg:
      "Non sembra una 'password per le app' di Google (sono 16 lettere, senza numeri). Non usare la password normale dell'account.",
  },
};

const cfg = CONFIG[mode];
if (!cfg) {
  console.error("Uso: node scripts/attiva.mjs email");
  process.exit(1);
}

const say = (...a) => console.log(...a);
const redact = (text, secret) => (secret ? String(text ?? "").split(secret).join("***") : String(text ?? ""));

// ---- ingressi
// Terminale vero: lettura carattere per carattere (i segreti compaiono come asterischi).
// Input da pipe (prove automatiche): una riga per domanda.
const interactive = Boolean(process.stdin.isTTY);
const lineQueue = [];
let lineWaiter = null;
let closed = false;
let rl = null;
if (!interactive) {
  rl = readline.createInterface({ input: process.stdin, terminal: false });
  rl.on("line", (l) => {
    if (lineWaiter) {
      const w = lineWaiter;
      lineWaiter = null;
      w(l);
    } else lineQueue.push(l);
  });
  rl.on("close", () => {
    closed = true;
    if (lineWaiter) {
      const w = lineWaiter;
      lineWaiter = null;
      w(null);
    }
  });
}

function ask(question, { hidden = false } = {}) {
  if (interactive) return readTerminalLine(process.stdin, process.stdout, { question, hidden });
  return new Promise((resolveAnswer) => {
    process.stdout.write(question + ": \n");
    if (lineQueue.length) resolveAnswer(lineQueue.shift());
    else if (closed) resolveAnswer(null);
    else lineWaiter = resolveAnswer;
  });
}

async function confirm(question) {
  const a = (await ask(`${question} [S/n]`)) ?? "n";
  return !/^n/i.test(a.trim());
}

// ---- file .env.local
function ensureIgnored() {
  const rel = relative(projectDir, envFile);
  if (rel.startsWith("..") || isAbsolute(rel)) return;
  const r = spawnSync("git", ["check-ignore", "-q", envFile], { cwd: projectDir });
  if (r.status !== 0) {
    console.error("STOP: .env.local NON risulta ignorato da git. Non salvo nulla.");
    process.exit(1);
  }
}

function setEnvVar(name, value) {
  const text = existsSync(envFile) ? readFileSync(envFile, "utf8") : "";
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const re = new RegExp(`^${name}=.*$`, "m");
  const line = `${name}=${value}`;
  const next = re.test(text) ? text.replace(re, () => line) : text.replace(/\s*$/, "") + eol + line + eol;
  writeFileSync(envFile, next);
}

function openBrowser(url) {
  if (SIM) return;
  try {
    const p = process.platform;
    const child =
      p === "win32"
        ? spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" })
        : spawn(p === "darwin" ? "open" : "xdg-open", [url], { detached: true, stdio: "ignore" });
    child.unref();
  } catch {
    /* si stampa comunque il collegamento */
  }
}

// ---- Vercel (usa la sessione gia' presente del CLI)
// Versione bloccata: niente codice "ultima versione" scaricato al momento
const VERCEL_CLI = "vercel@64.0.2";

function vercel(args, input) {
  return spawnSync("npx", ["--yes", VERCEL_CLI, ...args, "--scope", SCOPE], {
    cwd: projectDir,
    input,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

function uploadToVercel(name, value) {
  const results = [];
  for (const target of ["production", "preview"]) {
    if (SIM) {
      results.push(`SIMULAZIONE  vercel env add ${name} ${target} --sensitive`);
      continue;
    }
    const r = vercel(["env", "add", name, target, "--force", "--sensitive"], value);
    results.push(`${r.status === 0 ? "OK  " : "ERRORE"}  ${name} -> ${target}${r.status === 0 ? "" : "  " + redact((r.stderr || r.stdout || "").trim().split("\n").slice(-2).join(" "), value)}`);
    if (r.status !== 0) return { ok: false, results };
  }
  return { ok: true, results };
}

function redeploy() {
  if (SIM) return { ok: true, info: "SIMULAZIONE  vercel deploy --prod" };
  const r = vercel(["deploy", "--prod", "--yes"]);
  const out = (r.stdout || "") + (r.stderr || "");
  return { ok: r.status === 0, info: out.split("\n").filter((l) => /Production|Aliased|Error|Ready/i.test(l)).slice(-3).join("\n") };
}

// ======================= flusso =======================
say(`\n=== ${cfg.title} ===`);
cfg.steps.forEach((s, i) => say(`  ${i + 1}. ${s}`));
say(`\n  Pagina: ${cfg.url}\n`);
ensureIgnored();
openBrowser(cfg.url);

const raw = await ask(`  ${cfg.prompt} (non verrà mostrata)`, { hidden: true });
const secret = cfg.normalize(raw ?? "");
if (!secret) {
  console.error("Nessun valore inserito: nulla salvato.");
  process.exit(1);
}
if (!cfg.valid(secret)) {
  console.error(`\n${cfg.invalidMsg}\nNulla è stato salvato.`);
  process.exit(1);
}

if (existsSync(envFile)) {
  try {
    process.loadEnvFile(envFile);
  } catch {
    /* se il file ha una riga non valida si procede con l'ambiente corrente */
  }
}
process.env[cfg.envName] = secret;

// ---- 4. prova locale (prima di salvare in modo definitivo)
let previous = null;
if (existsSync(envFile)) previous = new RegExp(`^${cfg.envName}=(.*)$`, "m").exec(readFileSync(envFile, "utf8"))?.[1] ?? null;

async function localTest() {
  if (mode === "email") {
    const { createTransport, missingMailSettings, readMailSettings, sendOwnerEmail } = await import("../src/lib/mailer.mjs");
    const s = readMailSettings();
    const missing = missingMailSettings(s);
    if (missing.length) return { ok: false, msg: `Mancano impostazioni: ${missing.join(", ")}` };
    const transport = createTransport(s);
    try {
      await transport.verify();
    } catch (e) {
      return { ok: false, msg: `Login al server di posta non riuscito: ${e.code ?? ""} ${redact(e.message, secret)}` };
    }
    const pdf = Buffer.from("%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n");
    try {
      await sendOwnerEmail(s, transport, {
        nome: "Prova di attivazione",
        email: s.to,
        messaggio: "Email di prova inviata dallo script di attivazione: se la leggi, l'invio funziona.",
        attachment: { filename: "allegato-di-prova.pdf", content: pdf, contentType: "application/pdf" },
        policyVersion: "prova",
        promoConsent: null,
      });
    } catch (e) {
      return { ok: false, msg: `Invio non riuscito: ${e.code ?? ""} ${redact(e.message, secret)}` };
    }
    return { ok: true, msg: `Login riuscito ed email di prova (con PDF) inviata a ${s.to}. Controlla la casella, anche lo spam.` };
  }

  return { ok: false, msg: "Modalità non supportata." };
}

say("\n  Provo il segreto...");
const test = await localTest();
if (!test.ok) {
  console.error(`\n  ✗ ${test.msg}\n  Il segreto NON è stato salvato.`);
  process.exit(1);
}
say(`  ✓ ${test.msg}`);

// ---- 3. salvataggio locale
setEnvVar(cfg.envName, secret);
say(`  ✓ Salvato in ${SIM || fileArg ? envFile : ".env.local"} (ignorato da git; non è stato mostrato né registrato).`);

// ---- 5. Vercel
say("");
const go = await confirm("  Carico il segreto su Vercel (variabile riservata) e ripubblico il sito ora?");
if (!go) {
  say(`\n  Va bene. Quando vuoi, rilancia: npm run attiva:${mode}`);
  rl?.close();
  process.exit(0);
}

const up = uploadToVercel(cfg.envName, secret);
up.results.forEach((l) => say("   ", l));
if (!up.ok) {
  console.error("\n  ✗ Caricamento su Vercel non riuscito: il sito pubblico non è stato modificato.");
  rl?.close();
  process.exit(1);
}

say("\n  Ripubblico il sito (circa 2 minuti)...");
const dep = redeploy();
if (dep.info) say(dep.info.split("\n").map((l) => "    " + l).join("\n"));
if (!dep.ok) {
  console.error("\n  ✗ La ripubblicazione non è riuscita. La variabile è su Vercel: ripubblica con un push o dal pannello.");
  rl?.close();
  process.exit(1);
}

// ---- 6. test finale dal sito pubblico
if (SIM) {
  say("\n  SIMULAZIONE: test finale dal sito pubblico saltato.");
} else {
  say("\n  Test finale dal sito pubblico...");
  try {
    if (mode === "email") {
      const to = process.env.CONTACT_TO || process.env.NEXT_PUBLIC_CONTACT_EMAIL || process.env.SMTP_USER;
      const fd = new FormData();
      fd.set("nome", "Prova automatica");
      fd.set("email", to);
      fd.set("messaggio", "Prova automatica dal sito pubblico dopo l'attivazione dell'email. Puoi ignorare questo messaggio.");
      fd.set("privacy", "on");
      const r = await fetch(`${SITE}/api/contact`, { method: "POST", body: fd });
      const j = await r.json().catch(() => ({}));
      say(r.ok && j.ok ? `  ✓ Modulo del sito pubblico: INVIATO. La richiesta è arrivata a ${to}.` : `  ✗ Modulo del sito pubblico: HTTP ${r.status} ${j.error ?? ""} ${j.code ?? ""}`);
    }
  } catch (e) {
    say(`  ✗ Test finale non riuscito: ${redact(e.message, secret)}`);
  }
}

say("\n  Fatto.\n");
rl?.close();
