"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";

export default function Navbar() {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href === "/") {
      e.preventDefault();
      const targetId = href === "/" ? "hero" : href.replace("/#", "");
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number; duration?: number }) => void } }).__lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(targetEl, { offset: -20, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30">
      <Dock className="z-50 pointer-events-auto relative h-13 sm:h-14 p-1.5 sm:p-2 w-fit mx-auto flex gap-1 sm:gap-2 border border-[#5ff2e0]/30 bg-[#021822]/80 backdrop-blur-xl shadow-[0_0_25px_rgba(2,24,34,0.7)] rounded-full">
        {DATA.navbar.map((item) => {
          const isExternal = item.href.startsWith("http");
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className="min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center"
                >
                  <DockIcon className="rounded-3xl cursor-pointer size-full bg-[#03202e]/60 p-0 text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 backdrop-blur-xl border border-[#5ff2e0]/20 transition-all">
                    <item.icon className="size-full rounded-sm overflow-hidden object-contain" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="rounded-xl bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3.5 py-1.5 text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <p>{item.label}</p>
                <TooltipArrow className="fill-[#021822]" />
              </TooltipContent>
            </Tooltip>
          );
        })}
        <Separator
          orientation="vertical"
          className="h-2/3 m-auto w-px bg-[#5ff2e0]/25"
        />
        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social], index) => {
            const isExternal = social.url.startsWith("http");
            const IconComponent = social.icon;
            return (
              <Tooltip key={`social-${name}-${index}`}>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    onClick={(e) => handleAnchorClick(e, social.url)}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={name}
                    className="min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto flex items-center justify-center"
                  >
                    <DockIcon className="rounded-3xl cursor-pointer size-full bg-[#03202e]/60 p-0 text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 backdrop-blur-xl border border-[#5ff2e0]/20 transition-all">
                      <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                    </DockIcon>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="rounded-xl bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3.5 py-1.5 text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  <p>{name}</p>
                  <TooltipArrow className="fill-[#021822]" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        <Separator
          orientation="vertical"
          className="h-2/3 m-auto w-px bg-[#5ff2e0]/25"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className="rounded-3xl cursor-pointer size-full bg-[#03202e]/60 p-0 text-[#5ff2e0]/80 hover:text-[#e8fbff] hover:bg-[#5ff2e0]/20 backdrop-blur-xl border border-[#5ff2e0]/20 transition-all">
              <ModeToggle className="size-full cursor-pointer text-[#5ff2e0]" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className="rounded-xl bg-[#021822] text-[#5ff2e0] border border-[#5ff2e0]/30 px-3.5 py-1.5 text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <p>Theme</p>
            <TooltipArrow className="fill-[#021822]" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </div>
  );
}
