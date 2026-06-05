"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/site/SectionHeading";
import MarketChart from "@/components/site/MarketChart";
import { marketsContent } from "@/content/site";
import styles from "@/styles/site.module.css";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Markets() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/markets", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({}));
  }, []);

  const pun = data?.pun?.value != null ? `${data.pun.value} ${data.pun.unit}` : "—";
  const psv = data?.psv?.value != null ? `${data.psv.value} ${data.psv.unit}` : "—";
  const lastUpdate = formatDate(data?.lastUpdate);

  return (
    <section id="mercati" className={`${styles.section} ${styles.marketSection}`}>
      <div className="container">
        <SectionHeading title={marketsContent.title} />

        <div className={styles.marketCardsRow}>
          <article className={styles.marketCard}>
            <span>PUN</span>
            <h3>Energia elettrica</h3>
            <p>{data === null ? "…" : pun}</p>
          </article>

          <article className={styles.marketCard}>
            <span>PSV</span>
            <h3>Gas naturale</h3>
            <p>{data === null ? "…" : psv}</p>
          </article>

          <article className={styles.marketMetaCard}>
            <span>Ultimo aggiornamento</span>
            <p>{data === null ? "…" : lastUpdate}</p>
          </article>
        </div>

        <p className={styles.marketNote}>
          Dati indicativi aggiornati periodicamente. Fonte: GME/ARERA o provider di mercato.
        </p>

        <MarketChart psvValue={data?.psv?.value ?? null} />
      </div>
    </section>
  );
}
