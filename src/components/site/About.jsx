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
              <figure className={styles.aboutFigure} aria-label="Energia rinnovabile">
                <img
                  src="/images/natura-eco.png"
                  alt="Energia rinnovabile, germoglio verde"
                  className={styles.chiSonoVisualImage}
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <figure className={styles.aboutFigure} aria-label="Risparmio ed energia verde">
                <img
                  src="/images/emblema-eco.png"
                  alt="Risparmio ed energia verde"
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
