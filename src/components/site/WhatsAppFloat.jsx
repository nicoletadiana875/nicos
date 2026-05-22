import { site } from "@/content/site";
import styles from "@/styles/site.module.css";

export default function WhatsAppFloat() {
  return (
    <a
      className={styles.whatsappFloat}
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contattami su WhatsApp"
    >
      WhatsApp diretto
    </a>
  );
}
