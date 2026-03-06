# Audit Report — Device Activity Tracker

**Date:** 2026-02-27  
**Auditor:** Copilot Coding Agent  
**Scope:** Full repository audit covering architecture, security, code quality, and testing.

---

## 1. Structural Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Duplicate `TrackerLogger` class in `tracker.ts` and `signal-tracker.ts` | Medium | ✅ Fixed — extracted to `src/shared/logger.ts` |
| Duplicate `DeviceMetrics` interface in both tracker files | Medium | ✅ Fixed — extracted to `src/shared/types.ts` |
| Duplicate `ProbeMethod` type exported from both tracker files | Low | ✅ Fixed — canonical definition in `src/shared/types.ts` |
| Duplicate median calculation (`calculateGlobalMedian`) in both trackers | Medium | ✅ Fixed — extracted to `src/shared/metrics.ts` |
| Duplicate state determination logic in both trackers | Medium | ✅ Fixed — shared `determineState()`, `addRttMeasurement()`, `calculateMovingAverage()` in `src/shared/metrics.ts` |
| Duplicate `Platform`, `TrackerData`, `DeviceInfo` types across frontend components | Low | ✅ Fixed — extracted to `client/src/types/index.ts` |
| Unused `getSignalQrLinkUrl` export in `signal-tracker.ts` | Low | ✅ Fixed — removed |
| Unused `jidNormalizedUser` import in `tracker.ts` | Low | ✅ Fixed — removed |
| No barrel export for shared modules | Low | ✅ Fixed — added `src/shared/index.ts` |

## 2. Security Issues

| Issue | Severity | Status |
|-------|----------|--------|
| CORS wildcard `origin: "*"` hardcoded in `server.ts` | High | ✅ Fixed — now configurable via `CORS_ORIGIN` env var |
| Pino logger level hardcoded to `'debug'` in production | Medium | ✅ Fixed — now `'warn'` in production, `'debug'` in development |
| No rate limiting on socket connections | Medium | ⚠️ Noted — recommend adding `express-rate-limit` or socket.io rate limiting middleware |
| No authentication on WebSocket connections | Medium | ⚠️ Noted — acceptable for local development PoC, but should be secured for any deployment |
| Auth state (`auth_info_baileys/`) excluded from git via `.gitignore` | N/A | ✅ Already handled |

## 3. Performance Issues

| Issue | Severity | Status |
|-------|----------|--------|
| RTT history arrays grow unbounded up to 2000 entries per device | Low | ✅ Already bounded — constants extracted to `src/shared/metrics.ts` for consistency |
| `setInterval` for Signal connection check runs every 5s indefinitely | Low | ⚠️ Noted — acceptable for this application's scope |

## 4. Code Quality Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Unused `pdf-parse` dependency in `package.json` | Low | ✅ Fixed — removed |
| Broken `App.test.tsx` testing for "learn react" (CRA scaffold remnant) | Medium | ✅ Fixed — now tests for "Activity Tracker" header |
| Pre-existing TypeScript error in `ContactCard.tsx` (`labelFormatter` type) | Medium | ✅ Fixed — changed to compatible type signature |
| Magic numbers (5000ms timeout, 2000 history, 0.9 threshold) scattered across files | Low | ✅ Fixed — extracted as named constants in `src/shared/metrics.ts` |
| `server.ts` contains mixed concerns (routing + business logic + WebSocket management) | Medium | ⚠️ Noted — recommend further extraction of socket handlers into separate module for larger codebases |
| `any` types used for socket data and Baileys types | Low | ⚠️ Noted — acceptable given third-party library constraints |

## 5. Refactoring Summary

### New Files Created
- `src/shared/types.ts` — Shared type definitions (`ProbeMethod`, `Platform`, `DeviceMetrics`, `DeviceInfo`, `TrackerUpdateData`)
- `src/shared/logger.ts` — Shared `TrackerLogger` class with prefix support
- `src/shared/metrics.ts` — Shared metrics calculation utilities (`calculateMedian`, `calculateMovingAverage`, `addRttMeasurement`, `createDeviceMetrics`, `determineState`)
- `src/shared/index.ts` — Barrel export for shared modules
- `client/src/types/index.ts` — Shared frontend type definitions

### Files Modified
- `src/tracker.ts` — Uses shared modules, removed duplicate code (~80 lines removed)
- `src/signal-tracker.ts` — Uses shared modules, removed duplicate code (~70 lines removed), removed unused `getSignalQrLinkUrl`
- `src/server.ts` — Configurable CORS and log level, uses shared `Platform` type
- `client/src/App.tsx` — Uses shared types from `types/index.ts`
- `client/src/components/Dashboard.tsx` — Uses shared types
- `client/src/components/ContactCard.tsx` — Uses shared types, fixed TypeScript error
- `client/src/components/Login.tsx` — Uses shared types
- `client/src/App.test.tsx` — Fixed broken test
- `package.json` — Removed unused `pdf-parse` dependency
- `.env.example` — Added `CORS_ORIGIN` configuration

### Verification
- ✅ Backend TypeScript compilation passes (`tsc --noEmit`)
- ✅ Backend build passes (`npm run build`)
- ✅ Client build passes (`react-scripts build`)
- ✅ Client tests pass (`react-scripts test`)
- ✅ No circular dependencies introduced
- ✅ No broken imports
