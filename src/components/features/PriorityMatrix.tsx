'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

type MatrixData = {
  do: string;
  decide: string;
  delegate: string;
  delete: string;
};

export function PriorityMatrix() {
  const [data, setData] = useState<MatrixData>({
    do: '',
    decide: '',
    delegate: '',
    delete: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('attihc:matrix');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const update = (key: keyof MatrixData, val: string) => {
    const next = { ...data, [key]: val };
    setData(next);
    localStorage.setItem('attihc:matrix', JSON.stringify(next));
  };

    return (
      <Card className="p-4 sm:p-8 border-0 shadow-2xl card-gradient card-hover-lift texture-overlay overflow-hidden space-y-4 sm:space-y-6 relative group">
        <h3 className="text-xs font-sans font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] gradient-text select-none relative z-10">Priority Matrix</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 h-60 sm:h-72 relative z-10">
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">🔴 Do First</span>
            <textarea
              className="flex-1 w-full bg-primary/10 dark:bg-primary/5 border-2 sm:border-[3px] border-primary/40 dark:border-primary/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-base font-medium resize-none focus:ring-4 focus:ring-primary/25 focus:border-primary/70 transition-all hover:border-primary/60 hover:bg-primary/15 placeholder:text-primary/50 shadow-lg shadow-primary/5 backdrop-blur-sm"
              value={data.do}
              onChange={(e) => update('do', e.target.value)}
              placeholder="Critical & urgent..."
            />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1" style={{color: 'oklch(77.59% 0.127 185.90)'}}>📅 Schedule</span>
            <textarea
              className="flex-1 w-full border-2 sm:border-[3px] rounded-xl sm:rounded-2xl p-3 sm:p-5 text-base font-medium resize-none focus:ring-4 transition-all hover:brightness-95 placeholder:opacity-50 shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'oklch(97.30% 0.017 192.37 / 0.35)',
              borderColor: 'oklch(77.59% 0.127 185.90 / 0.45)',
              color: 'var(--foreground)',
              boxShadow: '0 10px 25px oklch(77.59% 0.127 185.90 / 0.08)'
            }}
            value={data.decide}
            onChange={(e) => update('decide', e.target.value)}
            placeholder="Long-term goals..."
          />
        </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1" style={{color: 'oklch(73.19% 0.186 52.98)'}}>👥 Delegate</span>
            <textarea
              className="flex-1 w-full border-2 sm:border-[3px] rounded-xl sm:rounded-2xl p-3 sm:p-5 text-base font-medium resize-none focus:ring-4 transition-all hover:brightness-95 placeholder:opacity-50 shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'oklch(96.79% 0.022 67.56 / 0.55)',
                borderColor: 'oklch(73.19% 0.186 52.98 / 0.45)',
                color: 'var(--foreground)',
                boxShadow: '0 10px 25px oklch(73.19% 0.186 52.98 / 0.08)'
              }}
              value={data.delegate}
              onChange={(e) => update('delegate', e.target.value)}
              placeholder="Pass to others..."
            />
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1" style={{color: 'oklch(57.59% 0.053 314.81)'}}>🗑️ Eliminate</span>
            <textarea
              className="flex-1 w-full border-2 sm:border-[3px] rounded-xl sm:rounded-2xl p-3 sm:p-5 text-base font-medium resize-none focus:ring-4 transition-all hover:brightness-95 placeholder:opacity-50 shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'oklch(96.05% 0.004 314.80 / 0.35)',
              borderColor: 'oklch(57.59% 0.053 314.81 / 0.45)',
              color: 'var(--foreground)',
              boxShadow: '0 10px 25px oklch(57.59% 0.053 314.81 / 0.08)'
            }}
            value={data.delete}
            onChange={(e) => update('delete', e.target.value)}
            placeholder="Drop entirely..."
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none opacity-80" />
    </Card>
  );
}
