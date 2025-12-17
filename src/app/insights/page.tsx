'use client';

import { DayEntry } from "@/types";
import { useMemo } from 'react';
import { useAttihc } from '@/hooks/use-attihc';
import { Card } from '@/components/ui/card';
import { BarChart, Clock, Calendar, Type } from 'lucide-react';

export default function InsightsPage() {
  const { days, streak } = useAttihc();

  const stats = useMemo(() => {
    const entries = Object.values(days);
    const totalEntries = entries.length;
    
    let totalWords = 0;
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const hourCounts = new Array(24).fill(0);
    
    entries.forEach((day: DayEntry) => {
      // Word count
      const text = `${day.remember} ${day.complete} ${day.avoid} ${day.focus || ''} ${day.scratch || ''}`;
      totalWords += text.trim().split(/\s+/).filter(w => w.length > 0).length;

      // Date stats
      const date = new Date(day.createdAt);
      if (!isNaN(date.getTime())) {
        dayOfWeekCounts[date.getDay()]++;
        hourCounts[date.getHours()]++;
      }
    });

    const maxDayCount = Math.max(...dayOfWeekCounts, 1);
    const maxHourCount = Math.max(...hourCounts, 1);

    return {
      totalEntries,
      totalWords,
      dayOfWeekCounts,
      hourCounts,
      maxDayCount,
      maxHourCount,
      avgWords: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
    };
  }, [days]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Insights</h1>
        <div className="text-sm text-muted-foreground font-mono">
          {stats.totalEntries} entries recorded
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Calendar size={20} />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.totalEntries}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Days</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Type size={20} />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.totalWords}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Words Written</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <BarChart size={20} />
          </div>
          <div className="text-2xl font-bold font-mono">{stats.avgWords}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg Words/Day</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Clock size={20} />
          </div>
          <div className="text-2xl font-bold font-mono">{streak}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Current Streak</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Weekly Activity
          </h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {stats.dayOfWeekCounts.map((count, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-muted/30 rounded-t-sm relative flex-1 group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-sm transition-all duration-500 group-hover:bg-primary"
                    style={{ height: `${(count / stats.maxDayCount) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-sm transition-opacity">
                      {count}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{daysOfWeek[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Daily Rhythm
          </h3>
          <div className="flex items-end justify-between h-48 gap-[2px]">
            {stats.hourCounts.map((count, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div 
                  className="w-full bg-primary/80 rounded-t-[1px] transition-all duration-500 group-hover:bg-primary relative"
                  style={{ height: `${Math.max((count / stats.maxHourCount) * 100, 4)}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-sm transition-opacity z-10 whitespace-nowrap">
                    {i}:00 - {count} entries
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
