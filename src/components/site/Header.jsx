import { site } from "@/content/site";
import LiquidButton from "@/components/site/LiquidButton";
import styles from "@/styles/site.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
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

        <LiquidButton href="#contatti" className={styles.headerLiquidCta}>
          Parla con me
        </LiquidButton>
      </div>
    </header>
  );
}
