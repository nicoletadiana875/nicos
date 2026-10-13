"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import LiquidButton from "@/components/site/LiquidButton";
import styles from "@/styles/site.module.css";

/**
 * Pulsanti di contatto rapido, fissi in basso a destra:
 *  - WhatsApp (sempre);
 *  - Chiama (solo su schermi piccoli, dove la chiamata e' immediata).
 * Si nascondono quando sono visibili il footer o la sezione contatti.
 */
export default function WhatsAppFloat() {
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const targets = [document.querySelector("footer"), document.querySelector("#contatti")].filter(Boolean);
    if (targets.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => setHidden(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.05 }
    );
    targets.forEach((target) => observerRef.current.observe(target));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className={`${styles.floatStack} ${hidden ? styles.floatStackHidden : ""}`}>
      <LiquidButton
        href={site.phoneHref}
        compact
        variant="secondary"
        className={styles.floatCall}
        aria-label={`Chiama ${site.phoneLabel}`}
      >
        Chiama
      </LiquidButton>
      <LiquidButton
        href={site.whatsappUrl}
        compact
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattami su WhatsApp"
      >
        WhatsApp diretto
      </LiquidButton>
    </div>
  );
}
