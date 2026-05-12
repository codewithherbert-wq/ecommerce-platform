"use client";

import { useEffect } from "react";

export function ScrollAnimation() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger"),
      );
      if (!els.length) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );

      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (alreadyVisible) {
          // Already in viewport — reveal immediately, no need to observe
          el.classList.add("visible");
        } else {
          io.observe(el);
        }
      });

      return () => io.disconnect();
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
