"use client";

import styles from "@/styles/site.module.css";

/**
 * Pulsante unico del sito.
 * variant: "primary" (bordeaux, default) | "secondary" (chiaro con bordo)
 * compact: altezza ridotta per header e pulsante flottante
 */
export default function LiquidButton({
  children,
  href,
  className,
  variant = "primary",
  compact = false,
  ...props
}) {
  const Tag = href ? "a" : "button";
  const classes = [
    styles.liquidBtn,
    variant === "secondary" ? styles.liquidBtnSecondary : "",
    compact ? styles.liquidBtnCompact : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag href={href} className={classes} {...props}>
      <span className={styles.liquidBtnContent}>{children}</span>
    </Tag>
  );
}
