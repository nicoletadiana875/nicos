"use client";

import { useState } from "react";
import Icon from "@/components/site/Icon";
import SectionHeading from "@/components/site/SectionHeading";
import { contactContent, site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Contact() {
  const [feedback, setFeedback] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setFeedback("Compila tutti i campi obbligatori.");
      form.reportValidity();
      return;
    }

    setFeedback("Richiesta ricevuta. Ti ricontatterò al più presto.");
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
                <p>Puoi allegare bollette in PDF o immagine per una prima analisi.</p>
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
          <div className={styles.formRow}>
            <div>
              <label htmlFor="nome">Nome e cognome</label>
              <input id="nome" name="nome" type="text" required />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />
            </div>
          </div>

          <div>
            <label htmlFor="messaggio">Messaggio</label>
            <textarea id="messaggio" name="messaggio" rows="6" required />
          </div>

          <div>
            <label htmlFor="bolletta">Invia bolletta</label>
            <input id="bolletta" name="bolletta" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>

          <button type="submit" className="btn btn-primary">
            Invia richiesta
          </button>
          <p className={styles.feedback} aria-live="polite">
            {feedback}
          </p>
        </form>
      </div>
    </section>
  );
}
