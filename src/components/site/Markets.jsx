"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/site/SectionHeading";
import { marketsContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Markets() {
  const [markets, setMarkets] = useState({
    updatedAt: "-",
    pun: "In attesa endpoint",
    psv: "In attesa endpoint"
  });

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const response = await fetch("/api/markets", { cache: "no-store" });
        const data = await response.json();

        setMarkets({
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleString("it-IT") : "-",
          pun: data.pun ?? "Configura API PUN",
          psv: data.psv ?? "Configura API PSV"
        });
      } catch {
        setMarkets({
          updatedAt: "Errore caricamento",
          pun: "Dati non disponibili",
          psv: "Dati non disponibili"
        });
      }
    };

    loadMarkets();
  }, []);

  return (
    <section id="mercati" className={`${styles.section} ${styles.marketSection}`}>
      <div className={`container ${styles.marketGrid}`}>
        <div>
          <SectionHeading title={marketsContent.title} description={marketsContent.description} />

          <div className={styles.marketNoteCard}>
            <h3>{marketsContent.noteTitle}</h3>
            <p>{marketsContent.noteText}</p>
            <ul className={styles.cleanList}>
              {marketsContent.readiness.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.marketCards}>
          <article className={styles.marketCard}>
            <span>PUN</span>
            <h3>Energia elettrica</h3>
            <p>{markets.pun}</p>
          </article>

          <article className={styles.marketCard}>
            <span>PSV</span>
            <h3>Gas naturale</h3>
            <p>{markets.psv}</p>
          </article>

          <article className={styles.marketMetaCard}>
            <span>Ultimo aggiornamento</span>
            <p>{markets.updatedAt}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
