'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StickyNote } from 'lucide-react';

export function QuickNotes() {
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('attihc:quick-notes');
    if (saved) setNote(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem('attihc:quick-notes', val);
  };

    return (
      <Card className="p-4 sm:p-6 h-full flex flex-col gap-3 sm:gap-4 border-0 shadow-xl card-gradient card-hover-lift texture-overlay overflow-hidden relative">
        <h3 className="text-[10px] sm:text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text select-none flex items-center gap-1.5 sm:gap-2 relative z-10">
          <StickyNote size={14} className="sm:w-4 sm:h-4 text-primary animate-pulse" />
          Quick Notes
        </h3>
        <textarea
          className="flex-1 w-full resize-none bg-secondary/30 hover:bg-secondary/40 focus:bg-background/80 border-2 border-transparent focus:border-primary/50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed placeholder:text-muted-foreground/40 transition-all focus:ring-4 focus:ring-primary/15 shadow-inner relative z-10"
          placeholder="Jot down quick thoughts..."
          value={note}
          onChange={handleChange}
        />
      <div className="absolute inset-0 bg-linear-to-br from-primary/4 via-transparent to-transparent pointer-events-none" />
    </Card>
  );
}
