'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw, Sparkles } from 'lucide-react';

const QUOTES = [
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future depends on what you do today.",
  "Believe you can and you're halfway there.",
  "Quality is not an act, it is a habit.",
  "Focus on being productive instead of busy.",
  "Small steps in the right direction can turn out to be the biggest step of your life.",
];

export function DailyInspiration() {
  const [quote, setQuote] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  const pickQuote = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    const idx = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[idx]);
  };

  useEffect(() => {
    pickQuote();
  }, []);

    return (
      <Card className="p-5 sm:p-7 flex items-start gap-3 sm:gap-4 border-0 shadow-xl card-gradient card-hover-lift texture-overlay overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="flex-1 relative z-10">
          <h3 className="text-[10px] sm:text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 select-none">
            <Sparkles size={13} className="sm:w-[15px] sm:h-[15px] text-primary animate-pulse" /> 
            Daily Inspiration
          </h3>
          <p className="text-base sm:text-lg leading-relaxed font-serif italic text-foreground/95">
            &quot;{quote}&quot;
          </p>
        </div>
        <button 
          onClick={pickQuote}
          className={`text-muted-foreground hover:text-primary transition-all duration-300 p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 hover:scale-110 active:scale-95 relative z-10 ${isRotating ? 'animate-spin' : ''}`}
          aria-label="New quote"
        >
          <RefreshCw size={14} className="sm:w-4 sm:h-4" />
        </button>
      </Card>
    );
}
