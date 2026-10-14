"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { fallbackLinks } from "@/config/marketLinks.mjs";
import styles from "@/styles/site.module.css";

const REFRESH_MS = 15 * 60_000;

const number = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <p className={styles.chartTooltipDate}>{label}</p>
      <p className={styles.chartTooltipValue}>{number.format(payload[0].value)} €/MWh</p>
    </div>
  );
}

const formatDay = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function MarketChart({ gas }) {
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    let alive = true;

    const load = () =>
      fetch("/api/market-history", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => alive && setState({ loading: false, data }))
        .catch(() => alive && setState((prev) => ({ loading: false, data: prev.data })));

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const { loading, data } = state;
  const history = data?.history ?? [];
  const avg = history.length
    ? Math.round((history.reduce((s, d) => s + d.value, 0) / history.length) * 100) / 100
    : null;

  const gasHasValue = gas && gas.value != null;

  return (
    <div className={styles.chartWrapper}>
      {/* Elettricita': andamento degli ultimi 30 giorni */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartBadge}>{data?.shortLabel ?? "Luce"}</span>
          <p className={styles.chartLabel}>
            {data?.label ?? "Energia elettrica"} — ultimi 30 giorni, media giornaliera
          </p>
        </div>

        {loading ? (
          <div className={styles.chartLoading}>Caricamento…</div>
        ) : history.length === 0 ? (
          <div className={styles.chartLoading}>Dati non disponibili al momento</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />
              <YAxis
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `${Math.round(v)}`}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--sage-300)", strokeWidth: 1 }}
              />
              {avg && (
                <ReferenceLine y={avg} stroke="var(--sage-300)" strokeDasharray="4 4" />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--sage-700)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--sage-700)", stroke: "var(--ivory)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {avg && (
          <p className={styles.chartAvg}>
            Media del periodo: <strong>{number.format(avg)} €/MWh</strong>
          </p>
        )}
        {data?.source && history.length > 0 && (
          <p className={styles.chartAvg}>
            <a className={styles.marketSource} href={data.source.url} target="_blank" rel="noopener noreferrer">
              Fonte: {data.source.name}
            </a>
          </p>
        )}
      </div>

      {/* Gas: ultimo valore ufficiale disponibile, senza stime */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartBadge}>PSV</span>
          <p className={styles.chartLabel}>
            Gas naturale — {gas?.label ?? "indice IGI GME (riferimento PSV)"}
          </p>
        </div>

        <div className={styles.chartPsvDisplay}>
          {gasHasValue ? (
            <>
              <p className={styles.chartPsvValue}>
                {number.format(gas.value)} {gas.unit}
              </p>
              <p className={styles.chartPsvNote}>
                {gas.kind === "psv-monthly"
                  ? gas.status === "live"
                    ? `Media mensile di ${gas.period?.label}`
                    : `Non aggiornato: ultimo dato disponibile, ${gas.period?.label}.`
                  : gas.status === "live"
                    ? `Indice del ${formatDay(gas.date)}`
                    : `Non aggiornato: ultimo dato disponibile del ${formatDay(gas.date)}.`}
                {gas.product ? ` · ${gas.product}` : ""}
              </p>
              {gas.source && (
                <p className={styles.chartPsvNote}>
                  <a className={styles.marketSource} href={gas.source.url} target="_blank" rel="noopener noreferrer">
                    Fonte: {gas.source.name}
                  </a>
                </p>
              )}
            </>
          ) : (
            <>
              <p className={styles.chartPsvValue}>Non disponibile</p>
              <p className={styles.chartPsvNote}>
                Il prezzo del gas viene mostrato solo quando arriva da una fonte ufficiale: non
                vengono visualizzati valori stimati o non aggiornati come se fossero attuali.
              </p>
              <p className={styles.chartPsvNote}>
                <a
                  className={styles.marketSource}
                  href={fallbackLinks.gas.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consulta il prezzo ufficiale del gas sul sito GME →
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
