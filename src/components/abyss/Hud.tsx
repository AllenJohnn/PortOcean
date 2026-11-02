"use client";

import { useEffect, useRef, useState } from "react";
import { abyssStore } from "./store";
import {
  DEPTH_ZONES,
  getZoneByProgress,
  progressToMeters,
  progressToTemperature,
  TOTAL_DEPTH_METERS,
} from "./zones";

const SPECIMEN_MARKERS = [
  { label: "S-01", depthM: 120, progress: 120 / TOTAL_DEPTH_METERS },
  { label: "S-02", depthM: 640, progress: 640 / TOTAL_DEPTH_METERS },
  { label: "S-03", depthM: 1900, progress: 1900 / TOTAL_DEPTH_METERS },
  { label: "S-04", depthM: 3100, progress: 3100 / TOTAL_DEPTH_METERS },
  { label: "BASE", depthM: 3800, progress: 1.0 },
] as const;

/**
 * Fixed Submersible HUD gauge and vertical depth ruler.
 * Driven via direct DOM mutations in RAF loop to eliminate React re-renders while scrolling.
 * Responsive design: Displays full telemetry on desktop bottom and clean top-strip on mobile
 * to prevent any collision with the Dock navbar.
 */
export default function Hud() {
  const depthTextRef = useRef<HTMLSpanElement>(null);
  const depthMobileRef = useRef<HTMLSpanElement>(null);
  const tempTextRef = useRef<HTMLSpanElement>(null);
  const tempMobileRef = useRef<HTMLSpanElement>(null);
  const pressureTextRef = useRef<HTMLSpanElement>(null);
  const pressureMobileRef = useRef<HTMLSpanElement>(null);
  const rulerPipRef = useRef<HTMLDivElement>(null);

  const [activeZoneName, setActiveZoneName] = useState("Surface / Sunlight");
  const lastZoneRef = useRef("Surface / Sunlight");

  useEffect(() => {
    let animId: number;
    let lastMeters = -1;

    const updateHud = () => {
      const p = abyssStore.depth;
      const meters = progressToMeters(p);

      if (meters !== lastMeters) {
        lastMeters = meters;

        const strMeters = `${meters.toLocaleString()} m`;
        if (depthTextRef.current) depthTextRef.current.textContent = strMeters;
        if (depthMobileRef.current) depthMobileRef.current.textContent = strMeters;

        const strTemp = `${progressToTemperature(p).toFixed(1)} °C`;
        if (tempTextRef.current) tempTextRef.current.textContent = strTemp;
        if (tempMobileRef.current) tempMobileRef.current.textContent = strTemp;

        const strPres = `${(1 + meters / 10).toFixed(0)} bar`;
        if (pressureTextRef.current) pressureTextRef.current.textContent = strPres;
        if (pressureMobileRef.current) pressureMobileRef.current.textContent = strPres;

        // Update vertical ruler pip position (0 to 100%)
        if (rulerPipRef.current) {
          rulerPipRef.current.style.top = `${(p * 100).toFixed(2)}%`;
        }

        // Zone crossfade detection
        const zone = getZoneByProgress(p);
        if (zone.name !== lastZoneRef.current) {
          lastZoneRef.current = zone.name;
          setActiveZoneName(zone.name);
        }
      }

      animId = requestAnimationFrame(updateHud);
    };

    animId = requestAnimationFrame(updateHud);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <aside
      aria-label="Submersible Depth HUD"
      className="fixed inset-0 pointer-events-none z-30 select-none font-mono text-[11px] sm:text-xs tracking-[0.2em] text-[#5ff2e0]"
    >
      {/* Top telemetry bar */}
      <header className="absolute top-0 left-0 right-0 px-4 sm:px-10 pt-3 sm:pt-6 flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 text-[#5ff2e0]/70 bg-gradient-to-b from-[#02080e]/90 via-[#02080e]/40 to-transparent pb-3 sm:pb-0">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-[#5ff2e0] animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em]">ABYSS // TELEMETRY</span>
          </div>
          {/* Mobile top-right zone badge */}
          <span className="sm:hidden text-[10px] font-semibold text-[#5ff2e0] uppercase tracking-wider pr-6">
            {activeZoneName.split("/")[0].trim()}
          </span>
        </div>

        {/* Mobile secondary telemetry row */}
        <div className="sm:hidden flex items-center justify-between text-[10px] text-[#5ff2e0]/80 pr-10 pt-0.5">
          <div>
            <span className="text-[#5ff2e0]/50 mr-1.5">DEPTH</span>
            <span ref={depthMobileRef} className="font-bold text-[#e8fbff] tabular-nums">0 m</span>
          </div>
          <div>
            <span className="text-[#5ff2e0]/50 mr-1.5">PRES</span>
            <span ref={pressureMobileRef} className="tabular-nums text-[#e8fbff]/90">1 bar</span>
          </div>
          <div>
            <span className="text-[#5ff2e0]/50 mr-1.5">TEMP</span>
            <span ref={tempMobileRef} className="tabular-nums text-[#5ff2e0]">24.0 °C</span>
          </div>
        </div>

        {/* Desktop top-right telemetry */}
        <div className="hidden sm:block text-[#5ff2e0]/50 text-xs tracking-[0.2em]">
          BEARING: 000° · PITCH: -90°
        </div>
      </header>

      {/* Right vertical depth ruler */}
      <nav
        aria-label="Depth ruler"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-48 sm:h-72 w-7 sm:w-10 flex flex-col items-end justify-between"
      >
        <div className="relative h-full w-full flex justify-end">
          {/* Central ruler line */}
          <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-[#5ff2e0]/20" />

          {/* Depth Zone tick markers */}
          {DEPTH_ZONES.map((zone) => (
            <div
              key={zone.id}
              style={{ top: `${(zone.progressStart * 100).toFixed(1)}%` }}
              className="absolute right-0 flex items-center gap-1.5 translate-y-[-50%]"
            >
              <span className="hidden md:inline text-[9px] text-[#5ff2e0]/40 tracking-wider">
                {zone.depthStartM}m
              </span>
              <div className="w-2.5 h-[1.5px] bg-[#5ff2e0]/40" />
            </div>
          ))}

          {/* Specimen point markers */}
          {SPECIMEN_MARKERS.map((spec) => (
            <div
              key={spec.label}
              style={{ top: `${(spec.progress * 100).toFixed(1)}%` }}
              className="absolute right-[-2px] size-1.5 rounded-full bg-[#5ff2e0]/60 ring-2 ring-[#5ff2e0]/20 translate-y-[-50%]"
              title={`${spec.label}: ${spec.depthM}m`}
            />
          ))}

          {/* Real-time Depth Indicator Pip */}
          <div
            ref={rulerPipRef}
            style={{ top: "0%" }}
            className="absolute right-[-4px] size-2.5 rounded-full bg-[#5ff2e0] shadow-[0_0_10px_#5ff2e0] translate-y-[-50%] transition-transform duration-75"
          />
        </div>
      </nav>

      {/* Bottom gauge bar - displayed on sm (tablets/desktops) to keep mobile bottom 100% free for dock */}
      <footer className="hidden sm:flex absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-3 sm:pb-6 justify-between items-end bg-gradient-to-t from-[#02080e]/90 via-[#02080e]/50 to-transparent pt-8">
        {/* Left Telemetry: Depth, Pressure, Water Temp */}
        <div className="flex flex-col gap-1 z-10">
          <div className="flex items-center gap-3">
            <span className="text-[#5ff2e0]/50 text-[10px]">DEPTH</span>
            <span
              ref={depthTextRef}
              className="font-bold text-sm sm:text-base text-[#e8fbff] tracking-widest tabular-nums"
            >
              0 m
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-[#5ff2e0]/70">
            <span>
              PRES: <span ref={pressureTextRef} className="tabular-nums text-[#e8fbff]/90">1 bar</span>
            </span>
            <span>
              TEMP: <span ref={tempTextRef} className="tabular-nums text-[#5ff2e0]">24.0 °C</span>
            </span>
          </div>
        </div>

        {/* Open center space for navbar dock */}
        <div className="flex-1 max-w-sm hidden md:block pointer-events-none" />

        {/* Right: Zone Name with crossfade transition */}
        <div className="flex flex-col items-end gap-1 z-10">
          <span className="text-[#5ff2e0]/50 text-[10px]">ZONE</span>
          <span
            key={activeZoneName}
            className="text-xs sm:text-sm font-semibold text-[#5ff2e0] animate-in fade-in duration-500 uppercase tracking-widest text-right drop-shadow-[0_0_8px_rgba(95,242,224,0.4)]"
          >
            {activeZoneName}
          </span>
        </div>
      </footer>
    </aside>
  );
}
