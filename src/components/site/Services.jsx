import EnergyBackdrop from "@/components/site/EnergyBackdrop";
import Icon from "@/components/site/Icon";
import SectionDivider from "@/components/site/SectionDivider";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import SlideCarousel from "@/components/site/SlideCarousel";
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
// Una fotografia per scheda (chiave = numero del servizio)
const servicePhotos = {
  "01": {
    src: "/images/contatori-parete.jpg",
    alt: "Parete di contatori elettrici digitali allineati",
  },
  "02": {
    src: "/images/confronto-laptop.jpg",
    alt: "Confronto di offerte davanti a un laptop durante una riunione",
  },
  "03": {
    src: "/images/lampadina-erba.jpg",
    alt: "Lampadina appoggiata sull'erba, simbolo di risparmio energetico",
  },
};
export default function Services() {
  return (
    <section id="servizi" className={styles.section}>
      <SectionDivider tone="cream" />
      <EnergyBackdrop />
      <div className="container">
        <SectionHeading
          title={servicesContent.title}
          description={servicesContent.description}
          align="center"
        />
        <SlideCarousel label="Servizi">
          {servicesContent.items.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.1}>
              <article className={styles.serviceCard}>
                {servicePhotos[service.number] && (
                  <div className={styles.serviceMedia}>
                    <img
                      src={servicePhotos[service.number].src}
                      alt={servicePhotos[service.number].alt}
                      className={styles.serviceMediaImg}
                      width={1400}
                      height={788}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
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
        </SlideCarousel>
      </div>
    </section>
  );
}
