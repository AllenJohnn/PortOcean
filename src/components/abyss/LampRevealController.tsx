"use client";

import { useEffect } from "react";
import { abyssStore } from "./store";

/**
 * Controller running ONE requestAnimationFrame loop to update the --lamp-opacity
 * CSS variable on all .lamp-reveal elements across the page.
 * Avoids any React re-renders while scrolling or moving pointer.
 */
export default function LampRevealController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      return;
    }

    let animId: number;
    let elements: HTMLElement[] = [];
    let lastQueryTime = 0;

    const queryElements = () => {
      elements = Array.from(
        document.querySelectorAll<HTMLElement>(".lamp-reveal")
      );
    };

    queryElements();

    const updateLampReveal = (time: number) => {
      // Re-query periodically to pick up any dynamically rendered nodes
      if (time - lastQueryTime > 2000) {
        lastQueryTime = time;
        queryElements();
      }

      const depth = abyssStore.depth;
      const amb = Math.pow(1.0 - depth, 2.2);

      // Pointer coordinates in viewport pixels
      const pointerX = abyssStore.lampX * window.innerWidth;
      const pointerY = (1.0 - abyssStore.lampY) * window.innerHeight;
      const viewH = window.innerHeight;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const rect = el.getBoundingClientRect();

        // Skip off-screen elements
        if (rect.bottom < -100 || rect.top > viewH + 100) {
          continue;
        }

        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const dist = Math.hypot(cx - pointerX, cy - pointerY);

        // Lamp cone effective radius ~440px
        const lampProx = Math.max(0, 1.0 - dist / 440);

        // Ambient daylight dominates at surface; lamp proximity dominates in the deep
        // Guaranteed minimum 12% opacity so text is never totally invisible
        const opacity = Math.min(1.0, Math.max(0.12, amb * 1.35 + lampProx * 1.15));

        el.style.setProperty("--lamp-opacity", opacity.toFixed(3));
      }

      animId = requestAnimationFrame(updateLampReveal);
    };

    animId = requestAnimationFrame(updateLampReveal);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return null;
}
