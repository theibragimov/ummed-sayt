"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll bilan ko'rinadigan animatsiya wrapper.
 * variant: "up" | "in" | "left" | "right" | "scale"
 * delay: millisekundlarda (animatsiya kechikish)
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  once = true,
  className = "",
  style: userStyle,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? `in-view r-${variant}` : ""} ${className}`}
      style={{ ...(userStyle || {}), ...(delay ? { animationDelay: `${delay}ms` } : {}) }}
    >
      {children}
    </Tag>
  );
}
