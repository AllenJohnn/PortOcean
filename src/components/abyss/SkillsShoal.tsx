"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { DATA } from "@/data/resume";
import { abyssStore } from "./store";

interface OrbConfig {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  duration: number;
  delay: number;
}

// Seeded positions and orbital dynamics for the 9 skill orbs
const ORB_CONFIGS: readonly OrbConfig[] = [
  { x: 14, y: 14, radiusX: 22, radiusY: -16, duration: 6.8, delay: 0.2 },
  { x: 50, y: 10, radiusX: -26, radiusY: 20, duration: 8.2, delay: 1.5 },
  { x: 84, y: 16, radiusX: 20, radiusY: 24, duration: 7.1, delay: 2.8 },
  { x: 20, y: 48, radiusX: -24, radiusY: -22, duration: 8.6, delay: 0.9 },
  { x: 50, y: 52, radiusX: 28, radiusY: 18, duration: 7.4, delay: 2.1 },
  { x: 80, y: 46, radiusX: -22, radiusY: 26, duration: 8.0, delay: 3.4 },
  { x: 16, y: 82, radiusX: 26, radiusY: -18, duration: 7.6, delay: 1.2 },
  { x: 48, y: 86, radiusX: -20, radiusY: 22, duration: 8.4, delay: 2.7 },
  { x: 82, y: 80, radiusX: 24, radiusY: -20, duration: 7.0, delay: 0.5 },
];

/**
 * Skills represented as a glowing shoal of drifting orbs in the Sunlight Zone (200–600 m).
 * Uses real SVGs from DATA.skills.
 * Orbs drift organically via GSAP tweens (different phases, durations, and radii per orb),
 * and brighten + gently drift away when the submersible lamp is near.
 */
export default function SkillsShoal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const driftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const repelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Repulsion state per orb for smooth lerping
  const repulsionState = useRef(
    DATA.skills.map(() => ({ x: 0, y: 0, flare: 1.0 }))
  );

  useEffect(() => {
    // 1. GSAP slow drifting tweens for each orb
    const ctx = gsap.context(() => {
      const isReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!isReduced) {
        driftRefs.current.forEach((el, i) => {
          if (!el) return;
          const cfg = ORB_CONFIGS[i % ORB_CONFIGS.length];
          gsap.to(el, {
            x: cfg.radiusX,
            y: cfg.radiusY,
            duration: cfg.duration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: cfg.delay,
          });
        });
      }
    }, containerRef);

    // 2. Lamp proximity reaction loop (brighten and gently drift away)
    let animId: number;

    const updateLampReaction = () => {
      const pointerX = abyssStore.lampX * window.innerWidth;
      const pointerY = (1.0 - abyssStore.lampY) * window.innerHeight;

      for (let i = 0; i < DATA.skills.length; i++) {
        const repelEl = repelRefs.current[i];
        if (!repelEl) continue;

        const rect = repelEl.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const dist = Math.hypot(cx - pointerX, cy - pointerY);

        let targetRepelX = 0;
        let targetRepelY = 0;
        let targetFlare = 1.0;

        // Lamp influence radius ~280px
        if (dist < 280) {
          const prox = 1.0 - dist / 280;
          const force = prox * 42; // Max repulsion distance in px
          const angle = Math.atan2(cy - pointerY, cx - pointerX);
          targetRepelX = Math.cos(angle) * force;
          targetRepelY = Math.sin(angle) * force;
          targetFlare = 1.0 + prox * 0.35; // Brighten & expand
        }

        // Smooth lerp towards target repulsion
        const state = repulsionState.current[i];
        state.x += (targetRepelX - state.x) * 0.12;
        state.y += (targetRepelY - state.y) * 0.12;
        state.flare += (targetFlare - state.flare) * 0.12;

        repelEl.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) scale(${state.flare.toFixed(3)})`;
        repelEl.style.filter = `brightness(${(1.0 + (state.flare - 1.0) * 1.5).toFixed(2)})`;
      }

      animId = requestAnimationFrame(updateLampReaction);
    };

    animId = requestAnimationFrame(updateLampReaction);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[580px] sm:min-h-[640px] max-w-5xl mx-auto my-8 select-none"
    >
      {DATA.skills.map((skill, i) => {
        const cfg = ORB_CONFIGS[i % ORB_CONFIGS.length];
        const brandColor =
          "brandColor" in skill && skill.brandColor
            ? skill.brandColor
            : "rgba(95, 242, 224, 0.3)";

        return (
          <div
            key={skill.name}
            style={{
              left: `${cfg.x}%`,
              top: `${cfg.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform cursor-default"
          >
            {/* GSAP drift container */}
            <div
              ref={(node) => {
                driftRefs.current[i] = node;
              }}
              className="will-change-transform"
            >
              {/* Lamp repulsion & flare container */}
              <div
                ref={(node) => {
                  repelRefs.current[i] = node;
                }}
                className="will-change-transform transition-shadow duration-300"
              >
                <div
                  style={{
                    boxShadow: `0 0 35px ${brandColor}, inset 0 0 15px ${brandColor}`,
                    borderColor: brandColor,
                  }}
                  className="group relative flex flex-col items-center justify-center size-20 sm:size-24 rounded-full border border-white/20 bg-[#02151e]/60 backdrop-blur-md p-3 transition-colors duration-300 hover:border-[#5ff2e0] hover:bg-[#021d2a]/80"
                >
                  <div className="relative size-8 sm:size-9">
                    <Image
                      src={skill.iconPath}
                      alt={`${skill.name} icon`}
                      fill
                      className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                      sizes="40px"
                    />
                  </div>
                  <span className="mt-1.5 font-mono text-[10px] sm:text-[11px] font-medium text-[#e8fbff] text-center tracking-tight px-1 whitespace-nowrap">
                    {skill.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
