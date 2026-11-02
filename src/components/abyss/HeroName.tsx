"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface HeroNameProps {
  name: string;
}

/**
 * Hero name header with GSAP letter-by-letter reveal animation.
 * Respects prefers-reduced-motion and preserves accessibility with aria-label.
 */
export default function HeroName({ name }: HeroNameProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !headingRef.current) {
      return;
    }

    const chars = headingRef.current.querySelectorAll(".hero-letter");
    if (chars.length > 0) {
      gsap.from(chars, {
        yPercent: 70,
        opacity: 0,
        rotate: 4,
        stagger: 0.045,
        duration: 1.5,
        ease: "expo.out",
      });
    }
  }, []);

  const trimmed = name.trim();
  const letters = Array.from(trimmed);

  return (
    <h1
      ref={headingRef}
      aria-label={trimmed}
      className="font-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-[#e8fbff] leading-[1.05] drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)] overflow-hidden py-1"
    >
      {letters.map((char, index) => {
        if (char === " ") {
          return (
            <span key={index} className="inline-block w-[0.28em]">
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={index}
            className="hero-letter inline-block will-change-transform origin-bottom-left"
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
}
