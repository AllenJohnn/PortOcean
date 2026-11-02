"use client";

/**
 * Fixed submersible acrylic viewport framing and corner indicators.
 * Provides subtle cockpit framing at the viewport edges without obscuring text.
 */
export default function SubmersibleBezel() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 select-none overflow-hidden"
    >
      {/* Acrylic viewport edge shadow / subtle vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(1,8,13,0.7)]" />

      {/* Submersible corner viewport brackets */}
      <div className="absolute top-3 left-3 size-6 border-t-2 border-l-2 border-[#5ff2e0]/20 rounded-tl-lg" />
      <div className="absolute top-3 right-3 size-6 border-t-2 border-r-2 border-[#5ff2e0]/20 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-[#5ff2e0]/20 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-[#5ff2e0]/20 rounded-br-lg" />
    </div>
  );
}
