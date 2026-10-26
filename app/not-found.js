import Link from "next/link";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import styles from "@/styles/site.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.legalMain}>
        <div className={`container ${styles.legalWrap}`}>
          <p className={styles.sectionEyebrow}>Errore 404</p>
          <h1 className={styles.legalTitle}>Pagina non trovata</h1>
          <p className={styles.legalIntro}>
            La pagina che cerchi non esiste o è stata spostata.
          </p>
          <p className={styles.legalBack}>
            <Link href="/">← Torna al sito</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
