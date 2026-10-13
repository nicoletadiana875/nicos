# Sito Next.js - Consulente Luce e Gas

## Avvio locale

```bash
npm install
npm run dev
```

Sito disponibile su `http://localhost:3000`.

## Struttura

- `app/`: routing Next.js, layout, pagina principale, API route markets
- `src/components/layout`: Header e Footer
- `src/components/sections`: sezioni modulari della home
- `src/components/ui`: componenti riusabili UI
- `src/data/site.js`: dati centralizzati del sito
- `src/styles/home.module.css`: stile modulare della pagina

## Crediti fotografici

Fotografie da [Unsplash](https://unsplash.com) (Unsplash License, uso commerciale consentito, attribuzione non obbligatoria ma indicata per correttezza):

- `public/images/consulenti-bolletta.jpg` — Vitaly Gariev, "Two colleagues collaborating on a laptop in office" (ritagliata)
- `public/images/consulenza-documenti.jpg` — Olena Kholina, "Two people reviewing documents at a table"
- `public/images/mercati-grafico.jpg` — Markus Winkler, "Stock market chart displayed on laptop screen" (ritagliata)
- `public/images/uffici-laptop.jpg` — Tyler Franta, "Person using laptop on white wooden table"
- `public/images/bolletta-cucina.jpg` — Vitaly Gariev, "Couple looking stressed over bills at kitchen table"
- `public/images/analisi-grafico.jpg` — Giorgio Tomassetti, "Two women analyze a line graph on a screen" (ritagliata)
- `public/images/affiancamento-tablet.jpg` — Medienstürmer, "Two people sitting during day"
- `public/images/contatori-parete.jpg` — Jon Moore, "Black and white electric meter"
- `public/images/confronto-laptop.jpg` — Headway, "Person gesturing during meeting with laptop"
- `public/images/lampadina-erba.jpg` — Ashes Sitoula, "Bulb photography"
- `public/images/contatori-scuri.jpg` — Han-Hsing Tu, "A bunch of electrical meters are stacked on top of each other"

## Contatti, email e telefono

Tutti i recapiti si cambiano **senza toccare il codice**, con variabili d'ambiente
(vedi `.env.example`; in locale `.env.local`, online il pannello dell'hosting):

| Cosa | Variabile |
|---|---|
| Email mostrata sul sito e destinataria delle richieste | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Telefono (pulsanti "Chiama") | `NEXT_PUBLIC_CONTACT_PHONE` |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Destinatario diverso dall'email pubblica (opzionale) | `CONTACT_TO` |
| Mittente delle email (opzionale, predefinito `SMTP_USER`) | `CONTACT_FROM` |
| Account e server di posta (segreti) | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` |

I valori predefiniti sono in `src/config/settings.mjs`.

### Quando passi a un indirizzo professionale

1. Crea la casella e, se serve, la "password per le app" del provider.
2. Aggiorna le variabili: `NEXT_PUBLIC_CONTACT_EMAIL`, `SMTP_USER`, `SMTP_PASS` (e `SMTP_HOST`/`SMTP_PORT` se cambia provider), `CONTACT_FROM` se vuoi un mittente diverso.
3. Ripubblica il sito.
4. Esegui `npm run test:email`: controlla configurazione e login, e invia una email di prova **con un PDF allegato** al nuovo destinatario. Con `-- --confirm` prova anche la conferma al cliente; con `-- --check` verifica solo la connessione.
5. Fai una prova dal modulo del sito (con un allegato) e controlla che arrivi.
6. Aggiorna indirizzo e dati del titolare in `src/config/legal.mjs` e rivedi le informative.

Finche' le variabili SMTP non sono impostate il modulo non finge di inviare: avvisa il cliente e lo
indirizza a email e WhatsApp.

### Come funziona l'invio

Il modulo invia i dati a `/api/contact`. Il server controlla tipo e firma del file (PDF/JPG/PNG,
max 4 MB), applica un limite di richieste e un campo anti-spam, e spedisce un'email al destinatario
con l'allegato. **I file non vengono salvati sul server e non esistono link pubblici**: restano solo
nella casella di posta. Al cliente arriva una conferma che non riporta il testo del messaggio.

## Privacy e cookie

- Pagine: `/privacy`, `/cookie`, `/termini` (testi in `src/content/legal.js`, dati in `src/config/legal.mjs`).
- **Sono una prima bozza**: i dati mancanti compaiono come segnaposto "DA COMPLETARE" e le pagine
  sono marcate come bozza e non indicizzabili finche' `legal.draft` e' `true`.
- `npm run check:legal` elenca cio' che manca prima della pubblicazione.
- Stato tecnico verificato: il sito non imposta cookie, non usa localStorage/sessionStorage, non carica
  script o font esterni e non usa strumenti di analisi. Per questo il banner cookie non compare.
  Se aggiungi uno strumento non essenziale, registralo in `src/config/consent.mjs`: il banner
  (Accetta / Rifiuta / Personalizza) compare da solo e lo strumento va caricato con `<ConsentGate>`.
- Il modulo richiede la presa visione dell'informativa e registra nell'email la versione letta
  (`legal.version`). Il consenso promozionale, separato e facoltativo, si attiva con
  `collectPromoConsent: true` in `src/config/legal.mjs`.

## Dati di mercato luce e gas

- **PUN e gas (ufficiali)**: API del GME (`GME_API_USER`, `GME_API_PASSWORD`). Dataset usati:
  `ME_ZonalPrices` (zona `PUN`, MGP) e `GAS_IGIndex` (indice IGI).
  **Licenza**: le condizioni generali dell'API (artt. 5 e 6) consentono solo un uso informativo e
  privato e vietano usi economici/commerciali senza consenso scritto di GME. Per questo
  l'integrazione e' spenta finche' non e' impostata anche `GME_COMMERCIAL_LICENSE=confirmed`, da
  fare solo dopo aver ottenuto la licenza (contatto: info@mercatoelettrico.org).
  Quando e' attiva il sito riporta "Fonte: Gestore dei Mercati Energetici S.p.A.".
- **Collegamenti in tempo reale**: la sezione Mercati rimanda alle pagine ufficiali (GME, Energy-Charts)
  elencate in `src/config/marketLinks.mjs`. Sono semplici link, non riproducono dati.
- **Elettricita' senza credenziali GME**: prezzo day-ahead zona Nord da Energy-Charts
  (dati Bundesnetzagentur | SMARD.de, licenza CC BY 4.0), indicato come tale.
- Nessun valore e' scritto a mano o stimato. Se la fonte non risponde viene mostrato l'ultimo dato
  reale ricevuto (entro 36 ore) marcato "non aggiornato", altrimenti "non disponibile".

## Pubblicazione e anteprima

**Hosting rilevato: Vercel** (repository collegato, indirizzo `nicos-zeta.vercel.app`, deploy
automatici da GitHub). Ne derivano alcune regole:

- Un `push` sul ramo **master** pubblica subito il sito online. Un push su un altro ramo crea solo
  un'anteprima (Preview) di Vercel.
- Le variabili d'ambiente dell'elenco in `.env.example` vanno inserite in **Vercel > Settings >
  Environment Variables** (per Production e, se vuoi provare, Preview): senza `SMTP_*` il modulo
  non invia. Dopo averle cambiate serve un nuovo deploy.
- **Limite allegati**: Vercel accetta corpi di richiesta fino a ~4,5 MB, per questo l'allegato e'
  limitato a **4 MB** (`MAX_FILE_MB` in `src/lib/contactRules.js`). Non alzarlo senza cambiare
  sistema di raccolta file.
- `vercel.json` fissa le funzioni del sito (modulo contatti) nella regione di Francoforte (`fra1`).
- Il sito dichiara `noindex` finche' `legal.draft` e' `true`: un'anteprima non viene indicizzata.

### Anteprima locale (prima di pubblicare)

```bash
npm run build      # build di produzione
npm start          # http://localhost:3000, come sara' online
```

Per provare l'invio reale con la tua casella: compila `SMTP_PASS` in `.env.local` ed esegui
`npm run test:email`.

### Prima della pubblicazione definitiva

1. `npm run check:legal` senza voci mancanti e testi verificati da un professionista;
2. `legal.draft = false` in `src/config/legal.mjs`;
3. variabili d'ambiente impostate su Vercel e `npm run test:email` riuscito;
4. prova reale del modulo (con allegato) e dei pulsanti WhatsApp/Chiama dal telefono.

## Attivare l'invio email con Gmail (password per le app)

Il sito non usa la password normale del tuo account Google: usa una **password per le app**, valida
solo per questo sito e revocabile in qualsiasi momento.

1. **Verifica in due passaggi**: Account Google > *Sicurezza* > *Verifica in due passaggi* > attivala.
2. **Crea la password per le app**: apri <https://myaccount.google.com/apppasswords>, dai un nome
   (es. "Sito consulenza") e premi *Crea*. Google mostra **una sola volta** 16 lettere.
   - Se la pagina non è disponibile: la verifica in due passaggi non è attiva, oppure è impostata
     solo con chiavi di sicurezza/passkey, oppure l'account è di lavoro/scuola o ha la Protezione
     avanzata attiva.
3. **Salvala nel sito**: nel terminale del progetto esegui `npm run setup:email` e incolla le
   16 lettere (non vengono mostrate né registrate; vengono scritte solo in `.env.local`).
4. **Prova**: `npm run test:email`. Se tutto funziona ricevi una email con un PDF allegato.
5. **Online (Vercel)**: aggiungi le stesse variabili in *Settings > Environment Variables*
   (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, spuntando "Sensitive" per la password),
   poi ripubblica. In Vercel non esiste `.env.local`.

Revoca: nella stessa pagina elimina la password per le app. Cambiando la password dell'account
Google, tutte le password per le app vengono revocate automaticamente.

Sicurezza: `.env.local` è ignorato da git, la password non è mai nel codice, non viene stampata
nei log e non arriva mai al browser (non inizia con `NEXT_PUBLIC_`).
