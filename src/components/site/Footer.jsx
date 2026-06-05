import { site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Riga principale: brand + email */}
        <div className={styles.footerTop}>
          <div>
            <p className={styles.footerBrand}>{site.consultantName}</p>
            <p className={styles.footerRole}>{site.brand}</p>
          </div>
          <a href={`mailto:${site.email}`} className={styles.footerEmail}>
            {site.email}
          </a>
        </div>

        {/* Riga copyright: torna su a sinistra, lontano dal pulsante WhatsApp */}
        <div className={styles.footerBottom}>
          <div>
            <a href="#home" className={styles.footerBackTop} aria-label="Torna in cima">
              ↑ Torna su
            </a>
            <p className={styles.footerCopy}>
              © 2026 {site.consultantName} – {site.brand}
            </p>
            <p className={styles.footerSubline}>
              Consulenza professionale luce e gas per privati e aziende.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
