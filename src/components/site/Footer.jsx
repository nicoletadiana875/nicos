import { site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
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
