import Icon from "@/components/site/Icon";
import SectionHeading from "@/components/site/SectionHeading";
import { servicesContent } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Services() {
  return (
    <section id="servizi" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className="container">
        <SectionHeading
          title={servicesContent.title}
          description={servicesContent.description}
          align="center"
        />

        <div className={styles.servicesGrid}>
          {servicesContent.items.map((service) => (
            <article key={service.title} className={styles.serviceCard}>
              <div className={styles.serviceCardHeader}>
                <span className={styles.serviceNumber}>{service.number}</span>
                <span className={styles.iconBadge}>
                  <Icon name={service.icon} className={styles.icon} />
                </span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <p className={styles.serviceDetail}>{service.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
