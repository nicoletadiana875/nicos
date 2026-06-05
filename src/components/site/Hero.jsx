import Icon from "@/components/site/Icon";
import LiquidButton from "@/components/site/LiquidButton";
import { heroContent, site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Hero() {
  return (
    <section id="home" className={styles.hero} style={{ position: "relative", overflow: "hidden" }}>
      {/* Riga superiore: testo | immagine */}
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
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
        </div>

        <div className={styles.heroVisualColumn}>
          <div className={styles.heroVisualShell}>
            <figure className={styles.heroFigure} aria-label="Italia notturna premium">
              <div
                className={styles.heroBulbVisual}
                role="img"
                aria-label="Vista notturna dell'Italia con luci energetiche e glow caldo"
              />
            </figure>
          </div>
        </div>
      </div>

      {/* Riga inferiore: highlights | info card — allineati */}
      <div className={`container ${styles.heroBottomRow}`}>
        <div className={styles.heroHighlights}>
          {heroContent.highlights.map((item) => (
            <article key={item.title} className={styles.heroHighlightCard}>
              <span className={styles.iconBadge}>
                <Icon name={item.icon} className={styles.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.heroInfoCard}>
          <div className={styles.heroInfoHeader}>
            <div>
              <span>{heroContent.panelTitle}</span>
              <strong>Struttura chiara e supporto diretto</strong>
            </div>
            <a href={`mailto:${site.email}`} className={styles.inlineLink}>
              {site.email}
            </a>
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
    </section>
  );
}
