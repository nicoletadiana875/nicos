"use client";

import { useState } from "react";
import Icon from "@/components/site/Icon";
import LiquidButton from "@/components/site/LiquidButton";
import SectionHeading from "@/components/site/SectionHeading";
import { contactContent, site } from "@/content/site";
import styles from "@/styles/site.module.css";

const MAX_FILE_MB = 5;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function Contact() {
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-bot: se il campo nascosto è compilato, ignora silenziosamente
    if (data.get("website")) {
      setFeedback("Richiesta ricevuta.");
      setIsError(false);
      form.reset();
      return;
    }

    const nome = data.get("nome")?.trim() ?? "";
    const email = data.get("email")?.trim() ?? "";
    const messaggio = data.get("messaggio")?.trim() ?? "";
    const file = data.get("bolletta");

    // Validazione lato client
    if (!nome || nome.length < 2 || nome.length > 100) {
      setFeedback("Inserisci un nome valido (2–100 caratteri).");
      setIsError(true);
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setFeedback("Inserisci un indirizzo email valido.");
      setIsError(true);
      return;
    }

    if (!messaggio || messaggio.length < 10 || messaggio.length > 2000) {
      setFeedback("Il messaggio deve essere tra 10 e 2000 caratteri.");
      setIsError(true);
      return;
    }

    // Validazione file (tipo e dimensione)
    if (file && file.size > 0) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFeedback("Formato non supportato. Usa PDF, JPG o PNG.");
        setIsError(true);
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setFeedback(`Il file supera i ${MAX_FILE_MB} MB consentiti.`);
        setIsError(true);
        return;
      }
    }

    setFeedback("Richiesta ricevuta. Ti ricontatterò al più presto.");
    setIsError(false);
    form.reset();
  };

  return (
    <section id="contatti" className={styles.section}>
      <div className={`container ${styles.contactGrid}`}>
        <div>
          <SectionHeading title={contactContent.title} description={contactContent.description} />

          <div className={styles.contactInfoCard}>
            <div className={styles.contactInfoRow}>
              <span className={styles.iconBadge}>
                <Icon name="mail" className={styles.icon} />
              </span>
              <div>
                <span>Email</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>

            <div className={styles.contactInfoRow}>
              <span className={styles.iconBadge}>
                <Icon name="chat" className={styles.icon} />
              </span>
              <div>
                <span>WhatsApp</span>
                <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {site.whatsappLabel}
                </a>
              </div>
            </div>

            <div className={styles.contactInfoRow}>
              <span className={styles.iconBadge}>
                <Icon name="upload" className={styles.icon} />
              </span>
              <div>
                <span>Documenti</span>
                <p>Puoi allegare bollette in PDF o immagine (max {MAX_FILE_MB} MB) per una prima analisi.</p>
              </div>
            </div>
          </div>

          <div className={styles.contactProcessCard}>
            <h3>Come funziona</h3>
            <ol className={styles.processList}>
              {contactContent.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>

        <form className={styles.formCard} onSubmit={onSubmit} noValidate>
          {/* Honeypot: invisibile agli utenti, i bot lo compilano */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
          />

          <div className={styles.formRow}>
            <div>
              <label htmlFor="nome">Nome e cognome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="messaggio">Messaggio</label>
            <textarea
              id="messaggio"
              name="messaggio"
              rows="6"
              required
              minLength={10}
              maxLength={2000}
            />
          </div>

          <div>
            <label htmlFor="bolletta">Invia bolletta <small>(PDF, JPG, PNG — max {MAX_FILE_MB} MB)</small></label>
            <input
              id="bolletta"
              name="bolletta"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <LiquidButton type="submit" className={styles.headerLiquidCta}>
            Invia richiesta
          </LiquidButton>

          {feedback && (
            <p
              className={styles.feedback}
              aria-live="polite"
              style={{ color: isError ? "var(--color-danger, #e05c5c)" : undefined }}
            >
              {feedback}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
