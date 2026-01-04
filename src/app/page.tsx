'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAttihc } from "@/hooks/use-attihc";
import TodayCard from "@/components/today/TodayCard";
import { Calendar, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const FocusTimer = dynamic(() => import("@/components/features/FocusTimer").then(mod => mod.FocusTimer), { ssr: false });
const QuickNotes = dynamic(() => import("@/components/features/QuickNotes").then(mod => mod.QuickNotes), { ssr: false });
const DailyInspiration = dynamic(() => import("@/components/features/DailyInspiration").then(mod => mod.DailyInspiration), { ssr: false });
const WaterTracker = dynamic(() => import("@/components/features/WaterTracker").then(mod => mod.WaterTracker), { ssr: false });
const PriorityMatrix = dynamic(() => import("@/components/features/PriorityMatrix").then(mod => mod.PriorityMatrix), { ssr: false });


import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children, className, ...props }: { id: string, children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? 'relative' as const : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group ${className}`} {...props}>
      {children}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-3 p-1.5 text-muted-foreground/30 group-hover:text-primary/70 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 bg-background/80 backdrop-blur-sm rounded-md border border-border/50 shadow-sm z-20"
      >
        <GripVertical size={16} />
      </div>
    </div>
  );
}

const DEFAULT_ORDER = ['focus', 'remember', 'complete', 'avoid', 'scratch', 'inspiration', 'timer', 'water', 'notes', 'matrix'];

export default function TodayPage() {
  const { settings, today, updateToday, streak, setLayoutOrder } = useAttihc();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const r1 = useRef<HTMLTextAreaElement>(null);
  const r2 = useRef<HTMLTextAreaElement>(null);
  const r3 = useRef<HTMLTextAreaElement>(null);
  const rFocus = useRef<HTMLInputElement>(null);
  const rScratch = useRef<HTMLTextAreaElement>(null);
  const [clearPending, setClearPending] = useState(false);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drag and Drop State
  const [items, setItems] = useState<string[]>(DEFAULT_ORDER);

  useEffect(() => {
    if (settings.layoutOrder && settings.layoutOrder.length > 0) {
      // Merge with defaultOrder to ensure new items appear
      const newItems = [...settings.layoutOrder];
      DEFAULT_ORDER.forEach(item => {
        if (!newItems.includes(item)) {
          newItems.push(item);
        }
      });
      setItems(newItems);
    }
  }, [settings.layoutOrder]);

  // Handle clear today with double-click confirmation
  const handleClearToday = () => {
    if (clearPending) {
      // Second click - actually clear
      updateToday({ focus: "", remember: "", complete: "", avoid: "", scratch: "" });
      setClearPending(false);
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
        clearTimeoutRef.current = null;
      }
    } else {
      // First click - show pending state
      setClearPending(true);
      clearTimeoutRef.current = setTimeout(() => {
        setClearPending(false);
        clearTimeoutRef.current = null;
      }, 10000); // Reset after 10 seconds
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    // IMPORTANT: do not call other state setters inside the setItems updater.
    // React executes updater functions during render, and side-effects there will
    // trigger warnings like "Cannot update a component while rendering a different component".
    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    setLayoutOrder(newOrder);
  };

  useEffect(() => {
    setReady(true);
    if (typeof window !== "undefined") {
      if (!settings.passcode) {
        setUnlocked(true);
      } else if (window.sessionStorage.getItem("attihc:unlocked") === "1") {
        setUnlocked(true);
      }
    }
    if (!settings.shortcuts) {
      return;
    }
    const handler = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) && !e.altKey) return;

      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (e.key === "1") { e.preventDefault(); r1.current?.focus(); }
        if (e.key === "2") { e.preventDefault(); r2.current?.focus(); }
        if (e.key === "3") { e.preventDefault(); r3.current?.focus(); }
        if (e.key === "4") { e.preventDefault(); rScratch.current?.focus(); }
        if (e.key.toLowerCase() === "f") { e.preventDefault(); rFocus.current?.focus(); }
        if (e.key.toLowerCase() === "h") router.push("/history");
        if (e.key.toLowerCase() === "s") router.push("/settings");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, settings.passcode, settings.shortcuts]);

  if (!ready) {
    return (
      <div className="grid gap-6">
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-24 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-36 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-36 skeleton"></div>
      </div>
    );
  }

  if (settings.passcode && !unlocked) {
    return (
      <div className="grid gap-6">
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

  const renderItem = (id: string) => {
    switch (id) {
      case 'focus':
        return (
          <Card className="p-5 sm:p-8 shadow-xl border-0 transition-all focus-within:ring-4 focus-within:ring-primary/20 h-full card-gradient card-hover-lift texture-overlay overflow-hidden relative backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
              <p className="text-xs font-sans font-black uppercase tracking-[0.2em] gradient-text select-none">Focus Word</p>
              <div className={`text-xs font-mono font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-sm ${(today?.focus?.length ?? 0) >= 30 ? "text-destructive bg-destructive/10" : "text-muted-foreground/70 bg-secondary/30"}`}>
                {today?.focus?.length ?? 0}/30
              </div>
            </div>
            <input
              ref={rFocus}
              type="text"
              maxLength={30}
              value={today?.focus ?? ""}
              onChange={(e) => updateToday({ focus: e.target.value })}
              className={`w-full bg-transparent border-b-[3px] px-3 sm:px-6 py-3 sm:py-5 text-foreground font-serif text-2xl sm:text-4xl font-bold focus:outline-none placeholder:text-muted-foreground/30 transition-all max-w-full text-center relative z-10 ${(today?.focus?.length ?? 0) >= 30 ? "border-destructive animate-shake" : "border-primary/40 focus:border-primary"}`}
              placeholder="clarity"
              data-tutorial-id="focus"
              style={{ letterSpacing: '0.02em' }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
          </Card>
        );
      case 'remember':
        return (
          <TodayCard
            label="Must Remember"
            value={today?.remember ?? ""}
            inputRef={r1}
            onChange={(v) => updateToday({ remember: v })}
            onEnter={() => r2.current?.focus()}
            showHint={!settings.quiet}
            data-tutorial-id="remember"
          />
        );
      case 'complete':
        return (
          <TodayCard
            label="Must Complete"
            value={today?.complete ?? ""}
            inputRef={r2}
            onChange={(v) => updateToday({ complete: v })}
            onEnter={() => r3.current?.focus()}
            showHint={!settings.quiet}
          />
        );
      case 'avoid':
        return (
          <TodayCard
            label="Must Avoid"
            value={today?.avoid ?? ""}
            inputRef={r3}
            onChange={(v) => updateToday({ avoid: v })}
            onEnter={() => r3.current?.blur()}
            showHint={!settings.quiet}
          />
        );
      case 'scratch':
        return (
          <TodayCard
            label="Scratchpad"
            value={today?.scratch ?? ""}
            inputRef={rScratch}
            onChange={(v) => updateToday({ scratch: v })}
            onEnter={() => rScratch.current?.blur()}
            showHint={!settings.quiet}
            data-tutorial-id="scratch"
          />
        );
      case 'inspiration':
        return settings.features?.dailyInspiration ? <DailyInspiration /> : null;
      case 'timer':
        return settings.features?.focusTimer ? <FocusTimer /> : null;
      case 'water':
        return settings.features?.waterTracker ? <WaterTracker /> : null;
      case 'notes':
        return settings.features?.quickNotes ? <QuickNotes /> : null;
      case 'matrix':
        return settings.features?.priorityMatrix ? <PriorityMatrix /> : null;
      default:
        return null;
    }
  };

  const getItemClass = (id: string) => {
    switch (id) {
      case 'focus': return "md:col-span-2 lg:col-span-2";
      case 'inspiration': return "md:col-span-2 lg:col-span-3";
      case 'matrix': return "md:col-span-2 lg:col-span-3";
      case 'notes': return "md:col-span-1 row-span-2";
      default: return "";
    }
  };

  return (
    <div className="max-w-none mx-auto pb-20">
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">Today</h1>
          <div className="flex items-center gap-2">
            <span suppressHydrationWarning className="font-mono text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2 bg-secondary/50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-border/50 backdrop-blur-sm w-fit">
              <Calendar size={14} className="text-primary" /> {today?.date ?? ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearToday}
              title={clearPending ? "Click again to confirm" : "Clear all fields"}
              className={`p-2 h-auto transition-all duration-200 ${clearPending ? "text-destructive bg-destructive/10 animate-pulse" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"}`}
            >
              <Trash2 size={14} />
              {clearPending && <span className="ml-1 text-xs">Confirm?</span>}
            </Button>
          </div>
        </div>

        <Card className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-5 border-border/60 shadow-md glassmorphism card-hover-lift">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-500 dark:text-orange-400 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider border border-orange-500/30 shadow-lg animate-float">
              <span className="text-sm sm:text-base">🔥</span>
              <span>{streak} Day Streak</span>
            </div>
          )}
          {(() => {
            const total = 5;
            const filled =
              (today?.remember?.trim() ? 1 : 0) +
              (today?.complete?.trim() ? 1 : 0) +
              (today?.avoid?.trim() ? 1 : 0) +
              (today?.focus?.trim() ? 1 : 0) +
              (today?.scratch?.trim() ? 1 : 0);
            const pct = Math.round((filled / total) * 100);
            return (
              <div className="flex-1 w-full flex items-center gap-3 sm:gap-4">
                <div className="h-2.5 sm:h-3 flex-1 rounded-full bg-secondary/50 overflow-hidden relative">
                  <div
                    className="h-full bg-linear-to-r from-primary via-primary/90 to-primary transition-all duration-700 ease-out progress-glow relative"
                    style={{
                      width: `${pct}%`,
                      backgroundSize: '200% 100%',
                      animation: pct > 0 && pct < 100 ? 'shimmer 3s ease-in-out infinite' : 'none'
                    }}
                  />
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-foreground w-10 sm:w-12 text-right">{pct}%</div>
              </div>
            );
          })()}
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {items.map((id) => {
              const content = renderItem(id);
              if (!content) return null;
              return (
                <SortableItem key={id} id={id} className={getItemClass(id)} data-tutorial-id={id}>
                  {content}
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

    </div>
  );
}
