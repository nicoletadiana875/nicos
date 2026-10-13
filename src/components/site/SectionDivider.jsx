import styles from "@/styles/site.module.css";

const tones = {
  cream: styles.dividerCream,
  paper: styles.dividerPaper,
  dark: styles.dividerDark,
};

/** Onda posizionata sul bordo superiore di una sezione, nel colore della sezione stessa. */
export default function SectionDivider({ tone = "cream" }) {
  return (
    <div className={`${styles.divider} ${tones[tone]}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0 80V40C170 8 330 2 530 24s420 52 620 28c110-13 200-30 290-20V80Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
