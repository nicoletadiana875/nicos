"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/site.module.css";

export default function SlideCarousel({ children, label = "Carosello contenuti" }) {
  const trackRef = useRef(null);
  const total = Children.count(children);
  const [index, setIndex] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  const stepWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const slide = track.firstElementChild;
    if (!slide) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.getBoundingClientRect().width + gap;
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setScrollable(track.scrollWidth - track.clientWidth > 4);
    const step = stepWidth();
    if (step > 0) {
      setIndex(Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / step))));
    }
  }, [stepWidth, total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();
    return () => observer.disconnect();
  }, [measure]);

  const goTo = (next) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(total - 1, next));
    track.scrollTo({ left: clamped * stepWidth(), behavior: "smooth" });
    setIndex(clamped);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <div className={styles.carousel}>
      <div
        ref={trackRef}
        className={styles.carouselTrack}
        onScroll={measure}
        onKeyDown={onKeyDown}
        role="group"
        aria-label={label}
        tabIndex={0}
      >
        {Children.map(children, (child, i) => (
          <div className={styles.carouselSlide} key={i}>
            {child}
          </div>
        ))}
      </div>

      {scrollable && (
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.carouselArrow}
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Slide precedente"
          >
            &#8249;
          </button>

          <div className={styles.carouselDots}>
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.carouselArrow}
            onClick={() => goTo(index + 1)}
            disabled={index >= total - 1}
            aria-label="Slide successiva"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
