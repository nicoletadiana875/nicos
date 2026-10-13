"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Parallax from "@/components/site/Parallax";
import Reveal from "@/components/site/Reveal";
import SectionDivider from "@/components/site/SectionDivider";
import SectionHeading from "@/components/site/SectionHeading";
import { aboutContent, methodContent } from "@/content/site";
import styles from "@/styles/site.module.css";

// Una fotografia per ciascuna fase (stesso ordine di aboutContent.steps)
const photos = [
  {
    src: "/images/bolletta-cucina.jpg",
    alt: "Una coppia in cucina legge con attenzione una bolletta",
    width: 1400,
    height: 788,
  },
  {
    src: "/images/analisi-grafico.jpg",
    alt: "Due professioniste analizzano un grafico dei consumi energetici su uno schermo",
    width: 1400,
    height: 710,
  },
  {
    src: "/images/affiancamento-tablet.jpg",
    alt: "Due professionisti consultano un tablet durante un incontro all'aperto",
    width: 1400,
    height: 931,
  },
];

export default function Method() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  // Server e primo render client usano lo stesso valore: evita differenze in idratazione
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="metodo"
      className={`${styles.section} ${styles.sectionAlt} ${styles.methodSection}`}
    >
      <SectionDivider tone="paper" />
      <div className="container">
        <SectionHeading
          title={methodContent.title}
          description={methodContent.description}
          align="center"
        />

        <div ref={listRef} className={styles.methodList}>
          <span className={styles.methodRail} aria-hidden="true">
            <motion.span
              className={styles.methodRailFill}
              style={{ scaleY: mounted && !reduce ? fill : 1 }}
            />
          </span>

          {aboutContent.steps.map((step, i) => {
            const photo = photos[i];
            const flip = i % 2 === 1;
            return (
              <article
                key={step.number}
                className={`${styles.methodStep} ${flip ? styles.methodStepFlip : ""}`}
              >
                <Reveal x={flip ? 44 : -44} y={0} className={styles.methodMedia}>
                  <figure className={styles.methodFigure}>
                    <Parallax through from={-22} to={22} className={styles.methodParallax}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className={styles.methodPhoto}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </Parallax>
                  </figure>
                </Reveal>

                <Reveal x={flip ? -44 : 44} y={0} delay={0.12} className={styles.methodCopy}>
                  <span className={styles.methodNumber}>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
