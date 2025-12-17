# Troubleshooting Guide

This document records common error patterns, their root causes, and implemented solutions for the ATTIHC project.

## 1. React Server Component (RSC) Errors

### Symptoms
- `net::ERR_ABORTED` in browser console.
- Page navigation fails or hangs.
- Errors related to `RSC` payload decoding.
- Recurring logs showing network failures for requests with `_rsc` query parameters.

### Root Cause
The Service Worker (`public/sw.js`) was aggressively caching all network requests, including Next.js internal RSC payloads. When the application code changed (especially in development), the Service Worker served stale or invalid RSC data from the cache, causing the client-side router to fail.

### Solution
1.  **Service Worker Logic Update**: Modified `public/sw.js` to explicitly exclude requests containing the `_rsc` query parameter, as well as `/_next` and `/api` routes.
2.  **Dev Mode Safety**: Updated `src/components/sw-client.tsx` to automatically **unregister** any existing service workers when running in development mode.
3.  **Cache Versioning**: Incremented cache version (e.g., `attihc-v3`) to force invalidation of old caches.

### Verification
Run the automated test suite to verify the Service Worker exclusion logic:

```bash
npm run test:sw
```

## 2. Manifest File Conflict

### Symptoms
- 500 Internal Server Error when accessing `/manifest.webmanifest`.
- Build warnings about conflicting manifest files.

### Root Cause
Next.js 14+ generates a manifest file automatically from `src/app/manifest.ts`. The existence of a static `public/manifest.webmanifest` file caused a conflict.

### Solution
- Deleted `public/manifest.webmanifest`.
- Relied on `src/app/manifest.ts`.

## 3. Linter Errors (@theme / @apply)

### Symptoms
- VS Code showing warnings for unknown at-rules like `@theme` and `@apply`.

### Solution
- Updated `.vscode/settings.json` to ignore unknown at-rules (`"css.lint.unknownAtRules": "ignore"`).

## 4. Monitoring & Error Handling

### Structured Logger
A centralized logger is implemented in `src/lib/logger.ts`. It handles:
- **Development**: Pretty-printed console logs.
- **Production**: JSON-formatted logs suitable for aggregation (e.g., Datadog, CloudWatch).

Usage:
```typescript
import { logger } from "@/lib/logger";

logger.info("Something happened", { details: 123 });
logger.error("Something broke", error);
```

### Global Error Boundary
- Located at `src/app/error.tsx`.
- Catches unhandled React component errors.
- Logs errors using the structured `logger`.

### Service Worker Telemetry
- `src/components/sw-client.tsx` logs Service Worker lifecycle events (registration, unregistration) using the structured logger.
