'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Plus, Minus, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WaterTracker() {
  const [cups, setCups] = useState(0);
  const GOAL = 8;
  const dateKey = new Date().toISOString().split('T')[0];
  const storageKey = `attihc:water:${dateKey}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCups(parseInt(saved, 10));
  }, [storageKey]);

  const updateCups = (newVal: number) => {
    const v = Math.max(0, Math.min(newVal, 20));
    setCups(v);
    localStorage.setItem(storageKey, v.toString());
  };

  const percentage = Math.min(100, (cups / GOAL) * 100);
  const isComplete = cups >= GOAL;

    return (
      <Card className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 border-0 shadow-xl card-gradient card-hover-lift texture-overlay overflow-hidden relative">
        <div className="flex items-center justify-between relative z-10">
          <h3 className="text-[10px] sm:text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text select-none flex items-center gap-1.5 sm:gap-2">
            <Droplets size={13} className="sm:w-[15px] sm:h-[15px] text-cyan-500 animate-[droplet-bounce_2s_ease-in-out_infinite]" /> 
            Water Tracker
          </h3>
          <span className="text-[10px] sm:text-xs font-mono font-bold text-muted-foreground/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary/30 backdrop-blur-sm">{cups}/{GOAL}</span>
        </div>
      
      <div className="h-4 w-full bg-secondary/30 rounded-full overflow-hidden relative shadow-inner">
        <div 
          className="h-full bg-linear-to-r from-cyan-400 via-blue-500 to-cyan-400 water-wave transition-all duration-700 ease-out relative"
          style={{ 
            width: `${percentage}%`,
            backgroundSize: '200% 100%',
            boxShadow: percentage > 0 ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-transparent via-white/10 to-white/20" />
        </div>
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">🎉 Goal!</span>
          </div>
        )}
      </div>

        <div className="flex items-center gap-2 sm:gap-3 justify-between relative z-10">
          <div className="flex gap-1 sm:gap-1.5">
            {Array.from({ length: GOAL }).map((_, i) => (
              <div
                key={i}
                className={`w-2 sm:w-2.5 h-5 sm:h-6 rounded-full transition-all duration-300 ${
                  i < cups 
                    ? 'bg-linear-to-b from-cyan-400 to-blue-500 shadow-md' 
                    : 'bg-secondary/30'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-cyan-500/10"
              onClick={() => updateCups(cups - 1)}
              disabled={cups === 0}
            >
              <Minus size={13} className="sm:w-[15px] sm:h-[15px]" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-cyan-500/10"
              onClick={() => updateCups(cups + 1)}
            >
              <Plus size={13} className="sm:w-[15px] sm:h-[15px]" />
            </Button>
          </div>
        </div>
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-transparent to-blue-500/3 pointer-events-none" />
    </Card>
  );
}
