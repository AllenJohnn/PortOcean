"use client";

import { useEffect, useRef } from "react";

/**
 * Custom Lamp Cursor Ring matching the submersible pointer on desktop devices.
 * Smoothly tracks the pointer with lerp animation and expands over interactive targets.
 * Disabled on touch/coarse pointers and prefers-reduced-motion.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || prefersReduced) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovering = false;
    let isVisible = false;
    let animId: number;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        currentX = mouseX;
        currentY = mouseY;
        if (ringRef.current) ringRef.current.style.opacity = "1";
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, [role='button'], input, textarea, .specimen-frame, .group"
        );
        isHovering = !!interactive;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    const renderLoop = () => {
      // Smooth lerp tracking
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${
          isHovering ? 1.55 : 1.0
        })`;
        ringRef.current.style.borderColor = isHovering
          ? "rgba(95, 242, 224, 0.9)"
          : "rgba(95, 242, 224, 0.45)";
        ringRef.current.style.boxShadow = isHovering
          ? "0 0 15px rgba(95, 242, 224, 0.5), inset 0 0 8px rgba(95, 242, 224, 0.2)"
          : "none";
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Outer Sonar Lamp Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 size-8 rounded-full border border-[#5ff2e0]/45 opacity-0 transition-opacity duration-300 will-change-transform"
      />
      {/* Center Target Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 size-1 rounded-full bg-[#5ff2e0] shadow-[0_0_6px_#5ff2e0] opacity-0 transition-opacity duration-300 will-change-transform"
      />
    </>
  );
}
