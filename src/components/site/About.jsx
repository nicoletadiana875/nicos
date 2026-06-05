import SectionHeading from "@/components/site/SectionHeading";
import { aboutContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function About() {
  return (
    <section id="chi-sono" className={`${styles.section} ${styles.chiSonoSection}`}>
      <div className="container">
        <SectionHeading title={aboutContent.title} />

        <div className={`${styles.aboutGrid} ${styles.chiSonoGrid}`}>
          <div className={styles.aboutCopy}>
            <div className={styles.paragraphStack}>
              <p>{aboutContent.description}</p>
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
              <figure className={styles.aboutFigure} aria-label="Lampadina premium accesa">
                <img
                  src="/images/bulb-landscape.jpg"
                  alt="Lampadina elegante accesa con glow caldo cinematografico"
                  className={styles.chiSonoVisualImage}
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <figure className={styles.aboutFigure} aria-label="Fiamma premium elegante">
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
      </div>
    </section>
  );
}
