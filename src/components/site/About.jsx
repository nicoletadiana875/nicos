import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { aboutContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function About() {
  return (
    <section id="chi-sono" className={`${styles.section} ${styles.chiSonoSection}`}>
      <div className="container">
        <SectionHeading title={aboutContent.title} />

        <div className={`${styles.aboutGrid} ${styles.chiSonoGrid}`}>
          <div className={styles.aboutCopy}>
            <Reveal>
            <div className={styles.paragraphStack}>
              <p>{aboutContent.description}</p>
              {aboutContent.paragraphs.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            </Reveal>

            <Reveal delay={0.1}>
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
            </Reveal>
          </div>

          <div className={styles.aboutAside}>
            <div className={styles.aboutMediaColumn}>
              <Reveal className={styles.aboutMediaItem}>
                <figure className={styles.aboutFigure} aria-label="Analisi dei documenti">
                  <img
                    src="/images/consulenza-documenti.jpg"
                    alt="Due professionisti esaminano insieme documenti e contratti su un tavolo"
                    className={styles.chiSonoVisualImage}
                    width={1600}
                    height={1067}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </Reveal>

              <Reveal className={styles.aboutMediaItem} delay={0.12}>
                <figure className={styles.aboutFigure} aria-label="Gestione dei consumi di casa">
                  <img
                    src="/images/termostato-casa.jpg"
                    alt="Mani che regolano un termostato digitale per gestire i consumi di riscaldamento"
                    className={styles.chiSonoVisualImage}
                    width={1600}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
