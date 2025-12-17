'use client';
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { logger } from "@/lib/logger";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt(): void;
};

export default function SWClient() {
  const [online, setOnline] = useState(true);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js")
          .then((registration) => {
            logger.info("Service Worker registered", { scope: registration.scope });
          })
          .catch((error) => {
            logger.error("Service Worker registration failed", error);
          });
      } else {
        // In development, unregister any existing service workers to prevent caching issues
        // Wrap in try-catch to handle InvalidStateError during hot reloads
        try {
          navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
              for (const registration of registrations) {
                registration.unregister().catch((err) => {
                  logger.warn("Failed to unregister SW", err);
                });
              }
            })
            .catch((error) => {
              // Ignore InvalidStateError which can happen during rapid reloads
              if (error?.name !== 'InvalidStateError') {
                logger.warn("Failed to get SW registrations", error);
              }
            });
        } catch (error) {
           // Synchronous errors
           console.debug("SW cleanup skipped:", error);
        }
      }
    }
    if (typeof window !== "undefined") {
      setOnline(window.navigator.onLine);
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);
      const handleBeforeInstall = (e: Event) => {
        const evt = e as BeforeInstallPromptEvent;
        e.preventDefault();
        setInstallEvent(evt);
        setShowInstall(true);
      };
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const canInstall = !!installEvent;

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group flex items-center gap-2 rounded-full bg-accent text-accent-foreground text-xs px-2 sm:px-3 py-1.5 shadow-sm hover:shadow-md hover:ring-1 hover:ring-ring transition-all cursor-default">
            <div className={`size-2 rounded-full ${online ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
            <span className="hidden sm:inline font-medium">{online ? "Offline-ready" : "Offline"}</span>
            {canInstall && showInstall && (
              <button
                type="button"
                className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 touch-manipulation flex items-center gap-1.5 ml-1"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent tooltip trigger if nested
                  if (installEvent && typeof installEvent.prompt === "function") {
                    installEvent.prompt();
                  }
                  setShowInstall(false);
                }}
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Install</span>
              </button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>Install app</TooltipContent>
      </Tooltip>
    </div>
  );
}
