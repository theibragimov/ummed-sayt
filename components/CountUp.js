"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({
  to = 100,
  duration = 1800,
  suffix = "",
  className = "",
  style,
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    // Agar element allaqachon viewport da bo'lsa
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      run();
      observer.disconnect();
    }

    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {value}{suffix}
    </span>
  );
}
