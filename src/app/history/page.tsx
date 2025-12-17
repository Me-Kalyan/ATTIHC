'use client';
import { DayEntry } from "@/types";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAttihc } from "@/hooks/use-attihc";
import HistoryDay from "@/components/history/HistoryDay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutGrid, List, ChevronUp, ChevronDown, Filter, X, Star, Table } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

function HistoryPageInner() {
  const { settings, history, updateDay } = useAttihc();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'summary'>('grid');
  const [showActivity, setShowActivity] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  
  // Filters
  const [filterHasFocus, setFilterHasFocus] = useState(false);
  const [filterHasScratch, setFilterHasScratch] = useState(false);
  const [filterHasFavorite, setFilterHasFavorite] = useState(false);
  
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
    setReady(true);
    if (typeof window !== "undefined") {
      if (!settings.passcode) {
        setUnlocked(true);
      } else if (window.sessionStorage.getItem("attihc:unlocked") === "1") {
        setUnlocked(true);
      }
    }
  }, [settings.passcode, searchParams]);

  const heat = useMemo(() => {
    const nonEmpty = (s?: string) => !!s && s.trim().length > 0;
    const hasEntry = (d: string) => {
      const e = history.find((x: DayEntry) => x.date === d);
      if (!e) return false;
      return nonEmpty(e.remember) || nonEmpty(e.complete) || nonEmpty(e.avoid) || nonEmpty(e.focus) || nonEmpty(e.scratch);
    };
    const days: { date: string; value: number }[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1).toString().padStart(2, "0");
      const d = dt.getDate().toString().padStart(2, "0");
      const id = `${y}-${m}-${d}`;
      days.push({ date: id, value: hasEntry(id) ? 1 : 0 });
    }
    return days.reverse();
  }, [history]);

  const filtered = useMemo<DayEntry[]>(() => {
    let res = history;
    const q = search.trim().toLowerCase();
    
    if (q) {
      res = res.filter((d: DayEntry) => {
        const text = `${d.date} ${d.remember} ${d.complete} ${d.avoid} ${d.focus ?? ""} ${d.scratch ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (filterHasFocus) {
      res = res.filter((d: DayEntry) => d.focus && d.focus.trim().length > 0);
    }
    
    if (filterHasScratch) {
      res = res.filter((d: DayEntry) => d.scratch && d.scratch.trim().length > 0);
    }

    if (filterHasFavorite) {
      res = res.filter((d: DayEntry) => d.favorite);
    }

    return res;
  }, [history, search, filterHasFocus, filterHasScratch, filterHasFavorite]);

  if (!ready) {
    return (
      <div className="grid gap-6 pb-20 max-w-none mx-auto">
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-24 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-12 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-64 skeleton"></div>
      </div>
    );
  }

  if (settings.passcode && !unlocked) {
    return (
      <div className="grid gap-6 pb-20 max-w-none mx-auto">
        <Card className="p-6 space-y-4 max-w-md mx-auto w-full">
          <h1 className="text-2xl font-serif font-bold text-center">Enter passcode</h1>
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeError("");
            }}
            className="w-full border-b-2 border-border bg-transparent px-3 py-2 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-primary transition-colors"
            placeholder="••••"
          />
          {codeError && <div className="text-xs text-destructive text-center">{codeError}</div>}
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              if (code === settings.passcode) {
                setUnlocked(true);
                setCode("");
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem("attihc:unlocked", "1");
                }
              } else {
                setCodeError("Incorrect passcode.");
              }
            }}
          >
            Unlock
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-none mx-auto pb-20">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold tracking-tight">History</h1>
          <div className="text-sm font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {filtered.length} entries found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 shadow-sm border border-border space-y-4 md:col-span-2">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
             <div className="relative flex-1">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dates and entries..."
                  className="w-full bg-background border border-input p-2 rounded-md text-foreground font-sans text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-colors"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                )}
             </div>
             
             <div className="flex items-center gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter size={14} /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked={filterHasFocus} onCheckedChange={setFilterHasFocus}>
                      Has Focus Word
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={filterHasScratch} onCheckedChange={setFilterHasScratch}>
                      Has Scratchpad
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
               </DropdownMenu>

               <div className="flex items-center border rounded-md overflow-hidden">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                   title="Grid View"
                 >
                   <LayoutGrid size={16} />
                 </button>
                 <button 
                   onClick={() => setViewMode('timeline')}
                   className={`p-2 ${viewMode === 'timeline' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                   title="Timeline View"
                 >
                   <List size={16} />
                 </button>
                 <button 
                   onClick={() => setViewMode('summary')}
                   className={`p-2 ${viewMode === 'summary' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                   title="Summary View"
                 >
                   <Table size={16} />
                 </button>
               </div>
             </div>
          </div>

          {/* Activity Heatmap Collapsible */}
          {history.length > 0 && (
            <div className="space-y-2">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setShowActivity(!showActivity)}
              >
                <div className="text-xs font-sans font-bold uppercase tracking-wider text-primary select-none">Activity (Last 30 Days)</div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {showActivity ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
              
              {showActivity && (
                <div className="bg-background border border-border p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-10 gap-1 mb-2">
                    {heat.map((h) => (
                      <div
                        key={h.date}
                        title={h.date}
                        className="aspect-square rounded-sm bg-primary transition-opacity"
                        style={{ opacity: h.value ? 0.9 : 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wide">
                    <span>Less</span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-sm bg-primary/20" />
                      <div className="h-2 w-2 rounded-sm bg-primary/50" />
                      <div className="h-2 w-2 rounded-sm bg-primary/80" />
                      <div className="h-2 w-2 rounded-sm bg-primary" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Entries */}
        <div className="md:col-span-2">
          {viewMode === 'grid' && (
            <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((day) => (
                <HistoryDay
                  key={day.date}
                  {...day}
                  open={!!open[day.date]}
                  onToggle={() =>
                    setOpen((prev) => ({ ...prev, [day.date]: !prev[day.date] }))
                  }
                  onFavoriteToggle={() => updateDay(day.date, { favorite: !day.favorite })}
                />
              ))}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="space-y-8 relative pl-4 border-l-2 border-muted ml-2 pb-10">
              {filtered.map((day) => (
                <div key={day.date} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[37px] top-1 h-5 w-5 rounded-full border-4 border-background ring-1 ring-border transition-colors ${day.favorite ? 'bg-yellow-400' : 'bg-primary'}`} />
                  
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-lg">{day.date}</span>
                      <button 
                        onClick={() => updateDay(day.date, { favorite: !day.favorite })}
                        className="text-muted-foreground hover:text-yellow-400 transition-colors"
                      >
                        <Star size={16} className={day.favorite ? "fill-yellow-400 text-yellow-400" : ""} />
                      </button>
                      {day.focus && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{day.focus}</span>}
                    </div>
                    
                    <div className="space-y-3 text-sm text-muted-foreground bg-card border border-border p-4 rounded-lg shadow-sm">
                       {day.remember && (
                         <div className="flex gap-2">
                           <span className="font-bold text-foreground min-w-[80px]">Remember:</span> 
                           <span className="flex-1">{day.remember}</span>
                         </div>
                       )}
                       {day.complete && (
                         <div className="flex gap-2">
                           <span className="font-bold text-foreground min-w-[80px]">Complete:</span> 
                           <span className="flex-1">{day.complete}</span>
                         </div>
                       )}
                       
                       <div className={`grid transition-[grid-template-rows] duration-300 ${open[day.date] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                         <div className="overflow-hidden">
                           <div className="pt-3 space-y-3 border-t border-border mt-3">
                              {day.avoid && (
                                <div className="flex gap-2">
                                  <span className="font-bold text-foreground min-w-[80px]">Avoid:</span> 
                                  <span className="flex-1">{day.avoid}</span>
                                </div>
                              )}
                              {day.scratch && (
                                <div className="flex gap-2">
                                  <span className="font-bold text-foreground min-w-[80px]">Scratch:</span> 
                                  <span className="flex-1 whitespace-pre-wrap">{day.scratch}</span>
                                </div>
                              )}
                           </div>
                         </div>
                       </div>

                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="w-full h-auto py-1 mt-1 text-xs text-muted-foreground hover:text-foreground"
                         onClick={() => setOpen((prev) => ({ ...prev, [day.date]: !prev[day.date] }))}
                       >
                         {open[day.date] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                         <span className="ml-1">{open[day.date] ? "Show Less" : "Show More"}</span>
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'summary' && (
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-mono">Date</th>
                      <th className="px-4 py-3">Focus</th>
                      <th className="px-4 py-3">Key Tasks</th>
                      <th className="px-4 py-3 text-center">Fav</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((day) => (
                      <tr key={day.date} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono whitespace-nowrap">{day.date}</td>
                        <td className="px-4 py-3 max-w-[150px] truncate">
                          {day.focus ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {day.focus}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-[300px]">
                          <div className="truncate text-foreground">{day.remember}</div>
                          <div className="truncate text-muted-foreground text-xs">{day.complete}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => updateDay(day.date, { favorite: !day.favorite })}
                            className="text-muted-foreground hover:text-yellow-400 transition-colors inline-flex"
                          >
                            <Star size={14} className={day.favorite ? "fill-yellow-400 text-yellow-400" : ""} />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setViewMode('grid');
                              setOpen({ [day.date]: true });
                              // Scroll to top or specific element could be added here
                            }}
                          >
                            <span className="sr-only">View</span>
                            <LayoutGrid size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <div className="mb-2">No entries found matching your criteria.</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearch('');
                  setFilterHasFocus(false);
                  setFilterHasScratch(false);
                  setFilterHasFavorite(false);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-none mx-auto pb-20">
          <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-16 skeleton"></div>
        </div>
      }
    >
      <HistoryPageInner />
    </Suspense>
  );
}
