"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/site/SectionHeading";
import EnergyBackdrop from "@/components/site/EnergyBackdrop";
import Reveal from "@/components/site/Reveal";
import MarketChart from "@/components/site/MarketChart";
import { marketsContent } from "@/content/site";
import { fallbackLinks, marketLinks } from "@/config/marketLinks.mjs";
import styles from "@/styles/site.module.css";

// I prezzi day-ahead cambiano una volta al giorno, l'ora in corso ogni 15-60 minuti
const REFRESH_MS = 5 * 60_000;

const number = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDay = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const number4 = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

// "2025-S2" -> "2° semestre 2025"
const formatSemester = (code) => {
  const m = /^(\d{4})-S([12])$/.exec(code ?? "");
  return m ? `${m[2]}° semestre ${m[1]}` : code;
};

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });

function SourceLink({ source }) {
  if (!source) return null;
  return (
    <a className={styles.marketSource} href={source.url} target="_blank" rel="noopener noreferrer">
      Fonte: {source.name}
    </a>
  );
}

function PriceCard({ item, title, loading, fallback }) {
  const hasValue = item && item.value != null;

  return (
    <article className={styles.marketCard}>
      <span>{item?.shortLabel ?? "…"}</span>
      <h3>{title}</h3>
      <p>
        {loading
          ? "…"
          : hasValue
            ? `${number.format(item.value)} ${item.unit}`
            : "Non disponibile"}
      </p>

      {!loading && (
        <div className={styles.marketCardMeta}>
          {hasValue && item.status === "live" && (
            <>
              {item.kind === "psv-monthly" ? (
                <>
                  <small>Media mensile di {item.period?.label}</small>
                  <small>Valore pubblicato da ARERA ogni mese, entro i primi giorni del successivo.</small>
                </>
              ) : (
                <small>
                  {item.product ? `${item.product} · ` : ""}
                  {item.kind === "igi" ? "Indice del" : "Media del"} {formatDay(item.date)}
                </small>
              )}
              {item.current && item.current.value != null && (
                <small>Prezzo in questo momento: {number.format(item.current.value)} {item.unit}</small>
              )}
              {item.next && (
                <small>
                  {formatDay(item.next.date)}: {number.format(item.next.value)} {item.unit}
                </small>
              )}
            </>
          )}
          {hasValue && item.status === "stale" && (
            <small className={styles.marketStale}>
              Non aggiornato: ultimo dato disponibile,{" "}
              {item.kind === "psv-monthly" ? item.period?.label : formatDay(item.date)}.
            </small>
          )}
          {!hasValue && (
            <>
              <small>Dato momentaneamente non disponibile da una fonte ufficiale.</small>
              {fallback && (
                <a className={styles.marketSource} href={fallback.url} target="_blank" rel="noopener noreferrer">
                  Consulta il dato ufficiale: {fallback.title} →
                </a>
              )}
            </>
          )}
          {hasValue && <SourceLink source={item?.source} />}
        </div>
      )}
    </article>
  );
}

export default function Markets() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;

    const load = () =>
      fetch("/api/markets", { cache: "no-store" })
        .then((r) => r.json())
        .then((json) => alive && setData(json))
        .catch(() => alive && setData((prev) => prev ?? { failed: true }));

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const loading = data === null;
  const electricity = data?.electricity;
  const gas = data?.gas;
  const consumerPrices = data?.consumerPrices ?? [];
  const gasStorage = data?.gasStorage ?? null;
  const gasMissing = !loading && (!gas || gas.value == null);

  return (
    <section id="mercati" className={`${styles.section} ${styles.marketSection}`}>
      <EnergyBackdrop />
      <div className="container">
        <SectionHeading title={marketsContent.title} />

        <Reveal>
          <div className={styles.marketCardsRow}>
            <PriceCard item={electricity} title="Energia elettrica" loading={loading} fallback={fallbackLinks.electricity} />
            <PriceCard item={gas} title="Gas naturale" loading={loading} fallback={fallbackLinks.gas} />

            <article className={styles.marketMetaCard}>
              <span>Ultimo aggiornamento</span>
              <p>
                {loading
                  ? "…"
                  : data?.generatedAt
                    ? formatDateTime(data.generatedAt)
                    : "Non disponibile"}
              </p>
              <div className={styles.marketCardMeta}>
                <small>
                  Prezzi del mercato del giorno prima (MGP), pubblicati ogni giorno intorno alle
                  13:00. La pagina si aggiorna da sola.
                </small>
              </div>
            </article>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className={styles.marketNote}>
            Valori reali letti dalle fonti indicate, mai stimati. Se una fonte non risponde viene
            segnalato e non si mostrano dati vecchi come se fossero attuali.
            {!loading && electricity?.kind === "zonal" && (
              <> Il prezzo dell&apos;elettricità è quello della zona Nord, non il PUN nazionale.</>
            )}
            {gasMissing && <> Il prezzo del gas è mostrato solo quando disponibile da fonte ufficiale.</>}
          </p>

          <MarketChart gas={gas} />
        </Reveal>

        {(consumerPrices.length > 0 || gasStorage) && (
          <Reveal delay={0.1}>
            <div className={styles.contextBlock}>
              <div>
                <h3>Quanto si paga in media in Italia</h3>
                <p>
                  Prezzi finali medi per kWh pubblicati da Eurostat con cadenza semestrale: non sono
                  prezzi in tempo reale, per questo è sempre indicato il periodo di riferimento.
                </p>
              </div>

              <ul className={styles.contextGrid}>
                {consumerPrices.map((item) => (
                  <li key={item.id} className={styles.contextTile}>
                    <span>
                      {item.audience} · {item.energy}
                    </span>
                    <strong>
                      {number4.format(item.value)} {item.unit}
                    </strong>
                    <small>{formatSemester(item.period)}</small>
                    <small>{item.detail}</small>
                    {item.eu != null && (
                      <small>
                        Media UE: {number4.format(item.eu)} {item.unit}
                      </small>
                    )}
                    <a href={item.source.url} target="_blank" rel="noopener noreferrer">
                      Fonte: {item.source.name} ↗
                    </a>
                  </li>
                ))}

                {gasStorage && (
                  <li className={styles.contextTile}>
                    <span>Gas · stoccaggi in Italia</span>
                    <strong>{number.format(gasStorage.percent)} %</strong>
                    <small>pieni al {formatDay(gasStorage.date)}</small>
                    {gasStorage.twh != null && <small>{number.format(gasStorage.twh)} TWh di gas in stoccaggio</small>}
                    <a href={gasStorage.source.url} target="_blank" rel="noopener noreferrer">
                      Fonte: {gasStorage.source.name} ↗
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className={styles.liveSources}>
            <div>
              <h3>Segui i mercati in tempo reale</h3>
              <p>
                I valori ufficiali sono pubblicati dagli enti che gestiscono i mercati. Questi
                collegamenti ti portano direttamente alle loro pagine, sempre aggiornate.
              </p>
            </div>
            <ul className={styles.liveSourcesList}>
              {marketLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <strong>{link.title}</strong>
                    <span>{link.description}</span>
                    <em>{link.provider} ↗</em>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
