## Folder Alignment
- Adopt the proposed structure: `app/layout.tsx`, `app/page.tsx` (Landing), `app/today/page.tsx`, `app/history/page.tsx`, `app/manifest.ts`, `components/today/*`, `components/history/*`, `components/ui/*`, `lib/storage.ts`, `lib/utils.ts`, `styles/globals.css`.
- Keep ShadCN `cn` utility in `lib/utils.ts`; adjust imports to use `@/lib/utils` consistently.
- Ensure all client-only modules (`lib/storage.ts`, `components/today/*`, `components/history/*`) use `'use client'` where needed.

## Today UX (Phase 1)
- Replace hard `maxLength={140}` with soft validation: show a counter and error color past 140, no input enforcement.
- Autosize textareas; Enter → focus next card; Cmd/Ctrl+Enter → blur; add `Alt+1/Alt+2/Alt+3` keyboard shortcuts to focus cards.
- Add a mono date indicator under the “Today” title; update live when day rolls over.
- Keep `TodayCard` and `TodayContainer`; wire `onEnter` and `inputRef` plus soft-limit counter.

## Storage & Day Boundary (Phase 2)
- Extend `lib/storage.ts` to support reset time (`resetHour`) and compute current day with a helper (e.g., `currentDateString(resetHour)`).
- Guard `localStorage` with `typeof window !== 'undefined'` and only access from client components.
- Implement debounced saves (e.g., 300ms) to avoid excessive writes; flush on blur or visibility change.
- Provide `getToday()`, `saveToday()`, `getHistory()` using the computed current day; keep array storage for simplicity but ensure replace-by-date behavior.

## History View (Phase 3)
- Implement `components/history/HistoryDay.tsx` for a single day block.
- Collapsed by default; expand on click with a height-only animation (150–200ms) and `ChevronDown` affordance.
- Show date in JetBrains Mono with a small `Calendar` icon; entries are read-only.

## Settings (Phase 4)
- Add `app/settings/page.tsx`: controls for reset time (0–23 hours), export JSON (copy to clipboard + download `.json`), and clear all history (confirmation dialog).
- Persist `resetHour` to `localStorage` (e.g., `attihc:settings`), use it in day computation.

## Offline / PWA (Phase 5)
- Implement `app/manifest.ts` returning the manifest object (name, short_name, `start_url: '/today'`, theme/background colors, icons including maskable 192x192 and 512x512).
- Add a service worker (`public/sw.js`) with cache-first app shell and static assets; version cache for smooth updates.
- Register SW in a client component and include `<link rel="manifest" href="/manifest.webmanifest">` or rely on `app/manifest.ts` route.

## Visual & Aesthetic (Phase 6)
- Maintain calm brutalism: flat colors, print-like rhythm, no shadows/gradients.
- Index-card feel: white background, 1px border, generous spacing; optional thin inner rule at card top.
- Header: subtle active underline; icons minimal and 16px.

## Accessibility
- Associate labels with textareas; visible focus rings using accent color.
- Keyboard-only usable: shortcuts and focus states; `aria-expanded` on history toggles.

## Performance
- Memoize counter components; avoid rerenders across unrelated fields.
- Prefetch routes `/history` and `/settings`.

## Export & Clear
- Export: pretty JSON in a dialog with Copy and Download buttons; local-only.
- Clear: destructive button aligned to burnt umber color; confirmation.

## Print (Optional)
- Add `@media print` styling for three index cards to print cleanly (no decorative elements).

## Testing & Validation
- Lint + typecheck (`eslint`, `tsc`).
- Manual checks: keyboard flows, day rollover at `resetHour`, offline behavior, history collapse/expand, settings persistence.
- Optional unit tests: day computation, storage insert/update/get, counter behavior.

## Migration Notes
- Replace any direct hard limits and SSR-unsafe `localStorage` usage with client-safe soft validation and guards.
- Align styles to `styles/globals.css` and ensure tokens match palette (`#FAF9F7`, `#111111`, `#6B7280`, `#6B705C`, `#E5E7EB`, `#9A3412`).

Confirm this plan, and I’ll implement Phases 1–2 first, then proceed through History, Settings, PWA, and refinements.