'use client';
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function TodayCard({
  label,
  value,
  onChange,
  inputRef,
  onEnter,
  showHint,
  "data-tutorial-id": dataTutorialId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onEnter?: () => void;
  showHint?: boolean;
  "data-tutorial-id"?: string;
}) {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = inputRef ?? localRef;
  const maxLength = 140;
  const len = value.length;
  const isLimit = len >= maxLength;
  
    return (
      <Card 
        data-tutorial-id={dataTutorialId}
        className="p-4 sm:p-6 shadow-lg border-0 transition-all focus-within:ring-4 focus-within:ring-primary/20 card-gradient card-hover-lift texture-overlay overflow-hidden relative"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-5 relative z-10">
          <p className="text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text select-none">
            {label}
          </p>
          <div className={`text-xs font-mono font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm ${isLimit ? "text-destructive bg-destructive/10" : "text-muted-foreground/70 bg-secondary/30"}`}>
            {len}/{maxLength}
          </div>
        </div>
        
      <Textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        onChange={(e) => {
          onChange(e.target.value);
          if (ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = `${ref.current.scrollHeight}px`;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            onEnter?.();
          }
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
          className={`min-h-[80px] sm:min-h-[95px] max-h-[320px] w-full resize-none bg-secondary/10 hover:bg-secondary/20 focus:bg-background/70 border-2 border-transparent focus:border-primary/60 transition-all p-3 sm:p-5 text-base leading-relaxed font-medium relative z-10 rounded-lg ${
            isLimit 
              ? "border-destructive focus:border-destructive animate-shake" 
              : ""
          }`}
        placeholder={showHint ? "Write here..." : ""}
      />
      <div className="absolute inset-0 bg-linear-to-br from-primary/3 via-transparent to-transparent pointer-events-none" />
    </Card>
    );
}
