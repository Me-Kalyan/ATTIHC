"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAttihc } from "@/hooks/use-attihc"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { settings } = useAttihc()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      const update = () => setReducedMotion(mq.matches)
      update()
      mq.addEventListener?.("change", update)
      return () => mq.removeEventListener?.("change", update)
    }
  }, [])

  const disable = settings.quiet || reducedMotion
  const base = disable
    ? ""
    : "animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out will-change-[opacity,transform]"

  return (
    <div key={pathname} className={base}>
      {children}
    </div>
  )
}
