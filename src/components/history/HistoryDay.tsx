'use client';
import { Card } from "@/components/ui/card";
import { Calendar, ChevronDown, Star } from "lucide-react";

export type HistoryDayProps = {
  date: string;
  remember: string;
  complete: string;
  avoid: string;
  focus?: string;
  scratch?: string;
  favorite?: boolean;
  open: boolean;
  onToggle: () => void;
  onFavoriteToggle?: () => void;
};

export default function HistoryDay({ date, remember, complete, avoid, focus, scratch, favorite, open, onToggle, onFavoriteToggle }: HistoryDayProps) {
  return (
    <Card className="p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between">
        <button className="flex-1 flex justify-between items-center text-left" onClick={onToggle} aria-expanded={open}>
          <span className="font-mono flex items-center gap-2 subtle">
            <Calendar size={16} /> {date}
          </span>
          <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {onFavoriteToggle && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="ml-2 p-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label={favorite ? "Unmark as favorite" : "Mark as favorite"}
          >
            <Star size={16} className={favorite ? "fill-yellow-400 text-yellow-400" : ""} />
          </button>
        )}
      </div>
      <div className={`overflow-hidden transition-[max-height] duration-180`} style={{ maxHeight: open ? 500 : 0 }}>
        <div className="my-3 h-px bg-border" />
        <div className="grid gap-3">
          {focus && (
            <div>
              <div className="mb-1 text-xs font-sans font-bold uppercase tracking-wider text-primary">Focus Word</div>
              <div className="text-foreground bg-background border border-border rounded-md p-3 font-sans text-sm">{focus}</div>
            </div>
          )}
          <div>
            <div className="mb-1 text-xs font-sans font-bold uppercase tracking-wider text-primary">Must Remember</div>
            <div className="text-foreground bg-background border border-border rounded-md p-3 font-sans text-sm">{remember}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-sans font-bold uppercase tracking-wider text-primary">Must Complete</div>
            <div className="text-foreground bg-background border border-border rounded-md p-3 font-sans text-sm">{complete}</div>
          </div>
          <div>
            <div className="mb-1 text-xs font-sans font-bold uppercase tracking-wider text-primary">Must Avoid</div>
            <div className="text-foreground bg-background border border-border rounded-md p-3 font-sans text-sm">{avoid}</div>
          </div>
          {scratch && (
            <div>
              <div className="mb-1 text-xs font-sans font-bold uppercase tracking-wider text-primary">Scratchpad</div>
              <div className="text-foreground whitespace-pre-wrap bg-background border border-border rounded-md p-3 font-sans text-sm">{scratch}</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
