"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import LiquidButton from "@/components/site/LiquidButton";
import styles from "@/styles/site.module.css";

export default function WhatsAppFloat() {
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observerRef.current.observe(footer);

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
