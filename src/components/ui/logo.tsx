import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "full", size = "md", className, ...props }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  // Adjust aspect ratio based on variant
  // Full logo width needs to fit "ATTIHC" with A/C larger
  const widthClasses = variant === "full" 
    ? {
        sm: "w-20",       // 80px
        md: "w-28",       // 112px
        lg: "w-40",       // 160px
      }
    : {
        sm: "w-6",
        md: "w-8",
        lg: "w-12",
      };

  return (
    <div
      className={cn("flex items-center justify-center font-bold tracking-tight select-none text-primary", sizeClasses[size], widthClasses[size], className)}
      {...props}
    >
      {variant === "full" ? (
        <svg
          viewBox="0 0 84 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="ATTIHC Logo"
        >
          <text
            x="42"
            y="24"
            fontFamily="var(--font-sans)"
            fill="currentColor"
            textAnchor="middle"
            dominantBaseline="alphabetic"
            letterSpacing="-0.03em"
          >
            <tspan fontSize="27" fontWeight="800">A</tspan>
            <tspan fontSize="18" fontWeight="600" letterSpacing="-0.02em">TTIH</tspan>
            <tspan fontSize="27" fontWeight="800">C</tspan>
          </text>
        </svg>
      ) : (
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="ATTIHC Icon"
        >
          <text
            x="0"
            y="25"
            fontSize="22"
            fontWeight="800"
            fontFamily="var(--font-sans)"
            fill="currentColor"
          >
            A
          </text>
          <text
            x="32"
            y="25"
            fontSize="22"
            fontWeight="800"
            fontFamily="var(--font-sans)"
            fill="currentColor"
            textAnchor="end"
          >
            C
          </text>
        </svg>
      )}
    </div>
  );
}

export function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8 text-primary", className)}
      {...props}
    >
      <text
        x="0"
        y="25"
        fontSize="22"
        fontWeight="800"
        fontFamily="var(--font-sans)"
        fill="currentColor"
      >
        A
      </text>
      <text
        x="32"
        y="25"
        fontSize="22"
        fontWeight="800"
        fontFamily="var(--font-sans)"
        fill="currentColor"
        textAnchor="end"
      >
        C
      </text>
    </svg>
  );
}
