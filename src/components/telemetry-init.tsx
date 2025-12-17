'use client';
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logger } from "@/lib/logger";

function telemetryEnabled(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem("attihc:telemetry") === "1";
  } catch {
    return false;
  }
}

export default function TelemetryInit() {
  const pathname = usePathname();
  useEffect(() => {
    if (!telemetryEnabled()) return;
    try {
      logger.info("[telemetry] pageview", { path: pathname });
    } catch {}
  }, [pathname]);

  useEffect(() => {
    if (!telemetryEnabled()) return;
    const handler = (event: ErrorEvent) => {
      try {
        logger.error("[telemetry] error", { 
          message: event.message, 
          source: event.filename, 
          line: event.lineno 
        });
      } catch {}
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return null;
}
