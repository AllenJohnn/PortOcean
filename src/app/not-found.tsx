import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative flex flex-col items-center max-w-lg p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#02131d]/80 backdrop-blur-xl shadow-2xl">
        {/* Sonar Ping Failure Beacon */}
        <div className="relative flex items-center justify-center size-16 mb-6">
          <span className="absolute size-3 rounded-full bg-[#5ff2e0] shadow-[0_0_15px_#5ff2e0]" />
          <span className="absolute size-10 rounded-full border border-[#5ff2e0]/40 animate-ping opacity-60" />
          <span className="absolute size-14 rounded-full border border-[#5ff2e0]/20 animate-pulse" />
        </div>

        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#5ff2e0] mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#5ff2e0] animate-pulse" />
          DEPTH: 11,034 M · SIGNAL LOST
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#e8fbff] mb-4">
          Off-Chart Depth
        </h1>

        <p className="text-sm sm:text-base text-[#e8fbff]/75 leading-relaxed font-light mb-8 max-w-md">
          Submersible telemetry lost acoustic contact. The coordinate you are
          attempting to scan does not exist or has drifted into the Mariana Trench.
        </p>

        <Button
          asChild
          className="h-11 px-6 font-mono text-xs tracking-wider border border-[#5ff2e0]/40 bg-[#021822]/80 backdrop-blur-md text-[#5ff2e0] hover:bg-[#5ff2e0]/20 hover:border-[#5ff2e0] shadow-[0_0_20px_rgba(95,242,224,0.2)] transition-all duration-300"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowUp className="size-4" />
            ASCEND TO SURFACE · 0 M
          </Link>
        </Button>
      </div>
    </main>
  );
}
