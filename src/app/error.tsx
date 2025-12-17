'use client';

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error using our structured logger
    logger.error("Global Error Boundary caught an error", {
      message: error.message,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="grid place-items-center min-h-[60vh] px-4">
      <Card className="p-8 shadow-lg border-2 border-destructive/20 max-w-md w-full space-y-6 text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
          <AlertTriangle size={24} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We apologize for the inconvenience. An unexpected error occurred.
          </p>
          <div className="bg-muted/50 p-3 rounded text-xs font-mono text-muted-foreground break-all">
            {error.message}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="gap-2"
          >
            <RefreshCw size={14} /> Try again
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/today" className="gap-2">
              <Home size={14} /> Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
