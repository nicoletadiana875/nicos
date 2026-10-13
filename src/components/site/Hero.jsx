import EnergyBackdrop from "@/components/site/EnergyBackdrop";
import Icon from "@/components/site/Icon";
import LiquidButton from "@/components/site/LiquidButton";
import Parallax from "@/components/site/Parallax";
import Reveal from "@/components/site/Reveal";
import { heroContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Hero() {
  // Titolo su due livelli: affermazione forte + completamento piu' leggero
  const [lead, ...rest] = heroContent.title.split(", ");
  const tail = rest.join(", ");

  return (
    <section
      id="home"
      className={styles.hero}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <EnergyBackdrop tone="hero" />

      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Reveal>
            <p className={styles.heroKicker}>{heroContent.kicker}</p>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLead}>{lead}{tail ? "," : ""}</span>
              {tail && <span className={styles.heroTitleTail}> {tail}</span>}
            </h1>
            <p className={styles.heroText}>{heroContent.text}</p>
            <div className={styles.heroActions}>
              <LiquidButton href={heroContent.primaryCta.href}>
                {heroContent.primaryCta.label}
              </LiquidButton>
              <LiquidButton href={heroContent.secondaryCta.href} variant="secondary">
                {heroContent.secondaryCta.label}
              </LiquidButton>
            </div>
            <ul className={styles.heroTrust}>
              <li>Prima analisi gratuita</li>
              <li>Senza alcun impegno</li>
              <li>Risposta entro 24 ore</li>
            </ul>
          </Reveal>
        </div>

        <div className={styles.heroVisualColumn}>
          <div className={styles.heroCollage}>
            <span className={styles.heroArc} aria-hidden="true" />

            <Reveal delay={0.1} className={styles.heroMainItem}>
              <figure className={styles.heroMain} aria-label="Casa con pannelli solari">
                <Parallax from={0} to={-36} className={styles.heroParallax}>
                  <img
                    src="/images/hero-casa-solare.jpg"
                    alt="Casa con pannelli solari sul tetto sotto un cielo sereno"
                    className={styles.heroPhoto}
                    width={1600}
                    height={901}
                    fetchPriority="high"
                    decoding="async"
                  />
                </Parallax>
              </figure>
            </Reveal>

            <Reveal delay={0.3} y={34} className={styles.heroInsetItem}>
              <figure className={styles.heroInset} aria-label="Casa luminosa e confortevole">
                <img
                  src="/images/casa-italiana.jpg"
                  alt="Soggiorno luminoso di una casa italiana con arco, finestra con tapparella e pavimento in cotto"
                  className={styles.heroInsetPhoto}
                  width={1000}
                  height={750}
                  decoding="async"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </div>

      <div className={`container ${styles.heroBottomRow}`}>
        <div className={styles.heroHighlights}>
          {heroContent.highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className={styles.heroHighlightCard}>
                <span className={styles.iconBadge}>
                  <Icon name={item.icon} className={styles.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className={styles.heroInfoCard}>
            <div className={styles.heroInfoHeader}>
              <div>
                <span>{heroContent.panelTitle}</span>
                <strong>Struttura chiara e supporto diretto</strong>
              </div>
            </div>
            <div className={styles.heroAudienceGrid}>
              {heroContent.audiences.map((item) => (
                <article key={item} className={styles.audienceCard}>
                  <span className={styles.audienceAccent} />
                  <p>{item}</p>
                </article>
              ))}
            </div>
            <div className={styles.heroPanelNote}>
              <span className={styles.iconBadge}>
                <Icon name="market" className={styles.icon} />
              </span>
              <div>
                <h3>Area mercati live pronta</h3>
                <p>{heroContent.panelText}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container">
        <Reveal>
          <div className={styles.benefitBand}>
            <div className={styles.benefitItem}>
              <strong>Gratuito</strong>
              <span>La prima analisi non ti costa nulla</span>
            </div>
            <div className={styles.benefitItem}>
              <strong>Senza vincoli</strong>
              <span>Decidi tu se e quando procedere</span>
            </div>
            <div className={styles.benefitItem}>
              <strong>Supporto continuo</strong>
              <span>Ti seguo prima e dopo la scelta</span>
            </div>
            <div className={styles.benefitItem}>
              <strong>Dati reali</strong>
              <span>Decisioni su bollette e mercato</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
