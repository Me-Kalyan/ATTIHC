'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="mt-12 mb-6 pt-8 border-t border-border" role="contentinfo">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        
        {/* Branding Section */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 group w-fit" aria-label="ATTIHC Home">
            <Logo size="md" />
          </Link>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Things I Must Remember Today. A simple tool to manage your daily tasks effectively.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2" aria-label="Footer Navigation">
          <h3 className="font-medium text-sm text-foreground mb-1">Company</h3>
          <ul className="flex flex-col gap-2">
            {footerLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm outline-none",
                      isActive && "text-foreground font-medium"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>
          &copy; {currentYear} ATTIHC. All rights reserved.
        </p>
        <p className="flex items-center gap-1">
          Made with <span className="text-red-500" aria-label="love">♥</span> for productivity.
        </p>
      </div>
    </footer>
  );
}
