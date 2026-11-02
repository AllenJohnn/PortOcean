"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

import Ocean from "./Ocean";
import Specimens from "./Specimens";
import Creatures from "./Creatures";

/**
 * R3F Canvas view for ABYSS background scene.
 * Houses Ocean shader quad; handles DPR capping and visibility pausing.
 */
export default function CanvasView() {
  const [dpr, setDpr] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      return Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    }
    return 1.5;
  });
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setDpr(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
    };

    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        frameloop={isTabVisible ? "always" : "never"}
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        camera={{ position: [0, 0, 1] }}
        onCreated={({ gl, scene }) => {
          const darkTeal = new THREE.Color("#020d12");
          gl.setClearColor(darkTeal, 1);
          scene.background = darkTeal;
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />
        <Ocean />
        <Specimens />
        <Creatures />
      </Canvas>
    </div>
  );
}
