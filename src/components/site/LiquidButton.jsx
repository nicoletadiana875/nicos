"use client";

import styles from "@/styles/site.module.css";

export default function LiquidButton({ children, href, className, ...props }) {
  const Tag = href ? "a" : "button";

  return (
    <Tag href={href} className={`${styles.liquidBtn} ${className ?? ""}`} {...props}>
      <span
        className={styles.liquidBtnGlass}
        style={{ backdropFilter: 'blur(10px) url("#liquid-glass-filter")' }}
      />
      <span className={styles.liquidBtnGlow} />
      <span className={styles.liquidBtnContent}>{children}</span>
    </Tag>
  );
}
