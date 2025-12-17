"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, AlertCircleIcon, ClipboardIcon } from "lucide-react"

type ToastVariant = "default" | "destructive" | "success"

type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
  icon?: "check" | "alert" | "clipboard"
  duration?: number
}

const ToastContext = React.createContext<{
  toast: (message: string, options?: { variant?: ToastVariant; icon?: "check" | "alert" | "clipboard"; duration?: number }) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const nextId = React.useRef(1)

  const toast = React.useCallback(
    (message: string, options?: { variant?: ToastVariant; icon?: "check" | "alert" | "clipboard"; duration?: number }) => {
      const id = nextId.current++
      const variant = options?.variant ?? "default"
      const icon = options?.icon
      const duration = options?.duration ?? 2400
      const item: ToastItem = { id, message, variant, icon, duration }
      setItems((prev) => [...prev, item])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id))
      }, duration)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-60 flex flex-col items-center gap-2 px-4 py-6 sm:items-end sm:justify-end">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto bg-card text-card-foreground flex items-center gap-3 rounded-md border px-3 py-2 shadow-lg",
              t.variant === "destructive" && "border-destructive/40 text-destructive",
              t.variant === "success" && "border-[#6B705C]/40"
            )}
          >
            {t.icon === "check" && <CheckIcon className="size-4" />}
            {t.icon === "alert" && <AlertCircleIcon className="size-4" />}
            {t.icon === "clipboard" && <ClipboardIcon className="size-4" />}
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  return {
    toast: (message: string, options?: { variant?: ToastVariant; icon?: "check" | "alert" | "clipboard"; duration?: number }) => {
      if (ctx) ctx.toast(message, options)
    },
  }
}
