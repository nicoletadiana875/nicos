import { site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div>
          <p className={styles.footerBrand}>{site.brand}</p>
          <p className={styles.footerText}>{site.tagline}.</p>
        </div>

        <div className={styles.footerMeta}>
          <a href={`mailto:${site.email}`} className={styles.footerText}>
            {site.email}
          </a>
          <p className={styles.footerText}>Copyright 2026. Tutti i diritti riservati.</p>
          <a href="#home" className={styles.footerLink}>
            Torna su
          </a>
        </div>
      </div>
    </footer>
  );
}
