import Icon from "@/components/site/Icon";
import LiquidButton from "@/components/site/LiquidButton";
import Reveal from "@/components/site/Reveal";
import { heroContent, site } from "@/content/site";
import styles from "@/styles/site.module.css";
export default function Hero() {
  return (
    <section
      id="home"
      className={styles.hero}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <Reveal>
            <p className={styles.heroKicker}>{heroContent.kicker}</p>
            <h1>{heroContent.title}</h1>
            <p className={styles.heroText}>{heroContent.text}</p>
            <div className={styles.heroActions}>
              <LiquidButton href={heroContent.primaryCta.href}>
                {heroContent.primaryCta.label}
              </LiquidButton>
              <LiquidButton href={heroContent.secondaryCta.href}>
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
          <div className={styles.heroVisualShell}>
            <figure
              className={styles.heroFigure}
              aria-label="Energia elettrica"
            >
              <div
                className={styles.heroBulbVisual}
                role="img"
                aria-label="Lampadina accesa, energia elettrica"
              />
            </figure>
          </div>
        </div>
      </div>
      <div className={`container ${styles.heroBottomRow}`}>
        <div className={styles.heroHighlights}>
          {heroContent.highlights.map((item) => (
            <Reveal key={item.title}>
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
      </div>
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
    </section>
  );
}
