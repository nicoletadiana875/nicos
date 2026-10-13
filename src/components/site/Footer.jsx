import Link from "next/link";
import CookiePreferencesButton from "@/components/site/CookiePreferencesButton";
import SectionDivider from "@/components/site/SectionDivider";
import { legal } from "@/config/legal.mjs";
import { site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function Footer() {
  const c = legal.controller;
  // I dati d'impresa compaiono solo quando sono stati inseriti in src/config/legal.mjs
  const identity = [
    c.role,
    c.address,
    c.vatNumber && `P. IVA ${c.vatNumber}`,
    c.taxCode && `C.F. ${c.taxCode}`,
  ].filter(Boolean);

  return (
    <footer className={styles.footer}>
      <SectionDivider tone="dark" />
      <div className="container">
        <div className={styles.footerBottom}>
          <div>
            <a href="#" className={styles.footerBackTop} aria-label="Torna in cima">
              ↑ Torna su
            </a>
            <p className={styles.footerCopy}>
              © 2026 {site.consultantName} – {site.brand}
            </p>
            <p className={styles.footerSubline}>
              Consulenza professionale luce e gas per privati e aziende.
            </p>
            {identity.length > 0 && <p className={styles.footerSubline}>{identity.join(" · ")}</p>}
            <p className={styles.footerSubline}>
              <a href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
              <a href={site.phoneHref}>{site.phoneLabel}</a>
            </p>
          </div>

          <nav className={styles.footerLegal} aria-label="Informazioni legali">
            <Link href="/privacy">Informativa privacy</Link>
            <Link href="/cookie">Cookie Policy</Link>
            <Link href="/termini">Termini e condizioni</Link>
            <CookiePreferencesButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
