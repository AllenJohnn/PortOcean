"use client";

import dynamic from "next/dynamic";

const CanvasView = dynamic(() => import("./CanvasView"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full bg-[#020d12]"
      aria-hidden="true"
    />
  ),
});

/**
 * Fixed full-screen Three.js Canvas container for ABYSS.
 * Loaded dynamically with ssr: false to prevent hydration mismatches.
 */
export default function Scene() {
  return <CanvasView />;
}
