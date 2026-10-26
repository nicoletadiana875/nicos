"use client";
import AnimatedCounter from "@/components/site/AnimatedCounter";
import { marketStats } from "@/content/site";
import styles from "@/styles/site.module.css";
export default function Stats() {
  return (
    <>
      <div className={styles.statsGrid}>
        {marketStats.items.map((item) => (
          <div key={item.label} className={styles.statItem}>
            <span className={styles.statValue}>
              <AnimatedCounter value={item.value} decimals={2} suffix=" €/MWh" />
            </span>
            <span className={styles.statLabel}>
              {item.label} · {marketStats.month}
            </span>
            <span className={styles.statSource}>{item.source}</span>
          </div>
        ))}
      </div>
      <p className={styles.statsNote}>{marketStats.note}</p>
    </>
  );
}
