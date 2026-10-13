"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import LiquidButton from "@/components/site/LiquidButton";
import styles from "@/styles/site.module.css";

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
    <LiquidButton
      href={site.whatsappUrl}
      className={`${styles.whatsappFloat} ${hidden ? styles.whatsappFloatHidden : ""}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contattami su WhatsApp"
    >
      WhatsApp diretto
    </LiquidButton>
  );
}
