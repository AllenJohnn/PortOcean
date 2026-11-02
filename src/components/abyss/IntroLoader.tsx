"use client";

import { useEffect, useState } from "react";
import { DATA } from "@/data/resume";

/**
 * Atmospheric "Descending…" Submersible Intro Loader.
 * Preloads project textures and calibration telemetry before smoothly
 * revealing the hero surface.
 */
export default function IntroLoader() {
  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
    // Immediate bypass for reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setIsDone(true);
      setIsMounted(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = DATA.projects.length;

    const onImageLoaded = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / totalImages) * 100);
      setProgress((prev) => Math.max(prev, pct));
      if (loadedCount >= totalImages) {
        completeLoader();
      }
    };

    // Preload all 6 project textures
    DATA.projects.forEach((proj) => {
      if (!proj.image) {
        onImageLoaded();
        return;
      }
      const img = new Image();
      img.onload = onImageLoaded;
      img.onerror = onImageLoaded;
      img.src = proj.image;
    });

    // Simulated progress increment up to 90% while network fetches
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 85) return p + 15;
        return p;
      });
    }, 120);

    // Guaranteed finish within 1.6s
    const fallbackTimer = setTimeout(() => {
      completeLoader();
    }, 1600);

    function completeLoader() {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
      setProgress(100);

      setTimeout(() => {
        setIsDone(true);
        setTimeout(() => {
          setIsMounted(false);
        }, 800);
      }, 350);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      aria-hidden={isDone}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02080e] select-none transition-opacity duration-700 ease-out ${
        isDone ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Pulsing Sonar Ping Circle */}
        <div className="relative flex items-center justify-center size-16 mb-8">
          <span className="absolute size-3 rounded-full bg-[#5ff2e0] shadow-[0_0_15px_#5ff2e0]" />
          <span className="absolute size-10 rounded-full border border-[#5ff2e0]/60 animate-ping opacity-75" />
          <span className="absolute size-14 rounded-full border border-[#5ff2e0]/20 animate-pulse" />
        </div>

        {/* Console Text */}
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#5ff2e0] mb-2 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#5ff2e0] animate-pulse" />
          ABYSS // SUBMERSIBLE
        </div>

        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#e8fbff] mb-6">
          Descending to Surface...
        </h2>

        {/* Progress Bar */}
        <div className="w-56 h-1 rounded-full bg-white/10 overflow-hidden mb-3">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#208090] to-[#5ff2e0] transition-all duration-200 ease-out shadow-[0_0_8px_#5ff2e0]"
          />
        </div>

        {/* Telemetry Progress Readout */}
        <div className="font-mono text-[10px] text-[#5ff2e0]/60 tracking-widest tabular-nums">
          CALIBRATING SENSORS · {progress}%
        </div>
      </div>
    </div>
  );
}
