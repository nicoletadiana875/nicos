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
import styles from "@/styles/site.module.css";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <p className={styles.chartTooltipDate}>{label}</p>
      <p className={styles.chartTooltipValue}>{payload[0].value} €/MWh</p>
    </div>
  );
}

export default function MarketChart({ psvValue }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market-history", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const avg =
    history.length
      ? Math.round((history.reduce((s, d) => s + d.pun, 0) / history.length) * 100) / 100
      : null;

  return (
    <div className={styles.chartWrapper}>
      {/* PUN chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartBadge}>PUN</span>
          <p className={styles.chartLabel}>
            Energia elettrica — ultimi 30 giorni
            <span> · IT-North · energy-charts.info</span>
          </p>
        </div>

        {loading ? (
          <div className={styles.chartLoading}>Caricamento…</div>
        ) : history.length === 0 ? (
          <div className={styles.chartLoading}>Dati non disponibili</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 4"
                stroke="rgba(255, 221, 183, 0.07)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "rgba(234, 214, 191, 0.45)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />
              <YAxis
                tick={{ fill: "rgba(234, 214, 191, 0.45)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(241,192,122,0.18)", strokeWidth: 1 }} />
              {avg && (
                <ReferenceLine
                  y={avg}
                  stroke="rgba(241,192,122,0.25)"
                  strokeDasharray="4 4"
                />
              )}
              <Line
                type="monotone"
                dataKey="pun"
                stroke="#f1c07a"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#f1c07a", stroke: "#1a1716", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {avg && (
          <p className={styles.chartAvg}>Media 30gg: <strong>{avg} €/MWh</strong></p>
        )}
      </div>

      {/* PSV card — dato manuale, nessuna fonte storica gratuita disponibile */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartBadge}>PSV</span>
          <p className={styles.chartLabel}>
            Gas naturale — valore di riferimento
            <span> · aggiornabile in markets.json</span>
          </p>
        </div>

        <div className={styles.chartPsvDisplay}>
          <p className={styles.chartPsvValue}>
            {psvValue != null ? `${psvValue} €/MWh` : "—"}
          </p>
          <p className={styles.chartPsvNote}>
            Il PSV day-ahead non è disponibile da fonti gratuite senza credenziali.
            Il valore visualizzato è indicativo e aggiornabile manualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
