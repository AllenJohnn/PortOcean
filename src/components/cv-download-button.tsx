"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

import { cn } from "@/lib/utils";

interface CvDownloadButtonProps {
  resumeUrl: string;
  className?: string;
}

export default function CvDownloadButton({ resumeUrl, className }: CvDownloadButtonProps) {
  const handleDownload = () => {
    try {
      sendGAEvent("event", "file_download", {
        file_name: "Allen-John-Joy-CV.pdf",
        file_extension: "pdf",
        link_url: resumeUrl,
      });
    } catch {
      // analytics fallback
    }
  };

  return (
    <Button
      asChild
      className={cn(
        "h-11 sm:h-10 px-5 font-medium min-w-[44px] gap-2 border border-[#5ff2e0]/40 bg-[#021822]/60 backdrop-blur-md text-[#5ff2e0] hover:bg-[#5ff2e0]/20 hover:border-[#5ff2e0] shadow-[0_0_15px_rgba(95,242,224,0.15)] transition-all duration-200",
        className
      )}
      onClick={handleDownload}
    >
      <a
        href={resumeUrl}
        download
        aria-label="Download Allen John CV"
        className="inline-flex items-center gap-2"
      >
        <DownloadIcon className="size-4" />
        <span className="hidden sm:inline">Download CV</span>
        <span className="sm:hidden">CV</span>
      </a>
    </Button>
  );
}
