"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import styles from "@/styles/site.module.css";

/** Sottile barra di avanzamento della lettura, fissa in alto. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  useEffect(() => setMounted(true), []);

  if (!mounted || reduce) return null;

  return <motion.div className={styles.progress} style={{ scaleX }} aria-hidden="true" />;
}
