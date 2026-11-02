"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const router = useRouter();

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotionQuery.matches) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const lenis = new Lenis({
      autoRaf: true,
      duration: isMobile ? 1.0 : 1.2,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    window.scrollTo(0, 0);

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router]);

  return <>{children}</>;
}