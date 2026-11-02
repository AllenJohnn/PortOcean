"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { abyssStore } from "./abyss/store";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Track pointer coords for the abyss lamp
    const handlePointerMove = (e: PointerEvent) => {
      abyssStore.lampTargetX = e.clientX / window.innerWidth;
      abyssStore.lampTargetY = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let lastLogTime = 0;

    if (!reducedMotion) {
      // Lenis driven by gsap.ticker with autoRaf disabled
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      // Synchronize scroll events with ScrollTrigger
      lenis.on("scroll", (e) => {
        ScrollTrigger.update();
        abyssStore.velocity = e.velocity;
      });

      // Drive Lenis from GSAP ticker
      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // ScrollTrigger to calculate overall page dive progress 0..1
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        abyssStore.targetDepth = self.progress;

        // Throttled logging to satisfy Phase 1 requirement:
        // "the store logs correct depth 0 to 1"
        const now = performance.now();
        if (now - lastLogTime > 400) {
          lastLogTime = now;
          console.log(
            `[ABYSS] depth: ${self.progress.toFixed(3)} | velocity: ${abyssStore.velocity.toFixed(2)}`
          );
        }
      },
    });

    // Smooth RAF loop for continuous interpolation without React re-renders
    let animId: number;
    const smoothLoop = () => {
      abyssStore.depth += (abyssStore.targetDepth - abyssStore.depth) * 0.08;
      abyssStore.lampX += (abyssStore.lampTargetX - abyssStore.lampX) * 0.12;
      abyssStore.lampY += (abyssStore.lampTargetY - abyssStore.lampY) * 0.12;
      animId = requestAnimationFrame(smoothLoop);
    };
    animId = requestAnimationFrame(smoothLoop);

    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
      trigger.kill();
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
      }
      if (lenis) {
        lenis.destroy();
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router]);

  return <>{children}</>;
}