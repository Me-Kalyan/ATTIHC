'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DayEntry } from "@/types";
import { Calendar, Settings as SettingsIcon, Sun, Moon, Activity, Search, X, Clock, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState, useRef } from "react";
import { useAttihc } from "@/hooks/use-attihc";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ActionSearchBar from "@/components/features/ActionSearchBar";

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { settings, resolvedTheme, toggleTheme, days } = useAttihc();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const handleFocusSearch = () => {
      setSearchOpen(true);
    };

    window.addEventListener('attihc:focus-search', handleFocusSearch);
    
    // Add Cmd+K / Ctrl+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('attihc:focus-search', handleFocusSearch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isDark = resolvedTheme === "dark";
  const motionClass = settings.quiet ? "" : "transition-all duration-200 ease-out";
  const tapClass = settings.quiet ? "" : "active:scale-[0.98]";
  
  const activeKey = useMemo<"today" | "history" | "insights" | "settings">(() => {
    if (pathname.startsWith("/history")) return "history";
    if (pathname.startsWith("/insights")) return "insights";
    if (pathname.startsWith("/settings")) return "settings";
    return "today";
  }, [pathname]);

  return (
    <>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-2xl">
           <DialogTitle className="sr-only">Search</DialogTitle>
           <ActionSearchBar onClose={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-2">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className={`rounded-full px-3 ${motionClass} ${tapClass} ${activeKey === "today" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Link href="/" prefetch={false} className="flex items-center gap-1.5">
                  <Sun size={14} /> Today
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Today</TooltipContent>
          </Tooltip>
          
          <div className="h-4 w-px bg-border/60" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className={`rounded-full px-3 ${motionClass} ${tapClass} ${activeKey === "history" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Link href="/history" prefetch={false} className="flex items-center gap-1.5">
                  <Calendar size={14} /> History
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>
          
          <div className="h-4 w-px bg-border/60" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className={`rounded-full px-3 ${motionClass} ${tapClass} ${activeKey === "insights" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Link href="/insights" prefetch={false} className="flex items-center gap-1.5">
                  <Activity size={14} /> Insights
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insights</TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border/60" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className={`rounded-full px-3 ${motionClass} ${tapClass} ${activeKey === "settings" ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
              >
                <Link href="/settings" prefetch={false} className="flex items-center gap-1.5">
                  <SettingsIcon size={14} /> Settings
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          
          <div className="h-4 w-px bg-border/60" />
        </div>

        {/* Search & Theme Actions (Visible on all screens) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full size-10 sm:size-9 text-muted-foreground hover:text-foreground ${tapClass}`}
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} className="sm:size-[18px]" />
              <span className="sr-only">Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search (Cmd+K)</TooltipContent>
        </Tooltip>

        <div className="hidden sm:block h-4 w-px bg-border/60" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full size-10 sm:size-9 text-muted-foreground hover:text-foreground ${tapClass}`}
              onClick={toggleTheme}
            >
              {mounted ? (
                isDark ? <Sun size={20} className="sm:size-[18px]" /> : <Moon size={20} className="sm:size-[18px]" />
              ) : (
                <span className="size-4 bg-muted rounded-full" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
