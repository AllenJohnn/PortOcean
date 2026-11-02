"use client";

import { useEffect, useState } from "react";
import { DATA } from "@/data/resume";
import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { abyssStore } from "./store";
import { DEPTH_ZONES, getZoneByProgress } from "./zones";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SOUNDER_MARKERS = [
  { id: "hero", label: "Surface", depth: "0 m", progress: 0.0 },
  { id: "about", label: "Log", depth: "200 m", progress: 200 / 3800 },
  { id: "skills", label: "Skills", depth: "450 m", progress: 450 / 3800 },
  { id: "education", label: "Sonar", depth: "900 m", progress: 900 / 3800 },
  { id: "projects", label: "Specimens", depth: "1,600 m", progress: 1600 / 3800 },
  { id: "contact", label: "Seabed", depth: "3,800 m", progress: 1.0 },
] as const;

/**
 * Fixed Submersible Depth Sounder navigation console.
 * Replaces generic dock navbar with an authentic acoustic submarine console
 * that tracks dive progress and smooth-scrolls between depth zones.
 */
export default function DepthSounder() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    let animId: number;
    let lastActive = "hero";

    const updateActiveMarker = () => {
      const p = abyssStore.depth;
      const zone = getZoneByProgress(p);

      let currentId = "hero";
      if (p < 0.04) currentId = "hero";
      else if (p < 0.09) currentId = "about";
      else if (p < 0.22) currentId = "skills";
      else if (p < 0.38) currentId = "education";
      else if (p < 0.94) currentId = "projects";
      else currentId = "contact";

      if (currentId !== lastActive) {
        lastActive = currentId;
        setActiveId(currentId);
      }

      animId = requestAnimationFrame(updateActiveMarker);
    };

    animId = requestAnimationFrame(updateActiveMarker);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;

    const lenis = (
      window as unknown as {
        __lenis?: {
          scrollTo: (
            target: HTMLElement,
            options?: { offset?: number; duration?: number }
          ) => void;
        };
      }
    ).__lenis;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(el, { offset: -10, duration: 1.3 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Submersible Depth Sounder"
      className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#5ff2e0]/30 bg-[#02131d]/85 backdrop-blur-xl shadow-[0_0_25px_rgba(2,24,34,0.8)]">
        {/* Acoustic Sounder Pulse Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 mr-1 border-r border-[#5ff2e0]/20 font-mono text-[10px] text-[#5ff2e0]/70 tracking-widest select-none">
          <span className="size-1.5 rounded-full bg-[#5ff2e0] animate-ping" />
          <span>SOUNDER</span>
        </div>

        {/* Depth Zone Pips */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {SOUNDER_MARKERS.map((marker) => {
            const isActive = activeId === marker.id;

            return (
              <Tooltip key={marker.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => handleNavigate(e, marker.id)}
                    aria-label={`Dive to ${marker.label} (${marker.depth})`}
                    className={cn(
                      "relative min-h-[38px] min-w-[38px] sm:min-h-[34px] sm:min-w-[34px] flex items-center justify-center rounded-full text-xs font-mono transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ff2e0]",
                      isActive
                        ? "bg-[#5ff2e0]/20 text-[#5ff2e0] border border-[#5ff2e0] shadow-[0_0_12px_rgba(95,242,224,0.4)]"
                        : "text-[#e8fbff]/60 hover:text-[#5ff2e0] hover:bg-[#5ff2e0]/10 border border-transparent"
                    )}
                  >
                    {/* Active Pip Ping */}
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#5ff2e0] animate-pulse" />
                    )}
                    <span className="text-[10px] sm:text-[11px] font-semibold">
                      {marker.depth.split(" ")[0]}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="rounded-lg bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3 py-1 font-mono text-xs shadow-xl"
                >
                  <p>
                    {marker.label} · {marker.depth}
                  </p>
                  <TooltipArrow className="fill-[#021822]" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Console Divider */}
        <div className="h-5 w-px bg-[#5ff2e0]/25 mx-1" />

        {/* Telemetry Actions (GitHub, LinkedIn, Theme) */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={DATA.contact.social.GitHub.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="size-8 sm:size-8.5 rounded-full flex items-center justify-center text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 transition-all border border-[#5ff2e0]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ff2e0]"
              >
                <Icons.github className="size-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              className="rounded-lg bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3 py-1 font-mono text-xs"
            >
              <p>GitHub</p>
              <TooltipArrow className="fill-[#021822]" />
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={DATA.contact.social.LinkedIn.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="size-8 sm:size-8.5 rounded-full flex items-center justify-center text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 transition-all border border-[#5ff2e0]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ff2e0]"
              >
                <Icons.linkedin className="size-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              className="rounded-lg bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3 py-1 font-mono text-xs"
            >
              <p>LinkedIn</p>
              <TooltipArrow className="fill-[#021822]" />
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="size-8 sm:size-8.5 rounded-full flex items-center justify-center text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 transition-all border border-[#5ff2e0]/20">
                <ModeToggle className="size-full text-[#5ff2e0] cursor-pointer" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={8}
              className="rounded-lg bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3 py-1 font-mono text-xs"
            >
              <p>Theme</p>
              <TooltipArrow className="fill-[#021822]" />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}
