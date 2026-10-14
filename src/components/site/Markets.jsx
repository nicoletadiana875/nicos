"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/site/SectionHeading";
import EnergyBackdrop from "@/components/site/EnergyBackdrop";
import Reveal from "@/components/site/Reveal";
import { marketsContent } from "@/content/site";
import styles from "@/styles/site.module.css";

const number = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Mercato del gas: solo il PSV day-ahead medio del mese, come pubblicato da ARERA.
 * Il valore cambia una volta al mese, per questo viene letto una sola volta al caricamento.
 */
export default function Markets() {
  // undefined = in caricamento, null = non disponibile
  const [gas, setGas] = useState(undefined);

  useEffect(() => {
    let alive = true;
    fetch("/api/markets", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => alive && setGas(json.gas ?? null))
      .catch(() => alive && setGas(null));
    return () => {
      alive = false;
    };
  }, []);

  const loading = gas === undefined;
  const hasValue = Boolean(gas) && gas.value != null;

  return (
    <section id="mercati" className={`${styles.section} ${styles.marketSection}`}>
      <EnergyBackdrop />
      <div className="container">
        <SectionHeading title={marketsContent.title} />

        <Reveal>
          <div className={styles.marketSingle}>
            <article className={styles.marketCard}>
              <span>PSV</span>
              <h3>Gas naturale</h3>
              <p>
                {loading ? "…" : hasValue ? `${number.format(gas.value)} ${gas.unit}` : "Non disponibile"}
              </p>

              {!loading && (
                <div className={styles.marketCardMeta}>
                  {hasValue ? (
                    <>
                      <small>
                        {gas.status === "stale"
                          ? `Non aggiornato: ultimo dato disponibile, ${gas.period?.label}.`
                          : `PSV day-ahead, media mensile di ${gas.period?.label}`}
                      </small>
                      <small>
                        Valore pubblicato da ARERA ogni mese, entro i primi giorni del successivo.
                      </small>
                      {gas.source && (
                        <a
                          className={styles.marketSource}
                          href={gas.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Fonte: {gas.source.name}
                        </a>
                      )}
                    </>
                  ) : (
                    <small>Dato momentaneamente non disponibile dalla fonte ufficiale.</small>
                  )}
                </div>
              )}
            </article>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className={styles.marketNote}>
            Il PSV è il riferimento all&apos;ingrosso del prezzo del gas in Italia. Il valore mostrato è
            la media del mese indicato, non il prezzo del giorno. Dato letto dalla fonte indicata,
            mai stimato.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
