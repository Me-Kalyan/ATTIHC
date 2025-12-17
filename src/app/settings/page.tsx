'use client';
import { useEffect, useState } from "react";
import { useAttihc } from "@/hooks/use-attihc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Download, Trash, Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
        className={`group relative inline-flex h-7 w-12 items-center rounded-full ring-1 shadow-md transition-all duration-200 hover:scale-105 touch-manipulation ${
          checked ? "bg-linear-to-r from-primary to-primary/90 ring-primary/50 shadow-primary/20" : "bg-secondary ring-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-card ring-1 ring-border shadow-md transition-all duration-200 ${
            checked ? "translate-x-5 shadow-primary/30" : "translate-x-0"
          }`}
        />
    </button>
  );
}

function MenuSelect<T extends string | number>({
  value,
  onChange,
  options,
  format,
  columns,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label?: string }>;
  format?: (v: T) => string;
  columns?: 3;
}) {
  const label: string = format ? format(value) : (options.find((o) => o.value === value)?.label ?? String(value));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full shadow-sm hover:shadow-md bg-card hover:bg-muted backdrop-blur-0 text-foreground">
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-2 size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={columns === 3 ? "w-[18rem] max-h-64 p-2" : "min-w-40 p-1"}>
        {columns === 3 ? (
          <div className="grid grid-cols-3 gap-1">
            {options.map((o) => {
              const text = format ? format(o.value) : (o.label ?? String(o.value));
              const selected = o.value === value;
              return (
                <DropdownMenuItem
                  key={String(o.value)}
                  onSelect={(e) => {
                    e.preventDefault();
                    onChange(o.value);
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{text}</span>
                  {selected && <Check className="size-4 opacity-80" />}
                </DropdownMenuItem>
              );
            })}
          </div>
        ) : (
          options.map((o) => {
            const text = format ? format(o.value) : (o.label ?? String(o.value));
            const selected = o.value === value;
            return (
              <DropdownMenuItem
                key={String(o.value)}
                onSelect={(e) => {
                  e.preventDefault();
                  onChange(o.value);
                }}
                className="flex items-center justify-between gap-2"
              >
                <span>{text}</span>
                {selected && <Check className="size-4 opacity-80" />}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label?: string }>;
  ariaLabel?: string;
}) {
  const currentIndex = options.findIndex((o) => o.value === value);
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          const next = options[(currentIndex + 1) % options.length]?.value;
          if (next) onChange(next);
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          const prev = options[(currentIndex - 1 + options.length) % options.length]?.value;
          if (prev) onChange(prev);
          e.preventDefault();
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border bg-card ring-1 ring-border p-1.5 shadow-sm"
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            data-checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onChange(o.value);
            }}
            className={`${selected
              ? "bg-accent text-accent-foreground ring-1 ring-accent/60 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60 ring-1 ring-transparent hover:shadow-xs"} rounded-full px-3.5 py-1.5 focus-visible:ring-2 focus-visible:ring-ring transition-all`}
          >
            {o.label ?? String(o.value)}
          </button>
        );
      })}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, setResetHour, setQuiet, setShortcuts, setPasscode, setTheme, setFeatures, doExport, doImport, clearAll } = useAttihc();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [passInput, setPassInput] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [passError, setPassError] = useState("");
  const { toast } = useToast();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = new URLSearchParams(window.location.search).get("open");
    if (v === "export") setOpen(true);
    if (v === "import") setImportOpen(true);
  }, []);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const nextResetLabel = (() => {
    if (!now) return "";
    const d = new Date(now);
    d.setHours(settings.resetHour ?? 0, 0, 0, 0);
    if (d <= now) d.setDate(d.getDate() + 1);
    const isToday = d.toDateString() === now.toDateString();
    const hh = String(settings.resetHour ?? 0).padStart(2, "0");
    return `${isToday ? "Today" : "Tomorrow"} at ${hh}:00`;
  })();

  if (!ready) {
    return (
      <div className="grid gap-6 pb-20 max-w-none mx-auto">
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-16 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-40 skeleton"></div>
        <div className="p-4 rounded-lg border border-border bg-card shadow-sm h-48 skeleton"></div>
      </div>
    );
  }

  return (
    <div className="max-w-none mx-auto pb-20">
      <div className="space-y-4 mb-6">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <Card className="p-5 shadow-md border-border/60 card-gradient card-hover-lift texture-overlay overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Day Reset Time</div>
                  <div className="text-xs text-muted-foreground">Next reset: {nextResetLabel}</div>
                </div>
              <MenuSelect
                value={settings.resetHour}
                onChange={(v) => {
                  setResetHour(Number(v));
                  const hh = String(v).padStart(2, "0");
                  toast(`Day reset set to ${hh}:00`, { icon: "check", variant: "success", duration: 2000 });
                }}
                options={Array.from({ length: 24 }).map((_, i) => ({ value: i }))}
                format={(v) => `${String(v).padStart(2, "0")}:00`}
                columns={3}
              />
            </div>
          </Card>

            <Card className="p-5 shadow-md border-border/60 card-gradient card-hover-lift texture-overlay overflow-hidden space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Quiet Mode</div>
                <div className="text-xs text-muted-foreground max-w-[200px] sm:max-w-none">Hide helper hints and extra motion for a cleaner interface.</div>
              </div>
              <Toggle
                checked={settings.quiet}
                onChange={(v) => {
                  setQuiet(v);
                  toast(`Quiet Mode ${v ? "on" : "off"}`, { icon: "check", variant: "success", duration: 2000 });
                }}
              />
            </div>
            
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Keyboard Shortcuts</div>
                <div className="text-xs text-muted-foreground max-w-[200px] sm:max-w-none">Enable Alt+1/2/3/4 and Alt+F/H/S for quick navigation.</div>
              </div>
              <Toggle
                checked={settings.shortcuts}
                onChange={(v) => {
                  setShortcuts(v);
                  toast(`Shortcuts ${v ? "on" : "off"}`, { icon: "check", variant: "success", duration: 2000 });
                }}
              />
            </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Theme</div>
                <div className="text-xs text-muted-foreground">Choose your preferred appearance.</div>
              </div>
              <Segmented
                ariaLabel="Theme"
                value={(settings.theme ?? "system") as "system" | "light" | "dark"}
                onChange={(v) => {
                  setTheme(v as "system" | "light" | "dark");
                  const label = v === "system" ? "System" : v === "light" ? "Light" : "Dark";
                  toast(`Theme: ${label}`, { icon: "check", variant: "success", duration: 2000 });
                }}
                options={[
                  { value: "system", label: "System" },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
            <Card className="p-5 shadow-md border-border/60 card-gradient card-hover-lift texture-overlay overflow-hidden space-y-4">
              <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Widgets & Features</div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { key: "focusTimer", label: "Focus Timer" },
                { key: "quickNotes", label: "Quick Notes" },
                { key: "dailyInspiration", label: "Daily Inspiration" },
                { key: "waterTracker", label: "Water Tracker" },
                { key: "priorityMatrix", label: "Priority Matrix" },
                { key: "quickActions", label: "Quick Actions Menu" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{label}</span>
                  <Toggle
                    checked={settings.features?.[key as keyof typeof settings.features] ?? false}
                    onChange={(v) => {
                      setFeatures({ ...settings.features, [key]: v });
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>

            <Card className="p-5 shadow-md border-border/60 card-gradient card-hover-lift texture-overlay overflow-hidden space-y-4">
              <div className="text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Passcode Lock</div>
            {settings.passcode ? (
              <div className="space-y-4">
                <div className="bg-background border border-border p-3 rounded-md text-sm text-muted-foreground flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Passcode is active. It is required to access the app.
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { setPasscode(undefined); setPassInput(""); setPassConfirm(""); setPassError(""); }}
                  className="w-full sm:w-auto"
                >
                  Disable Passcode
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full bg-background border border-input p-3 rounded-md text-foreground font-sans text-base focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-colors"
                  placeholder="New passcode"
                />
                <input
                  type="password"
                  value={passConfirm}
                  onChange={(e) => setPassConfirm(e.target.value)}
                  className="w-full bg-background border border-input p-3 rounded-md text-foreground font-sans text-base focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-colors"
                  placeholder="Confirm passcode"
                />
                {passError && <div className="text-xs text-destructive font-medium">{passError}</div>}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!passInput) {
                        setPassError("Enter a passcode.");
                        return;
                      }
                      if (passInput !== passConfirm) {
                        setPassError("Passcodes do not match.");
                        return;
                      }
                    setPasscode(passInput);
                    setPassInput("");
                    setPassConfirm("");
                    setPassError("");
                    toast("Passcode set.", { icon: "check", variant: "success", duration: 2000 });
                  }}
                  variant="outline"
                >
                  Set Passcode
                </Button>
              </div>
            </div>
          )}
          </Card>

            <Card className="p-5 shadow-md border-border/60 card-gradient card-hover-lift texture-overlay overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1 text-xs font-sans font-extrabold uppercase tracking-widest gradient-text select-none">Data Management</div>
                <div className="text-xs text-muted-foreground">Export or import your history.</div>
              </div>
              <div className="flex gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="bg-accent text-accent-foreground px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                      <Download size={14} /> Export
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Data</DialogTitle>
                      <DialogDescription>
                        Copy this JSON to save your history.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="relative">
                      <textarea
                        readOnly
                        className="w-full h-40 border rounded px-3 py-2 bg-card text-sm font-mono leading-snug focus:ring-2 focus:ring-ring focus:border-ring"
                        value={JSON.stringify(JSON.parse(doExport()), null, 2)}
                      />
                </div>
                <DialogFooter>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(doExport());
                            toast("Copied export to clipboard", { icon: "clipboard", variant: "success" });
                          } catch {}
                        }}
                      >
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          const blob = new Blob([doExport()], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "attihc.json";
                          a.click();
                          URL.revokeObjectURL(url);
                          toast("Downloaded attihc.json", { icon: "check", variant: "success" });
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={importOpen} onOpenChange={(v) => { setImportOpen(v); if (!v) { setImportError(""); } }}>
              <DialogTrigger asChild>
                <button type="button" className="bg-muted text-muted-foreground px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Download size={14} /> Import
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Data</DialogTitle>
                  <DialogDescription>Paste a JSON backup to restore your entries.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <textarea
                    className="w-full h-40 border rounded px-3 py-2 bg-card text-sm font-mono leading-snug focus:ring-2 focus:ring-ring focus:border-ring"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste exported JSON here"
                  />
                  {importError && <div className="text-xs text-destructive">{importError}</div>}
                </div>
                <DialogFooter>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => {
                          const ok = doImport(importText.trim());
                          if (!ok) {
                            setImportError("Import failed. Check that this is valid ATTIHC JSON.");
                            toast("Import failed", { icon: "alert", variant: "destructive" });
                          } else {
                            setImportError("");
                            setImportOpen(false);
                            toast("Imported entries", { icon: "check", variant: "success" });
                          }
                        }}
                      >
                        Import
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Import</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImportText("");
                          setImportError("");
                        }}
                      >
                        Clear
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear</TooltipContent>
                  </Tooltip>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogTrigger asChild>
                <button type="button" className="bg-destructive text-destructive-foreground px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Trash size={14} /> Clear
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear all history?</DialogTitle>
                  <DialogDescription>
                    This deletes all local entries on this device. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      clearAll();
                      setConfirmOpen(false);
                      toast("Deleted all history", { icon: "alert", variant: "destructive" });
                    }}
                  >
                    <Trash size={16} className="mr-2" />
                    Delete history
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
