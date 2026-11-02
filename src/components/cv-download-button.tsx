"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

interface CvDownloadButtonProps {
  resumeUrl: string;
}

export default function CvDownloadButton({ resumeUrl }: CvDownloadButtonProps) {
  const handleDownload = () => {
    try {
      sendGAEvent("event", "file_download", {
        file_name: "Allen-John-Joy-CV.pdf",
        file_extension: "pdf",
        link_url: resumeUrl,
      });
    } catch (e) {
      // analytics fallback
    }
  };

  return (
    <Button
      asChild
      className="h-11 sm:h-10 px-5 font-medium shadow-sm min-w-[44px] gap-2"
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
