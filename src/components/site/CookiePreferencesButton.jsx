"use client";

import { OPEN_PREFERENCES_EVENT } from "@/lib/consent";
import styles from "@/styles/site.module.css";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className={styles.footerLinkButton}
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
    >
      Preferenze cookie
    </button>
  );
}
