"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { consentCategories, consentRequired, consentServices } from "@/config/consent.mjs";
import { OPEN_PREFERENCES_EVENT, readConsent, saveConsent } from "@/lib/consent";
import styles from "@/styles/site.module.css";

const categoryIds = [...new Set(consentServices.map((s) => s.category))];

const allChoices = (value) => Object.fromEntries(categoryIds.map((id) => [id, value]));

/**
 * Gestione dei consenso ai cookie.
 *  - Il banner compare solo se esiste almeno uno strumento non strettamente necessario
 *    (src/config/consent.mjs) e l'utente non ha ancora scelto.
 *  - "Rifiuta tutti" e "Accetta tutti" hanno lo stesso peso visivo.
 *  - Nulla viene attivato prima del consenso: gli strumenti vanno caricati con <ConsentGate>.
 *  - Il pannello "Preferenze cookie" e' sempre raggiungibile dal footer.
 */
export default function ConsentManager() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [draft, setDraft] = useState(() => allChoices(false));
  const panelRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!consentRequired) return;
    const saved = readConsent();
    if (saved) setDraft({ ...allChoices(false), ...saved.choices });
    else setBannerOpen(true);
  }, []);

  const openPanel = useCallback(() => {
    lastFocus.current = document.activeElement;
    if (consentRequired) {
      const saved = readConsent();
      setDraft({ ...allChoices(false), ...(saved?.choices ?? {}) });
    }
    setPanelOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPanel);
  }, [openPanel]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!panelOpen) return undefined;
    panelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, closePanel]);

  const decide = (choices) => {
    saveConsent(choices);
    setDraft(choices);
    setBannerOpen(false);
    setPanelOpen(false);
  };

  return (
    <>
      {consentRequired && bannerOpen && !panelOpen && (
        <div
          className={styles.consentBanner}
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
        >
          <div>
            <h2 id="consent-title">Il rispetto della tua privacy</h2>
            <p>
              Oltre ai cookie strettamente necessari, questo sito vorrebbe usare strumenti per
              statistiche o contenuti di terze parti. Nulla viene attivato senza il tuo consenso.
              Maggiori informazioni nella <Link href="/cookie">Cookie Policy</Link>.
            </p>
          </div>
          <div className={styles.consentActions}>
            <button type="button" className={styles.consentBtn} onClick={() => decide(allChoices(false))}>
              Rifiuta tutti
            </button>
            <button type="button" className={styles.consentBtn} onClick={() => decide(allChoices(true))}>
              Accetta tutti
            </button>
            <button type="button" className={styles.consentLink} onClick={openPanel}>
              Personalizza
            </button>
          </div>
        </div>
      )}

      {panelOpen && (
        <div className={styles.consentOverlay} onMouseDown={(e) => e.target === e.currentTarget && closePanel()}>
          <div
            className={styles.consentPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-panel-title"
            tabIndex={-1}
            ref={panelRef}
          >
            <div className={styles.consentPanelHead}>
              <h2 id="consent-panel-title">Preferenze cookie</h2>
              <button type="button" className={styles.consentClose} onClick={closePanel} aria-label="Chiudi">
                ×
              </button>
            </div>

            <div className={styles.consentItem}>
              <div>
                <strong>Strettamente necessari</strong>
                <p>
                  Servono al funzionamento del sito e non richiedono consenso.{" "}
                  {consentServices.length === 0
                    ? "Al momento il sito non installa alcun cookie e non memorizza dati nel browser."
                    : "Il sito non ne installa altri oltre alla memorizzazione di questa scelta."}
                </p>
              </div>
              <span className={styles.consentState}>Sempre attivi</span>
            </div>

            {categoryIds.length === 0 ? (
              <p className={styles.consentEmpty}>
                Nessuno strumento di statistica, marketing o di terze parti è in uso: non c’è nulla da
                accettare o rifiutare. Se verranno introdotti, lo chiederemo prima di attivarli.
              </p>
            ) : (
              categoryIds.map((id) => {
                const category = consentCategories[id] ?? { label: id, description: "" };
                const services = consentServices.filter((s) => s.category === id);
                return (
                  <div className={styles.consentItem} key={id}>
                    <div>
                      <strong>{category.label}</strong>
                      <p>{category.description}</p>
                      <small>{services.map((s) => `${s.name} (${s.provider})`).join(" · ")}</small>
                    </div>
                    <label className={styles.consentSwitch}>
                      <input
                        type="checkbox"
                        checked={Boolean(draft[id])}
                        onChange={(e) => setDraft((d) => ({ ...d, [id]: e.target.checked }))}
                        aria-label={`Consenti ${category.label}`}
                      />
                      <span aria-hidden="true" />
                    </label>
                  </div>
                );
              })
            )}

            <div className={styles.consentPanelActions}>
              {categoryIds.length > 0 ? (
                <>
                  <button type="button" className={styles.consentBtn} onClick={() => decide(allChoices(false))}>
                    Rifiuta tutti
                  </button>
                  <button type="button" className={styles.consentBtn} onClick={() => decide(draft)}>
                    Salva preferenze
                  </button>
                  <button type="button" className={styles.consentBtn} onClick={() => decide(allChoices(true))}>
                    Accetta tutti
                  </button>
                </>
              ) : (
                <button type="button" className={styles.consentBtn} onClick={closePanel}>
                  Chiudi
                </button>
              )}
            </div>
            <p className={styles.consentFootnote}>
              Le scelte sono ricordate per 6 mesi. Dettagli nella <Link href="/cookie">Cookie Policy</Link>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
