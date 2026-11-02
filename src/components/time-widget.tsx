"use client";

import { useEffect, useState } from "react";
import { CompassIcon, MonitorPlayIcon } from "lucide-react";

export default function TimeWidget() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const updateTimeAndStatus = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.formatToParts(new Date());
      const hourPart = parts.find((p) => p.type === "hour");
      const minPart = parts.find((p) => p.type === "minute");
      const secPart = parts.find((p) => p.type === "second");

      const hh = hourPart ? parseInt(hourPart.value, 10) : 0;
      const mm = minPart ? minPart.value : "00";
      const ss = secPart ? secPart.value : "00";

      setTime(`${hh.toString().padStart(2, "0")}:${mm}:${ss}`);

      if (hh >= 9 && hh < 16) {
        setStatus("Class at FISAT 🏫");
      } else if (hh >= 16 && hh < 23) {
        setStatus("Coding / Building PCs 💻");
      } else {
        setStatus("Resting / Offline 😴");
      }
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">My Status</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div>
        <div className="text-4xl font-bold font-mono tracking-tight tabular-nums text-foreground/90">
          {time || "00:00:00"}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">Kochi, Kerala, India (IST)</div>
      </div>
      <div className="border-t border-border/60 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <MonitorPlayIcon className="size-3.5 text-primary shrink-0 dark:text-zinc-300" />
          <span>{status || "Loading..."}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CompassIcon className="size-3.5 shrink-0" />
          <span>9.93° N, 76.26° E</span>
        </div>
      </div>
    </div>
  );
}
