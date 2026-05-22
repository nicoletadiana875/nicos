import Icon from "@/components/site/Icon";
import SectionHeading from "@/components/site/SectionHeading";
import { whyChooseContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function WhyChooseMe() {
  return (
    <section id="perche-scegliere-me" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className="container">
        <SectionHeading
          title={whyChooseContent.title}
          description={whyChooseContent.description}
          align="center"
        />

        <div className={styles.pillarsGrid}>
          {whyChooseContent.pillars.map((item) => (
            <article key={item.title} className={styles.pillarCard}>
              <span className={styles.iconBadge}>
                <Icon name={item.icon} className={styles.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className={styles.compareGrid}>
          <article className={styles.compareCard}>
            <h3>{whyChooseContent.compareLeftTitle}</h3>
            <ul className={styles.cleanList}>
              {whyChooseContent.compareLeft.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className={styles.compareCardFeatured}>
            <h3>{whyChooseContent.compareRightTitle}</h3>
            <ul className={styles.cleanList}>
              {whyChooseContent.compareRight.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
