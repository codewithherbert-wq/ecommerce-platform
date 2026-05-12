"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

const translateMap: Record<string, string> = {
  up: "translateY(28px)",
  down: "translateY(-28px)",
  left: "translateX(28px)",
  right: "translateX(-28px)",
  none: "none",
};

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Start invisible — will reveal after mount + intersection
  const [visible, setVisible] = useState(false);
  // Prevents any state update before the component is fully mounted
  const isMounted = useRef(false);

  useEffect(() => {
    // Mark as mounted — safe to call setState now
    isMounted.current = true;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback: no observer support, just show immediately
      setVisible(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          observer.disconnect();
          if (delay > 0) {
            timer = setTimeout(() => {
              if (isMounted.current) setVisible(true);
            }, delay);
          } else {
            if (isMounted.current) setVisible(true);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);

    return () => {
      isMounted.current = false;
      observer.disconnect();
      if (timer !== null) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — delay/direction are stable after mount

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : (translateMap[direction] ?? "none"),
        transition: visible
          ? `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
          : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
