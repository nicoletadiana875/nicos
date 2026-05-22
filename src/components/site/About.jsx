import SectionHeading from "@/components/site/SectionHeading";
import { aboutContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function About() {
  return (
    <section id="chi-sono" className={`${styles.section} ${styles.chiSonoSection}`}>
      <div className={`container ${styles.aboutGrid} ${styles.chiSonoGrid}`}>
        <div className={styles.aboutCopy}>
          <SectionHeading title={aboutContent.title} description={aboutContent.description} />

          <div className={styles.paragraphStack}>
            {aboutContent.paragraphs.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className={styles.timeline}>
            {aboutContent.steps.map((item) => (
              <article key={item.number} className={styles.timelineItem}>
                <span className={styles.timelineNumber}>{item.number}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.aboutAside}>
          <div className={styles.aboutMediaColumn}>
            <figure className={`${styles.aboutFigure} ${styles.chiSonoVisual}`} aria-label="Lampadina premium accesa">
              <img
                src="/images/bulb-background.jpg"
                alt="Lampadina elegante accesa con glow caldo cinematografico"
                className={styles.chiSonoVisualImage}
                loading="lazy"
                decoding="async"
              />
            </figure>

            <figure className={`${styles.aboutFigure} ${styles.chiSonoVisual}`} aria-label="Fiamma premium elegante">
              <img
                src="/images/flame-premium.jpg"
                alt="Fiamma moderna con glow caldo"
                className={styles.chiSonoVisualImage}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
