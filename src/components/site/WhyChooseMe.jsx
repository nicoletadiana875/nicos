import Icon from "@/components/site/Icon";
import SectionHeading from "@/components/site/SectionHeading";
import Parallax from "@/components/site/Parallax";
import Reveal from "@/components/site/Reveal";
import SectionDivider from "@/components/site/SectionDivider";
import Stats from "@/components/site/Stats";
import { whyChooseContent } from "@/content/site";
import styles from "@/styles/site.module.css";
export default function WhyChooseMe() {
  return (
    <section
      id="perche-scegliere-me"
      className={`${styles.section} ${styles.whySection}`}
    >
      <SectionDivider tone="dark" />
      <div className={styles.photoBand} aria-hidden="true">
        <Parallax through from={-60} to={60} className={styles.photoBandParallax}>
          <img
            src="/images/contatori-scuri.jpg"
            alt=""
            className={styles.photoBandImg}
            width={1400}
            height={933}
            loading="lazy"
            decoding="async"
          />
        </Parallax>
      </div>
      <div className="container">
        <SectionHeading
          title={whyChooseContent.title}
          description={whyChooseContent.description}
          align="center"
        />
        <div className={styles.pillarsGrid}>
          {whyChooseContent.pillars.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.12}>
              <article className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.iconBadge}>
                    <Icon name={item.icon} className={styles.icon} />
                  </span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <Stats />
        </Reveal>
      </div>
    </section>
  );
}
