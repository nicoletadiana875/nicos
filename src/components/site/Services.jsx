import Icon from "@/components/site/Icon";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { servicesContent } from "@/content/site";
import styles from "@/styles/site.module.css";
const serviceBenefits = {
  "01": [
    "Lettura completa delle bollette",
    "Verifica di clausole e costi",
    "Report con sintesi operativa",
  ],
  "02": [
    "Confronto tra diverse offerte",
    "Costo, durata e rischio",
    "Scelta su parametri chiari",
  ],
  "03": [
    "Monitoraggio periodico",
    "Azioni correttive mirate",
    "Aggiornamenti su mercato e fornitura",
  ],
};
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
          {servicesContent.items.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.1}>
              <article className={styles.serviceCard}>
                <div className={styles.serviceCardHeader}>
                  <span className={styles.serviceNumber}>{service.number}</span>
                  <span className={styles.iconBadge}>
                    <Icon name={service.icon} className={styles.icon} />
                  </span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ul className={styles.serviceBenefits}>
                  {(serviceBenefits[service.number] || []).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <a href="#contatti" className={styles.serviceCta}>
                  Richiedi una consulenza
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
