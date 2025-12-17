import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Space_Grotesk, Crimson_Pro, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { GlobalShortcuts } from "@/components/global-shortcuts";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import CommandPalette from "@/components/command-palette";
import Footer from "@/components/footer";
import HeaderNav from "@/components/header-nav";
import MobileNav from "@/components/mobile-nav";
import PageTransition from "@/components/page-transition";
import SWClient from "@/components/sw-client";
import TelemetryInit from "@/components/telemetry-init";
import { ToastProvider } from "@/components/ui/toast";
import { Logo } from "@/components/ui/logo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "ATTIHC - Focus, Organize, Achieve",
    template: "%s | ATTIHC",
  },
  description: "Advanced Task & Time Integrated Hub for Creators. Manage your tasks, track your time, and stay focused with ATTIHC.",
  keywords: ["productivity", "task manager", "focus timer", "pomodoro", "eisenhower matrix", "time tracking", "pwa", "developer tools"],
  authors: [{ name: "Kalyan" }],
  creator: "Kalyan",
  publisher: "ATTIHC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ATTIHC - Advanced Task & Time Integrated Hub for Creators",
    description: "Manage your tasks, track your time, and stay focused with ATTIHC. The all-in-one productivity dashboard for creators.",
    url: "https://attihc.vercel.app",
    siteName: "ATTIHC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATTIHC - Focus, Organize, Achieve",
    description: "The all-in-one productivity dashboard for creators. Features Priority Matrix, Focus Timer, and more.",
    creator: "@Me-Kalyan",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ATTIHC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/maskable-192.svg" />
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var raw=localStorage.getItem('attihc:settings');var s=raw?JSON.parse(raw):null;var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var isDark=s&&s.theme? (s.theme==='dark'||(s.theme==='system'&&prefersDark)) : prefersDark;if(isDark){document.documentElement.classList.add('dark');}}catch(e){}`}
        </Script>
      </head>
        <body
          className={`${spaceGrotesk.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground`}
        >
        <ToastProvider>
          <GlobalShortcuts />
          <TutorialOverlay />

          <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-8">
                  <Link
                    href="/today"
                    prefetch={false}
                    aria-label="ATTIHC Home"
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                    <Logo size="md" />
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <HeaderNav />
                    <SWClient />
                  </div>
                </div>
              </header>

            <TelemetryInit />
            <CommandPalette />

                <main
                  id="main"
                  className="container mx-auto flex-1 max-w-7xl px-3 pt-6 pb-24 sm:px-8 sm:pt-8 md:pb-0"
                >
                  <PageTransition>{children}</PageTransition>
                </main>

                <div className="container mx-auto max-w-7xl px-3 sm:px-8 mb-20 md:mb-0">
                  <Footer />
                </div>
                
                <MobileNav />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
