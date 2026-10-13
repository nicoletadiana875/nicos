"use client";

import { useState } from "react";
import EnergyBackdrop from "@/components/site/EnergyBackdrop";
import Link from "next/link";
import Icon from "@/components/site/Icon";
import LiquidButton from "@/components/site/LiquidButton";
import SectionDivider from "@/components/site/SectionDivider";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { legal } from "@/config/legal.mjs";
import { contactContent, site } from "@/content/site";
import { MAX_FILE_MB, validateContact } from "@/lib/contactRules";
import styles from "@/styles/site.module.css";

const FALLBACK = `Se il problema persiste scrivimi a ${site.email} o su WhatsApp.`;

export default function Contact() {
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot anti-bot: se il campo nascosto è compilato, ignora silenziosamente
    if (data.get("website")) {
      setFeedback("Richiesta ricevuta.");
      setIsError(false);
      form.reset();
      return;
    }

    // Validazione lato client (le stesse regole sono ripetute sul server)
    const problem = validateContact({
      nome: data.get("nome")?.trim() ?? "",
      email: data.get("email")?.trim() ?? "",
      messaggio: data.get("messaggio")?.trim() ?? "",
      privacy: data.get("privacy") === "on",
      file: data.get("bolletta"),
    });
    if (problem) {
      setFeedback(problem);
      setIsError(true);
      return;
    }

    // Un campo file vuoto non va inviato
    const file = data.get("bolletta");
    if (file && file.size === 0) data.delete("bolletta");

    setSending(true);
    setIsError(false);
    setFeedback("Invio in corso…");

    try {
      const response = await fetch("/api/contact", { method: "POST", body: data });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok) {
        setFeedback("Richiesta inviata. Ti ricontatterò al più presto.");
        setIsError(false);
        form.reset();
      } else {
        const base = result.error || "Non è stato possibile inviare la richiesta.";
        if (response.status === 400) {
          setFeedback(base);
        } else if (result.code === "not_configured") {
          setFeedback(`${base} Scrivimi direttamente a ${site.email} o su WhatsApp.`);
        } else {
          setFeedback(`${base} ${FALLBACK}`);
        }
        setIsError(true);
      }
    } catch {
      setFeedback(`Connessione non riuscita. ${FALLBACK}`);
      setIsError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contatti" className={styles.section}>
      <SectionDivider tone="cream" />
      <EnergyBackdrop />
      <div className="container">
        <SectionHeading
          title={contactContent.title}
          description={contactContent.description}
        />

        <div className={styles.contactGrid}>
          <div>
            <Reveal>
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
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {site.whatsappLabel}
                  </a>
                </div>
              </div>

              <div className={styles.contactInfoRow}>
                <span className={styles.iconBadge}>
                  <Icon name="phone" className={styles.icon} />
                </span>
                <div>
                  <span>Telefono</span>
                  <a href={site.phoneHref}>{site.phoneLabel}</a>
                </div>
              </div>

              <div className={styles.contactInfoRow}>
                <span className={styles.iconBadge}>
                  <Icon name="upload" className={styles.icon} />
                </span>
                <div>
                  <span>Documenti</span>
                  <p>
                    Puoi allegare bollette in PDF o immagine (max {MAX_FILE_MB}{" "}
                    MB) per una prima analisi.
                  </p>
                </div>
              </div>

              <div className={styles.contactActions}>
                <LiquidButton href={site.phoneHref} variant="secondary" compact>
                  Chiama ora
                </LiquidButton>
                <LiquidButton
                  href={site.whatsappUrl}
                  compact
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Scrivi su WhatsApp
                </LiquidButton>
              </div>
            </div>
            </Reveal>

            <Reveal delay={0.1}>
            <div className={styles.contactProcessCard}>
              <h3>Come funziona</h3>
              <ol className={styles.processList}>
                {contactContent.process.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className={styles.contactFormReveal}>
          <form className={styles.formCard} onSubmit={onSubmit} noValidate>
            {/* Honeypot: invisibile agli utenti, i bot lo compilano */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                pointerEvents: "none",
              }}
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
                rows="4"
                required
                minLength={10}
                maxLength={2000}
              />
            </div>

            <div>
              <label htmlFor="bolletta">
                Invia bolletta{" "}
                <small>(PDF, JPG, PNG — max {MAX_FILE_MB} MB)</small>
              </label>
              <input
                id="bolletta"
                name="bolletta"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>

            <div className={styles.consentBlock}>
              <label className={styles.checkRow}>
                <input type="checkbox" name="privacy" required />
                <span>
                  Ho letto l&apos;<Link href="/privacy" target="_blank">
                    Informativa sulla privacy
                  </Link>{" "}
                  *
                </span>
              </label>

              {legal.collectPromoConsent && (
                <label className={styles.checkRow}>
                  <input type="checkbox" name="promo" />
                  <span>
                    Desidero ricevere comunicazioni informative e promozionali. Facoltativo: non
                    influisce sulla richiesta di consulenza.
                  </span>
                </label>
              )}

              <p className={styles.formHint}>
                I dati servono solo a risponderti. Allega soltanto i documenti necessari: puoi
                oscurare le informazioni non pertinenti.
              </p>
            </div>

            <LiquidButton type="submit" disabled={sending}>
              {sending ? "Invio in corso…" : "Invia richiesta"}
            </LiquidButton>

            {feedback && (
              <p
                className={styles.feedback}
                aria-live="polite"
                style={{
                  color: isError ? "var(--danger)" : undefined,
                }}
              >
                {feedback}
              </p>
            )}
          </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
