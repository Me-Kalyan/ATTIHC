"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
    Search,
    Send,
    LayoutGrid,
    Calendar,
    Star
} from "lucide-react";
import { useAttihc } from "@/hooks/use-attihc";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    short?: string;
    end?: string;
    action?: () => void;
}

interface SearchResult {
    actions: Action[];
}

const useDefaultActions = (router: ReturnType<typeof useRouter>): Action[] => [
    {
        id: "1",
        label: "View History",
        icon: <Calendar className="h-4 w-4" />,
        description: "Browse past entries",
        short: "Alt+H",
        end: "Navigate",
        action: () => router.push('/history'),
    },
    {
        id: "2",
        label: "Open Settings",
        icon: <LayoutGrid className="h-4 w-4" />,
        description: "Customize your experience",
        short: "Alt+S",
        end: "Configure",
        action: () => router.push('/settings'),
    },
    {
        id: "3",
        label: "Focus Mode",
        icon: <Star className="h-4 w-4" />,
        description: "Distraction-free view",
        short: "Alt+F",
        end: "Quick",
        action: () => {
            // Toggle focus mode by scrolling to focus input
            router.push('/today');
            setTimeout(() => {
                const focusInput = document.querySelector('[data-tutorial-id="focus"]') as HTMLElement;
                focusInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = focusInput?.querySelector('input');
                input?.focus();
            }, 100);
        },
    },
];

function ActionSearchBar({
    actions: providedActions,
    onClose,
}: {
    actions?: Action[];
    defaultOpen?: boolean;
    onClose?: () => void;
}) {
    const router = useRouter();
    const defaultActions = useDefaultActions(router);
    const initialActions = providedActions || defaultActions;
    
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const { days } = useAttihc();

    // Generate actions from history - instant search as user types
    const historyActions = useMemo(() => {
        if (!query) return [];
        const q = query.toLowerCase().trim();
        
        return Object.values(days)
            .filter(day => {
                // Search through all fields comprehensively
                const searchFields = [
                    day.remember || '',
                    day.complete || '',
                    day.avoid || '',
                    day.focus || '',
                    day.scratch || '',
                    day.date
                ].map(field => field.toLowerCase());
                
                // Check if query matches any field
                return searchFields.some(field => field.includes(q));
            })
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 8) // Show more results
            .map(day => {
                // Find which field matched for better preview
                const matchedField = 
                    (day.focus?.toLowerCase().includes(q) ? day.focus : null) ||
                    (day.remember?.toLowerCase().includes(q) ? day.remember : null) ||
                    (day.complete?.toLowerCase().includes(q) ? day.complete : null) ||
                    (day.avoid?.toLowerCase().includes(q) ? day.avoid : null) ||
                    (day.scratch?.toLowerCase().includes(q) ? day.scratch : null) ||
                    '';
                
                return {
                    id: `day-${day.date}`,
                    label: day.date,
                    icon: <Calendar className="h-4 w-4 text-primary" />,
                    description: matchedField.substring(0, 80) + (matchedField.length > 80 ? '...' : ''),
                    end: day.favorite ? "★" : undefined,
                    action: () => router.push(`/history?date=${day.date}`)
                };
            });
    }, [days, query, router]);

    const filteredActions = useMemo(() => {
        let currentActions = [...initialActions];
        
        // Add history actions if searching
        if (query) {
            currentActions = [...historyActions, ...currentActions];
        }

        if (!query) return currentActions;

        const normalizedQuery = query.toLowerCase().trim();
        return currentActions.filter((action) => {
            // If it's a history item, it's already filtered
            if (action.id.startsWith('day-')) return true;
            
            const searchableText =
                `${action.label} ${action.description || ""}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });
    }, [query, initialActions, historyActions]);

    useEffect(() => {
        setResult({ actions: filteredActions });
        setActiveIndex(-1);
    }, [filteredActions]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
        },
        []
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!result?.actions.length) {
                 if (e.key === "Escape") {
                     onClose?.();
                 }
                 return;
            }

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < result.actions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : result.actions.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (activeIndex >= 0 && result.actions[activeIndex]) {
                        const action = result.actions[activeIndex];
                        if (action.action) {
                            action.action();
                        }
                        onClose?.();
                    } else if (result.actions.length > 0) {
                        // Execute first action if no selection
                        const action = result.actions[0];
                        if (action.action) {
                            action.action();
                        }
                        onClose?.();
                    }
                    break;
                case "Escape":
                    setActiveIndex(-1);
                    onClose?.();
                    break;
            }
        },
        [result?.actions, activeIndex, onClose]
    );

    const handleActionClick = useCallback((action: Action) => {
        if (action.action) {
            action.action();
        }
        onClose?.();
    }, [onClose]);

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="flex flex-col w-full bg-background rounded-[4px] border border-[#e0e0e0] dark:border-border shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Header Section */}
                <div className="flex flex-col border-b border-border/40">
                    <label
                        className="px-4 pt-4 pb-2 text-xs font-semibold tracking-[0.5px] text-muted-foreground uppercase select-none"
                        htmlFor="search"
                    >
                        Quick Actions
                    </label>
                    <div className="relative px-4 pb-2">
                        <Input
                            id="search"
                            type="text"
                            placeholder="Type to search..."
                            value={query}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full pl-0 pr-8 border-none shadow-none focus-visible:ring-0 text-base leading-normal tracking-[0.5px] placeholder:text-muted-foreground/40 h-auto py-2 bg-transparent rounded-none"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {query.length > 0 ? (
                                <Send className="w-4 h-4 text-muted-foreground animate-in fade-in zoom-in duration-200" />
                            ) : (
                                <Search className="w-4 h-4 text-muted-foreground animate-in fade-in zoom-in duration-200" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {result && result.actions.length > 0 ? (
                        <ul role="listbox" className="p-0 m-0">
                            {result.actions.map((action, index) => (
                                <li
                                    key={action.id}
                                    id={`action-${action.id}`}
                                    className={cn(
                                        "px-4 py-4 flex items-center justify-between cursor-pointer transition-colors duration-200 border-b border-border/40 last:border-0",
                                        activeIndex === index ? "bg-muted/50" : "hover:bg-muted/30"
                                    )}
                                    onClick={() => handleActionClick(action)}
                                    role="option"
                                    aria-selected={activeIndex === index}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <span className={cn("shrink-0 text-muted-foreground", activeIndex === index && "text-foreground")}>
                                            {action.icon}
                                        </span>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <span className="text-sm font-medium text-foreground leading-normal tracking-[0.5px] truncate">
                                                {action.label}
                                            </span>
                                            {action.description && (
                                                <span className="text-xs text-muted-foreground leading-normal tracking-[0.5px] truncate">
                                                    {action.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        {action.short && (
                                            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                {action.short}
                                            </kbd>
                                        )}
                                        {action.end && (
                                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                                {action.end}
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : result && result.actions.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground font-medium leading-normal tracking-[0.5px]">
                            No results found.
                        </div>
                    ) : null}
                </div>

                {/* Footer Section */}
                <div className="bg-muted/30 px-4 py-2 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <span className="font-sans text-xs">↑↓</span> Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-sans text-xs">↵</span> Select
                        </span>
                    </div>
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <span className="font-sans text-xs">esc</span> Close
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActionSearchBar;
