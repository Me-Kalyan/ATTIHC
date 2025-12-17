'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Calendar, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAttihc } from "@/hooks/use-attihc";

export default function MobileNav() {
  const pathname = usePathname();
  const { settings } = useAttihc();

  const navItems = [
    {
      name: "Today",
      href: "/today",
      icon: Sun,
      match: (path: string) => !path.startsWith("/history") && !path.startsWith("/insights") && !path.startsWith("/settings")
    },
    {
      name: "History",
      href: "/history",
      icon: Calendar,
      match: (path: string) => path.startsWith("/history")
    },
    {
      name: "Insights",
      href: "/insights",
      icon: Activity,
      match: (path: string) => path.startsWith("/insights")
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      match: (path: string) => path.startsWith("/settings")
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform touch-manipulation",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-colors duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
