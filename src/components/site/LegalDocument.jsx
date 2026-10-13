import Link from "next/link";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { consentCategories, consentServices } from "@/config/consent.mjs";
import { fieldLabels, getValue, legal } from "@/config/legal.mjs";
import { photoCredits } from "@/content/legal";
import styles from "@/styles/site.module.css";

// ---- testo con segnaposto {{dato}}, **grassetto** e [collegamenti](url)
const TOKEN = /(\{\{[a-zA-Z.]+\}\}|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function Placeholder({ path }) {
  return (
    <mark className={styles.placeholder} title="Dato da fornire prima della pubblicazione">
      [DA COMPLETARE: {fieldLabels[path] ?? path}]
    </mark>
  );
}

function Rich({ text }) {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;

    if (part.startsWith("{{")) {
      const path = part.slice(2, -2);
      const value = getValue(path);
      return typeof value === "string" && value.trim() ? (
        <span key={i}>{value}</span>
      ) : (
        <Placeholder key={i} path={path} />
      );
    }

    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      return href.startsWith("/") ? (
        <Link key={i} href={href}>
          {label}
        </Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

function shows(item) {
  if (item.when === "promo") return legal.collectPromoConsent;
  return true;
}

function Blocks({ blocks }) {
  return blocks.filter(shows).map((block, i) => {
    if (block.when) return <Blocks key={i} blocks={block.blocks} />;

    if (block.type === "verify") {
      // Visibili solo finche' i testi sono in bozza
      return legal.draft ? (
        <aside key={i} className={styles.legalVerify}>
          <strong>Nota per la revisione</strong>
          <span>{block.text}</span>
        </aside>
      ) : null;
    }

    if (block.type === "credits") {
      return (
        <ul key={i} className={styles.legalList}>
          {photoCredits.map((c) => (
            <li key={c.name + c.work}>
              {c.name} — «{c.work}»
            </li>
          ))}
        </ul>
      );
    }

    if (block.type === "services") {
      if (!consentServices.length) {
        return (
          <p key={i}>
            <strong>Nessuno.</strong> Alla data di aggiornamento non sono in uso strumenti soggetti a
            consenso.
          </p>
        );
      }
      return (
        <div key={i} className={styles.legalTableWrap}>
          <table className={styles.legalTable}>
            <thead>
              <tr>
                <th>Strumento</th>
                <th>Categoria</th>
                <th>Fornitore</th>
                <th>Finalità</th>
                <th>Cookie / durata</th>
              </tr>
            </thead>
            <tbody>
              {consentServices.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{consentCategories[s.category]?.label ?? s.category}</td>
                  <td>
                    {s.privacyUrl ? (
                      <a href={s.privacyUrl} target="_blank" rel="noopener noreferrer">
                        {s.provider}
                      </a>
                    ) : (
                      s.provider
                    )}
                  </td>
                  <td>{s.purpose}</td>
                  <td>{(s.cookies ?? []).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (block.ul) {
      return (
        <ul key={i} className={styles.legalList}>
          {block.ul.filter(shows).map((item, j) => (
            <li key={j}>
              <Rich text={typeof item === "string" ? item : item.text} />
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i}>
        <Rich text={block.p} />
      </p>
    );
  });
}

export default function LegalDocument({ doc }) {
  return (
    <>
      <Header />
      <main className={styles.legalMain}>
        <div className={`container ${styles.legalWrap}`}>
          <p className={styles.sectionEyebrow}>Informazioni legali</p>
          <h1 className={styles.legalTitle}>{doc.title}</h1>
          <p className={styles.legalMeta}>Ultimo aggiornamento: {legal.lastUpdated}</p>

          {legal.draft && (
            <div className={styles.legalDraft} role="note">
              <strong>Bozza non ancora definitiva.</strong> Questo testo è una prima versione: i dati
              evidenziati vanno completati e il contenuto deve essere verificato da un professionista
              prima della pubblicazione.
            </div>
          )}

          <p className={styles.legalIntro}>{doc.intro}</p>

          <nav className={styles.legalToc} aria-label="Indice della pagina">
            <ol>
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title.replace(/^\d+\.\s*/, "")}</a>
                </li>
              ))}
            </ol>
          </nav>

          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.legalSection}>
              <h2>{section.title}</h2>
              <Blocks blocks={section.blocks} />
            </section>
          ))}

          <p className={styles.legalBack}>
            <Link href="/">← Torna al sito</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
