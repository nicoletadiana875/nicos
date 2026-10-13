import Parallax from "@/components/site/Parallax";
import styles from "@/styles/site.module.css";

/**
 * Sfondo decorativo: aloni di luce che derivano lentamente e linee che
 * richiamano flussi e connessioni energetiche. Solo CSS per il movimento,
 * il parallax allo scroll e' affidato al componente Parallax gia' presente.
 * tone: "hero" (piu' presente) | "soft" (sezioni interne)
 */
export default function EnergyBackdrop({ tone = "soft" }) {
  const id = `flow-${tone}`;
  return (
    <div
      className={`${styles.backdrop} ${tone === "hero" ? styles.backdropHero : styles.backdropSoft}`}
      aria-hidden="true"
    >
      <span className={`${styles.orb} ${styles.orbSage}`} />
      <span className={`${styles.orb} ${styles.orbWine}`} />
      <span className={`${styles.orb} ${styles.orbLight}`} />

      <Parallax from={24} to={-70} through={tone !== "hero"} className={styles.flowWrap}>
        <svg
          className={styles.flow}
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--sage-500)" stopOpacity="0" />
              <stop offset="0.5" stopColor="var(--burgundy-500)" stopOpacity="0.9" />
              <stop offset="1" stopColor="var(--sage-500)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            className={styles.flowLine}
            d="M-40 560C220 420 420 700 720 540S1180 300 1480 440"
          />
          <path
            className={styles.flowLine}
            d="M-40 640C260 520 480 760 780 620S1200 420 1480 540"
          />
          <path
            className={`${styles.flowLine} ${styles.flowLineThin}`}
            d="M-40 470C200 330 480 560 760 420S1160 200 1480 330"
          />

          <path
            className={styles.flowPulse}
            stroke={`url(#${id})`}
            pathLength="1000"
            d="M-40 560C220 420 420 700 720 540S1180 300 1480 440"
          />
          <path
            className={`${styles.flowPulse} ${styles.flowPulseSlow}`}
            stroke={`url(#${id})`}
            pathLength="1000"
            d="M-40 640C260 520 480 760 780 620S1200 420 1480 540"
          />

          <circle className={styles.flowNode} cx="720" cy="540" r="5" />
          <circle className={`${styles.flowNode} ${styles.flowNodeAlt}`} cx="1180" cy="330" r="4" />
          <circle className={styles.flowNode} cx="330" cy="470" r="3.5" />
        </svg>
      </Parallax>
    </div>
  );
}
