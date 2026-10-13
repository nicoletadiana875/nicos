// Testi delle pagine legali (PRIMA BOZZA da far verificare a un professionista).
//
// Convenzioni:
//   {{percorso.del.dato}}  -> valore preso da src/config/legal.mjs; se vuoto compare
//                             un segnaposto evidenziato "DA COMPLETARE".
//   [testo](/percorso)     -> collegamento.
//   { type: "verify" }     -> nota per la revisione: visibile solo finche' legal.draft = true.
//   { when: "promo" }      -> blocco mostrato solo se legal.collectPromoConsent = true.
//
// Cio' che qui e' dichiarato descrive il funzionamento REALE del sito, verificato sul codice
// (nessun cookie/storage, nessun analytics, file non salvati sul server, ecc.).

export const privacyDoc = {
  slug: "privacy",
  title: "Informativa sulla privacy",
  intro:
    "Questa informativa spiega come vengono trattati i dati personali di chi visita questo sito, usa il modulo di contatto o ci scrive per email, telefono o WhatsApp, ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e del D.Lgs. 196/2003.",
  sections: [
    {
      id: "titolare",
      title: "1. Titolare del trattamento",
      blocks: [
        {
          p: "Il titolare del trattamento è {{controller.name}}, che opera con il nome «{{controller.activity}}».",
        },
        {
          ul: [
            "Qualifica: {{controller.role}}",
            "Sede: {{controller.address}}",
            "Partita IVA: {{controller.vatNumber}} · Codice fiscale: {{controller.taxCode}}",
            "Email: {{controller.email}} · PEC: {{controller.pec}}",
            "Telefono: {{controller.phone}}",
            "Responsabile della protezione dei dati (RPD/DPO): {{dpo}}",
          ],
        },
      ],
    },
    {
      id: "dati",
      title: "2. Quali dati raccogliamo",
      blocks: [
        { p: "A seconda di come si usa il sito possiamo trattare:" },
        {
          ul: [
            "**Dati forniti con il modulo di contatto**: nome e cognome, indirizzo email, testo del messaggio e, se l'utente sceglie di allegarlo, un file (bolletta, documento o fotografia in formato PDF, JPG o PNG, fino a 4 MB).",
            "**Dati contenuti nei documenti inviati**: una bolletta può contenere, oltre all'intestatario, l'indirizzo di fornitura, i codici POD/PDR, i dati di consumo, il fornitore e talvolta le coordinate bancarie. Si invita a inviare solo i documenti necessari e a oscurare le informazioni non pertinenti.",
            "**Dati forniti contattandoci per email, telefono o WhatsApp**: indirizzo email o numero di telefono, nome visualizzato, contenuto dei messaggi ed eventuali allegati.",
            "**Dati tecnici**: indirizzo IP e informazioni tecniche della richiesta, elaborati dal server per far funzionare il sito e per limitare l'uso abusivo del modulo (limite di richieste e campo anti-spam). Non viene creato alcun profilo dell'utente.",
          ],
        },
        {
          p: "**Cosa non facciamo.** Il sito non usa cookie di profilazione, strumenti di analisi statistica, pixel pubblicitari né script di terze parti, e non memorizza informazioni nel dispositivo dell'utente (vedi [Cookie Policy](/cookie)). Non vengono richiesti dati appartenenti a categorie particolari (art. 9 GDPR, ad esempio dati sulla salute): si invita a non inserirli nei messaggi o nei documenti.",
        },
      ],
    },
    {
      id: "finalita",
      title: "3. Finalità e basi giuridiche",
      blocks: [
        {
          ul: [
            "**Rispondere alle richieste e fornire la consulenza preliminare richiesta** (analisi di bollette, contratti e offerte). Base giuridica: misure precontrattuali adottate su richiesta dell'interessato (art. 6, par. 1, lett. b GDPR).",
            "**Eseguire l'eventuale incarico di consulenza e gestire il rapporto**. Base giuridica: esecuzione del contratto (art. 6, par. 1, lett. b).",
            "**Adempiere obblighi di legge**, ad esempio fiscali e contabili, se si instaura un rapporto. Base giuridica: obbligo legale (art. 6, par. 1, lett. c).",
            "**Garantire la sicurezza del sito e prevenire usi abusivi** (limiti di richieste, filtri anti-spam). Base giuridica: legittimo interesse del titolare (art. 6, par. 1, lett. f).",
            "**Accertare, esercitare o difendere un diritto** anche in sede giudiziaria. Base giuridica: legittimo interesse (art. 6, par. 1, lett. f).",
          ],
        },
        {
          when: "promo",
          blocks: [
            {
              ul: [
                "**Invio di comunicazioni informative o promozionali**, solo se l'utente seleziona l'apposita casella, separata e facoltativa. Base giuridica: consenso (art. 6, par. 1, lett. a), revocabile in qualsiasi momento senza conseguenze sulla consulenza.",
              ],
            },
          ],
        },
        {
          p: "Il conferimento dei dati contrassegnati come obbligatori nel modulo è necessario per poter rispondere: senza di essi non è possibile dare seguito alla richiesta. L'invio di allegati è facoltativo.",
        },
      ],
    },
    {
      id: "sicurezza",
      title: "4. Come proteggiamo i dati e i documenti",
      blocks: [
        {
          ul: [
            "Il modulo invia i dati al sito su connessione cifrata (HTTPS).",
            "I file allegati **non vengono salvati sul server del sito né pubblicati**: sono controllati (tipo e dimensione) e inoltrati per email al titolare. **Non vengono creati link pubblici** per scaricarli.",
            "L'invio dal sito al servizio di posta avviene su connessione cifrata (TLS). Le richieste ricevute si trovano nella casella email del titolare, protetta da credenziali di accesso personali.",
            "Il codice del sito non registra su disco gli indirizzi IP; il fornitore di hosting ({{providers.hosting}}) può mantenere registri tecnici per il periodo da lui previsto.",
          ],
        },
        {
          type: "verify",
          text: "Verificare con un professionista: (a) che il sito sia effettivamente pubblicato solo in HTTPS; (b) le misure di sicurezza organizzative da dichiarare (protezione degli accessi alla casella, autenticazione a due fattori, dispositivi, procedure di cancellazione); (c) se sia opportuno un registro dei trattamenti (art. 30 GDPR).",
        },
      ],
    },
    {
      id: "destinatari",
      title: "5. A chi comunichiamo i dati",
      blocks: [
        {
          p: "I dati non vengono diffusi né venduti. Possono essere trattati da:",
        },
        {
          ul: [
            "il titolare e le eventuali persone autorizzate al trattamento;",
            "fornitori di servizi tecnici che agiscono come responsabili del trattamento: il servizio di posta elettronica ({{providers.emailService}}) e il fornitore di hosting del sito ({{providers.hosting}}, server in {{providers.hostingLocation}});",
            "professionisti e consulenti del titolare (ad esempio commercialista o legale), per obblighi di legge o per la tutela di un diritto;",
            "autorità pubbliche, quando richiesto dalla legge.",
          ],
        },
        {
          p: "Se l'utente chiede di valutare o attivare un'offerta di un fornitore di energia, i dati necessari possono essere comunicati a quel fornitore soltanto su richiesta dell'utente stesso.",
        },
        {
          type: "verify",
          text: "Confermare se, come e con quali garanzie i dati vengano effettivamente trasmessi a fornitori di energia, e se esistano mandati o accordi (nomina a responsabile / autonomo titolare).",
        },
      ],
    },
    {
      id: "canali",
      title: "6. WhatsApp, telefono ed email",
      blocks: [
        {
          ul: [
            "**Pulsante WhatsApp**: cliccandolo l'utente viene portato all'app o al sito di WhatsApp (gruppo Meta). Il sito non invia a WhatsApp alcun dato dell'utente né testi precompilati: nel collegamento è incluso soltanto il numero del titolare. Da quel momento il trattamento avviene secondo l'informativa di WhatsApp. Il titolare riceve numero, nome visualizzato e contenuto dei messaggi.",
            "**Telefono**: chiamando, il titolare può venire a conoscenza del numero chiamante.",
            "**Email**: i messaggi inviati all'indirizzo del titolare sono conservati nella casella di posta per il tempo indicato nella sezione «Conservazione».",
          ],
        },
        {
          p: "Per l'invio di documenti si invita a usare il modulo del sito o l'email e a inviare soltanto quanto è necessario.",
        },
      ],
    },
    {
      id: "extra-ue",
      title: "7. Trasferimenti fuori dallo Spazio Economico Europeo",
      blocks: [
        {
          p: "Il sito non trasferisce direttamente dati fuori dallo Spazio Economico Europeo. I servizi di posta elettronica e di messaggistica, forniti da gruppi internazionali, possono comportare trattamenti anche in Paesi extra-UE, con le garanzie previste dal GDPR (ad esempio decisioni di adeguatezza o clausole contrattuali tipo) predisposte dai rispettivi fornitori.",
        },
        {
          type: "verify",
          text: "Verificare le garanzie effettivamente applicabili ai fornitori scelti (posta, hosting, WhatsApp) e la sede dei server dichiarata dall'hosting.",
        },
      ],
    },
    {
      id: "conservazione",
      title: "8. Per quanto tempo conserviamo i dati",
      blocks: [
        {
          ul: [
            "Richieste di contatto che non portano a un incarico: {{retention.requests}}",
            "Bollette, fotografie e documenti ricevuti: {{retention.documents}}",
            "Dati relativi a un incarico di consulenza: {{retention.contractual}}",
            {
              when: "promo",
              text: "Dati per comunicazioni promozionali (fino alla revoca del consenso): {{retention.promotional}}",
            },
          ],
        },
        {
          p: "Trascorso il termine, i dati e i documenti vengono cancellati o resi anonimi. L'utente può chiedere la cancellazione anticipata (vedi «Diritti»), salvo che la conservazione sia necessaria per un obbligo di legge o per tutelare un diritto.",
        },
        {
          type: "verify",
          text: "I tempi di conservazione non sono stati inventati: vanno stabiliti con un professionista in base all'attività svolta e agli obblighi applicabili, e poi riportati in src/config/legal.mjs.",
        },
      ],
    },
    {
      id: "diritti",
      title: "9. Diritti dell'utente",
      blocks: [
        { p: "L'utente può in qualsiasi momento esercitare i diritti previsti dagli artt. 15-22 GDPR:" },
        {
          ul: [
            "accesso ai propri dati e ottenimento di una copia;",
            "rettifica dei dati inesatti o integrazione di quelli incompleti;",
            "cancellazione dei dati («diritto all'oblio»), nei casi previsti;",
            "limitazione del trattamento;",
            "portabilità dei dati forniti;",
            "opposizione al trattamento fondato sul legittimo interesse;",
            "revoca del consenso, quando il trattamento si basa su di esso, senza pregiudicare la liceità del trattamento precedente.",
          ],
        },
        {
          p: "**Come esercitarli.** Scrivendo a {{controller.email}} (o via PEC a {{controller.pec}}) e indicando nome e indirizzo email usati per la richiesta; per la cancellazione di documenti è utile specificare quali sono stati inviati. Il titolare risponde senza ingiustificato ritardo e comunque entro un mese dal ricevimento, prorogabile di due mesi nei casi complessi (art. 12 GDPR). L'esercizio dei diritti è gratuito; il titolare può chiedere di verificare l'identità del richiedente.",
        },
        {
          p: "**Reclamo.** L'utente ha il diritto di proporre reclamo al Garante per la protezione dei dati personali ([www.garanteprivacy.it](https://www.garanteprivacy.it)).",
        },
      ],
    },
    {
      id: "automatizzati",
      title: "10. Decisioni automatizzate e profilazione",
      blocks: [
        {
          p: "Non vengono utilizzati processi decisionali interamente automatizzati né attività di profilazione.",
        },
      ],
    },
    {
      id: "cookie",
      title: "11. Cookie e strumenti di tracciamento",
      blocks: [
        {
          p: "Le informazioni sull'uso di cookie e tecnologie simili sono nella [Cookie Policy](/cookie).",
        },
      ],
    },
    {
      id: "aggiornamenti",
      title: "12. Aggiornamenti dell'informativa",
      blocks: [
        {
          p: "L'informativa può essere aggiornata, ad esempio per modifiche normative o ai servizi del sito. La versione in vigore è sempre pubblicata in questa pagina, con la data di ultimo aggiornamento.",
        },
      ],
    },
  ],
};

export const cookieDoc = {
  slug: "cookie",
  title: "Cookie Policy",
  intro:
    "Questa pagina descrive quali cookie e strumenti simili usa il sito, a quale scopo e come l'utente può gestire le proprie preferenze, ai sensi dell'art. 122 del D.Lgs. 196/2003 e delle Linee guida del Garante del 10 giugno 2021.",
  sections: [
    {
      id: "cosa",
      title: "1. Cosa sono i cookie",
      blocks: [
        {
          p: "I cookie sono piccoli file di testo che un sito può salvare nel dispositivo dell'utente. Possono essere «tecnici» (necessari al funzionamento, non richiedono consenso) oppure servire per statistiche, marketing o profilazione (richiedono il consenso preventivo). Le stesse regole valgono per tecnologie simili, come l'archiviazione locale del browser.",
        },
      ],
    },
    {
      id: "uso",
      title: "2. Cosa usa questo sito",
      blocks: [
        {
          p: "In base alla verifica tecnica del codice del sito alla data di aggiornamento di questa pagina:",
        },
        {
          ul: [
            "**non installa alcun cookie**, né propri né di terze parti;",
            "**non memorizza informazioni nel browser** (nessun localStorage, sessionStorage o IndexedDB);",
            "**non usa strumenti di analisi statistica**, pixel pubblicitari, mappe, video incorporati o plugin dei social network;",
            "serve i caratteri tipografici dal sito stesso, senza richieste a servizi esterni durante la navigazione.",
          ],
        },
        {
          p: "Poiché non sono presenti cookie né strumenti che richiedano il consenso, il sito non mostra un banner dei cookie. Se in futuro verranno introdotti strumenti non strettamente necessari, il banner comparirà automaticamente e nessuno di essi verrà attivato prima del consenso.",
        },
      ],
    },
    {
      id: "elenco",
      title: "3. Elenco degli strumenti soggetti a consenso",
      blocks: [{ type: "services" }],
    },
    {
      id: "terzi",
      title: "4. Collegamenti a siti e servizi di terzi",
      blocks: [
        {
          p: "Il sito contiene collegamenti a servizi esterni che l'utente raggiunge solo se li seleziona, ad esempio **WhatsApp** (pulsante di contatto) e i siti delle fonti dei dati di mercato. Su quei siti si applicano le rispettive informative e cookie policy, sulle quali il titolare non ha controllo.",
        },
      ],
    },
    {
      id: "gestione",
      title: "5. Come gestire le preferenze",
      blocks: [
        {
          ul: [
            "Dal pulsante «Preferenze cookie» presente in fondo a ogni pagina è possibile rivedere in qualsiasi momento lo stato degli strumenti e, quando presenti, modificare le scelte.",
            "Le scelte espresse vengono ricordate per 6 mesi; trascorso questo periodo, o se cambia l'elenco degli strumenti, il consenso viene richiesto di nuovo.",
            "È inoltre possibile bloccare o cancellare i cookie dalle impostazioni del browser.",
          ],
        },
      ],
    },
    {
      id: "titolare",
      title: "6. Titolare e contatti",
      blocks: [
        {
          p: "Titolare del trattamento: {{controller.name}} — {{controller.email}}. Per ogni informazione sul trattamento dei dati si veda l'[Informativa sulla privacy](/privacy).",
        },
      ],
    },
  ],
};

export const termsDoc = {
  slug: "termini",
  title: "Termini e condizioni",
  intro:
    "Questi termini regolano l'uso del sito e le richieste di consulenza inviate attraverso di esso. Non sostituiscono l'eventuale accordo scritto relativo a un incarico specifico.",
  sections: [
    {
      id: "chi",
      title: "1. Chi eroga il servizio",
      blocks: [
        {
          p: "Il servizio è erogato da {{controller.name}} («{{controller.activity}}»), {{controller.role}}, con sede in {{controller.address}} — P. IVA {{controller.vatNumber}} — C.F. {{controller.taxCode}} — email {{controller.email}} — PEC {{controller.pec}}.",
        },
      ],
    },
    {
      id: "oggetto",
      title: "2. Oggetto del servizio",
      blocks: [
        {
          p: "Consulenza commerciale nel settore dell'energia elettrica e del gas per privati, professionisti e imprese, che comprende, come descritto nel sito: analisi di bollette e contratti, valutazione comparata delle offerte e scelta guidata, monitoraggio e supporto nel tempo.",
        },
        {
          p: "La consulenza ha carattere informativo e di supporto alla decisione. La scelta del fornitore e la sottoscrizione dei contratti restano di responsabilità dell'utente.",
        },
        {
          type: "verify",
          text: "Verificare che questa descrizione corrisponda all'attività effettivamente svolta (ad esempio se la sottoscrizione dei contratti avviene tramite il titolare o direttamente con il fornitore) e alla qualifica professionale dichiarata.",
        },
      ],
    },
    {
      id: "gratuita",
      title: "3. Prima analisi e condizioni economiche",
      blocks: [
        {
          p: "Come indicato nel sito, la prima analisi è gratuita e senza impegno. Per le attività ulteriori: {{terms.fees}}.",
        },
      ],
    },
    {
      id: "fornitori",
      title: "4. Rapporti con i fornitori di energia e provvigioni",
      blocks: [
        {
          p: "Di seguito sono indicati i rapporti dell'attività con i fornitori di energia elettrica e gas e le eventuali provvigioni o compensi da essi percepiti.",
        },
        { p: "{{terms.supplierRelationship}}" },
        {
          type: "verify",
          text: "PUNTO CRITICO — da dichiarare con trasparenza prima di pubblicare. Occorre indicare: (1) se esistono mandati, agenzie o convenzioni con fornitori di energia e con quali; (2) se si percepiscono provvigioni o altri compensi dai fornitori e, in tal caso, in quali casi e se il cliente ne è informato prima della scelta; (3) se la consulenza resta indipendente o se vengono proposte solo le offerte dei fornitori convenzionati; (4) eventuali conflitti di interesse e come vengono gestiti; (5) se il cliente paga un compenso diretto oltre alla prima analisi gratuita. La formulazione corretta, anche rispetto alla normativa sulle pratiche commerciali e sui consumatori, va definita con un professionista.",
        },
      ],
    },
    {
      id: "utente",
      title: "5. Impegni dell'utente",
      blocks: [
        {
          ul: [
            "fornire informazioni veritiere e aggiornate;",
            "inviare soltanto documenti propri o per i quali è autorizzato dall'interessato;",
            "non inviare contenuti illeciti, offensivi o contenenti virus e non usare il sito in modo abusivo o per interferire con il suo funzionamento.",
          ],
        },
      ],
    },
    {
      id: "mercati",
      title: "6. Dati di mercato",
      blocks: [
        {
          p: "I prezzi dell'energia riportati nel sito (elettricità e gas) hanno finalità informativa. Provengono dalle fonti indicate accanto a ciascun valore e possono subire ritardi, interruzioni o revisioni. Non costituiscono offerta, garanzia di prezzo né consulenza finanziaria. Quando una fonte non è disponibile il sito lo indica e non mostra valori stimati.",
        },
      ],
    },
    {
      id: "responsabilita",
      title: "7. Responsabilità",
      blocks: [
        {
          p: "Il titolare opera con la diligenza professionale richiesta. Nei limiti consentiti dalla legge, non risponde di interruzioni o malfunzionamenti del sito, dell'indisponibilità o inesattezza di dati forniti da terzi, né di decisioni prese dall'utente sulla base di informazioni incomplete o non veritiere. Restano ferme le responsabilità che la legge non consente di escludere e i diritti inderogabili dei consumatori.",
        },
        {
          type: "verify",
          text: "Le clausole di limitazione di responsabilità vanno valutate da un legale in relazione alla natura del servizio e ai destinatari (consumatori e/o imprese).",
        },
      ],
    },
    {
      id: "pi",
      title: "8. Proprietà intellettuale e crediti",
      blocks: [
        {
          p: "I testi, la grafica e l'organizzazione del sito sono del titolare. Le fotografie provengono da [Unsplash](https://unsplash.com) e sono utilizzate secondo la Unsplash License; i crediti sono elencati di seguito.",
        },
        { type: "credits" },
      ],
    },
    {
      id: "privacy",
      title: "9. Privacy",
      blocks: [
        {
          p: "Il trattamento dei dati personali è descritto nell'[Informativa sulla privacy](/privacy) e nella [Cookie Policy](/cookie).",
        },
      ],
    },
    {
      id: "legge",
      title: "10. Legge applicabile e foro competente",
      blocks: [
        {
          p: "Salvo diversa previsione inderogabile, si applica la legge italiana. {{terms.jurisdiction}} Per i consumatori restano ferme le norme di legge sul foro del luogo di residenza o di domicilio.",
        },
      ],
    },
    {
      id: "modifiche",
      title: "11. Modifiche",
      blocks: [
        {
          p: "Questi termini possono essere aggiornati; la versione in vigore è quella pubblicata in questa pagina, con la data di ultimo aggiornamento.",
        },
      ],
    },
  ],
};

export const photoCredits = [
  { name: "Vitaly Gariev", work: "Two colleagues collaborating on a laptop in office" },
  { name: "Olena Kholina", work: "Two people reviewing documents at a table" },
  { name: "Markus Winkler", work: "Stock market chart displayed on laptop screen" },
  { name: "Tyler Franta", work: "Person using laptop on white wooden table" },
  { name: "Vitaly Gariev", work: "Couple looking stressed over bills at kitchen table" },
  { name: "Giorgio Tomassetti", work: "Two women analyze a line graph on a screen" },
  { name: "Medienstürmer", work: "Two people sitting during day" },
  { name: "Jon Moore", work: "Black and white electric meter" },
  { name: "Headway", work: "Person gesturing during meeting with laptop" },
  { name: "Ashes Sitoula", work: "Bulb photography" },
  { name: "Han-Hsing Tu", work: "A bunch of electrical meters are stacked on top of each other" },
];
