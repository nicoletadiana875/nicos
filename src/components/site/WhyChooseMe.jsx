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
              <div className={styles.pillarHeader}>
                <span className={styles.iconBadge}>
                  <Icon name={item.icon} className={styles.icon} />
                </span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
