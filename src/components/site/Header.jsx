"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import LiquidButton from "@/components/site/LiquidButton";
import styles from "@/styles/site.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <div className={`container ${styles.headerInner}`}>
        <a href="#home" className={styles.logo}>
          <span className={styles.logoMark}>CE</span>
          <span className={styles.logoText}>
            <strong>{site.brand}</strong>
            <small>{site.consultantName}</small>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Navigazione principale">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <LiquidButton href="#contatti" className={styles.headerLiquidCta}>
            Parla con me
          </LiquidButton>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ""}`}
        aria-label="Navigazione mobile"
      >
        {site.nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
