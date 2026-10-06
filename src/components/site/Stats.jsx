"use client";
import AnimatedCounter from "@/components/site/AnimatedCounter";
import styles from "@/styles/site.module.css";
const stats = [
  { value: 24, suffix: "h", label: "Tempo di prima risposta" },
  { value: 100, suffix: "%", label: "Decisioni su dati reali" },
  { value: 3, suffix: "", label: "Fasi del metodo chiaro" },
  { value: 30, suffix: "gg", label: "Mercato PUN monitorato" },
];
export default function Stats() {
  return (
    <div className={styles.statsGrid}>
      {stats.map((item) => (
        <div key={item.label} className={styles.statItem}>
          <span className={styles.statValue}>
            <AnimatedCounter value={item.value} suffix={item.suffix} />
          </span>
          <span className={styles.statLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
