'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

    return (
      <Card className="p-5 sm:p-7 flex flex-col items-center gap-4 sm:gap-5 border-0 shadow-xl card-gradient card-hover-lift texture-overlay overflow-hidden relative">
          <div className="flex items-center justify-between w-full relative z-10">
            <h3 className="text-[10px] sm:text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text select-none">Focus Timer</h3>
            <button 
              onClick={switchMode}
              className="text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 backdrop-blur-sm group relative overflow-hidden"
            >
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:animate-[mode-bounce_0.6s_ease-in-out]">
                {mode === 'work' ? '☕' : '🎯'}
              </span>{' '}
              <span className="relative z-10">{mode === 'work' ? 'Break' : 'Work'}</span>
              <div 
                className="absolute top-1/2 left-1/2 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" 
                style={{ transform: isActive ? 'rotate(180deg)' : '' }}
              />
            </button>
          </div>
        
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 my-3 sm:my-4">
          <svg className="transform -rotate-90 w-32 h-32 sm:w-40 sm:h-40">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-secondary/30"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-primary" style={{ stopColor: 'currentColor' }} />
              <stop offset="100%" className="text-primary/60" style={{ stopColor: 'currentColor' }} />
            </linearGradient>
          </defs>
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl font-mono font-bold tracking-tight ${isActive ? 'animate-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full relative z-10">
          <Button 
            variant={isActive ? "secondary" : "default"} 
            className="flex-1 font-semibold text-sm gap-1.5 sm:gap-2 h-9 sm:h-10" 
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={14} className="sm:w-4 sm:h-4" /> : <Play size={14} className="sm:w-4 sm:h-4" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" size="icon" onClick={resetTimer} className="hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10">
            <RotateCcw size={14} className="sm:w-4 sm:h-4" />
          </Button>
        </div>
      <div className="absolute inset-0 bg-linear-to-br from-primary/4 via-transparent to-transparent pointer-events-none" />
    </Card>
  );
}
