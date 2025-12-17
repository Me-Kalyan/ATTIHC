"use client"

import { DayEntry } from "@/types";
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Settings as SettingsIcon, Home, Download, Upload, Clock } from "lucide-react"
import { useAttihc } from "@/hooks/use-attihc"

type Item = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  group?: string
}

export default function CommandPalette() {
  const router = useRouter()
  const { history } = useAttihc()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [active, setActive] = useState(0)

  const items: Item[] = useMemo(
    () => {
      const base: Item[] = [
        { id: "today", label: "Go to Today", icon: Home, action: () => router.push("/today"), group: "Navigation" },
        { id: "history", label: "Open History", icon: Calendar, action: () => router.push("/history"), group: "Navigation" },
        { id: "settings", label: "Open Settings", icon: SettingsIcon, action: () => router.push("/settings"), group: "Navigation" },
        { id: "export", label: "Export JSON", icon: Download, action: () => router.push("/settings?open=export"), group: "Actions" },
        { id: "import", label: "Import JSON", icon: Upload, action: () => router.push("/settings?open=import"), group: "Actions" },
      ];
      
      const recent = history.slice(0, 3).map((day: DayEntry) => ({
        id: `day-${day.date}`,
        label: `Open ${day.date} ${day.focus ? `(${day.focus})` : ''}`,
        icon: Clock,
        action: () => router.push(`/history?date=${day.date}`),
        group: "Recent"
      }));

      return [...base, ...recent];
    },
    [router, history]
  )

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((i) => i.label.toLowerCase().includes(s))
  }, [items, q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    setActive(0)
  }, [q, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="size-4" /> Command
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, filtered.length - 1))
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, 0))
              } else if (e.key === "Enter") {
                e.preventDefault()
                const target = filtered[active]
                if (target) {
                  target.action()
                  setOpen(false)
                }
              }
            }}
            className="w-full border rounded px-3 py-2 bg-card focus:ring-2 focus:ring-ring focus:border-ring"
            placeholder="Type a command..."
          />
          <div className="mt-3 space-y-2">
            {filtered.map((i, idx) => {
              const Icon = i.icon
              const isActive = idx === active
              return (
                <Button
                  key={i.id}
                  variant={isActive ? "outline" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    i.action()
                    setOpen(false)
                  }}
                >
                  <Icon className="mr-2 size-4" />
                  {i.label}
                </Button>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground px-1">No matches</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
