"use client";

import { memo, useEffect, useRef, type ReactNode } from "react";

type RevealVariant =
  | "fade-up"     // default — translateY(24) + opacity
  | "fade-left"   // translateX(-24) + opacity
  | "clip-up"     // clip-path inset reveal from bottom
  | "clip-left"   // clip-path inset reveal from right
  | "fade-only";  // opacity only, no movement

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** delay in ms */
  delay?: number;
  /** animation variant — default "fade-up" */
  variant?: RevealVariant;
}

const variantStyles: Record<
  RevealVariant,
  { initial: Record<string, string>; final: Record<string, string>; transition: string }
> = {
  "fade-up": {
    initial: { opacity: "0", transform: "translateY(24px)" },
    final:   { opacity: "1", transform: "translateY(0)" },
    transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
  },
  "fade-left": {
    initial: { opacity: "0", transform: "translateX(-24px)" },
    final:   { opacity: "1", transform: "translateX(0)" },
    transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
  },
  "clip-up": {
    initial: { clipPath: "inset(100% 0 0 0)", opacity: "1" },
    final:   { clipPath: "inset(0% 0 0 0)", opacity: "1" },
    transition: "clip-path 900ms cubic-bezier(0.76,0,0.24,1)",
  },
  "clip-left": {
    initial: { clipPath: "inset(0 100% 0 0)", opacity: "1" },
    final:   { clipPath: "inset(0 0% 0 0)", opacity: "1" },
    transition: "clip-path 900ms cubic-bezier(0.76,0,0.24,1)",
  },
  "fade-only": {
    initial: { opacity: "0" },
    final:   { opacity: "1" },
    transition: "opacity 800ms cubic-bezier(0.16,1,0.3,1)",
  },
};

function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      const v = variantStyles[variant];
      Object.assign(el.style, v.final);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const v = variantStyles[variant];
          setTimeout(() => {
            Object.assign(el.style, v.final);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, variant]);

  const v = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...v.initial,
        transition: `${v.transition}`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default memo(ScrollReveal);
