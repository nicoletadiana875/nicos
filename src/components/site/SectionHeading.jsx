import Reveal from "@/components/site/Reveal";
import styles from "@/styles/site.module.css";
export default function SectionHeading({ title, description, align = "left" }) {
  return (
    <Reveal>
      <header
        className={`${styles.sectionHeading} ${align === "center" ? styles.sectionHeadingCenter : ""}`}
      >
        <span className={styles.sectionEyebrow}>Consulenza commerciale</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </header>
    </Reveal>
  );
}
