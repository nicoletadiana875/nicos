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
                <p className={styles.aboutLead}>{aboutContent.description}</p>
                {aboutContent.paragraphs.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={styles.focusCard}>
                <h3>{aboutContent.focusTitle}</h3>
                <ul className={styles.focusList}>
                  {aboutContent.focusList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className={styles.aboutAside}>
            <div className={styles.aboutMediaColumn}>
              <Reveal x={36} y={0} className={`${styles.aboutMediaItem} ${styles.aboutMediaMain}`}>
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

              <Reveal x={-36} y={30} delay={0.15} className={`${styles.aboutMediaItem} ${styles.aboutMediaInset}`}>
                <figure className={styles.aboutFigure} aria-label="Lavoro al computer">
                  <img
                    src="/images/uffici-laptop.jpg"
                    alt="Scrivania luminosa vista dall'alto con laptop, tablet e caffè durante una consulenza"
                    className={styles.chiSonoVisualImage}
                    width={1400}
                    height={935}
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
