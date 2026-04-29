# Raga-AI — Non-Functional Analysis

> **How well the system does what it does — quality attributes, constraints, and engineering decisions.**

---

## 1. Performance

### 1.1 Bundle Size & Code Splitting
All route-level components are lazy-loaded via `React.lazy()`:
```typescript
const LoginPage     = lazy(() => import('../pages/Auth/LoginPage'))
const DashboardEmbed = lazy(() => import('../pages/DashboardEmbed'))
const PatientsEmbed  = lazy(() => import('../pages/PatientsEmbed'))
```
**Impact:** The initial JavaScript payload shipped to the browser contains only the shell, router, and context logic. Feature code (login form, charts, patient table) is deferred until the user navigates to that route.

### 1.2 Memoization
- `useMemo` is used in `PatientContext` to compute `filtered` (the derived patient list after search + status + department filters). This prevents re-filtering the entire dataset on every render unrelated to filter changes.
- `useCallback` wraps all context action functions (`login`, `logout`, `addNotification`, `fetchPatients`) to give them stable references, preventing unnecessary re-renders of consumer components.

### 1.3 Debounced Search
The patient search input uses a 300 ms debounce (`useDebounce` hook) before updating the context's search query. This prevents a filter recalculation and re-render on every keystroke.

```
User types "John" (4 keystrokes) → only 1 filter operation triggered after 300 ms idle
```

### 1.4 Parallel Data Fetching
The Analytics MFE fetches KPIs and chart data concurrently:
```typescript
const [kpiData, analytics] = await Promise.all([getDashboardKPIs(), getAnalytics()])
```
**Impact:** Reduces total load time from (KPI delay + analytics delay) to `max(KPI delay, analytics delay)`.

### 1.5 Workbox Caching Strategies
The PWA Service Worker applies differentiated caching per resource type:

| Resource Type | Strategy | Rationale |
|---|---|---|
| Google Fonts | Cache-first (1 year TTL) | Fonts never change |
| Static images | Cache-first (30 day TTL) | Rarely updated |
| API responses | Network-first (5 min TTL) | Must be fresh, but cached for resilience |
| Firebase Auth | Network-first | Security-sensitive |
| MFE origins | Stale-while-revalidate | Fast serve + background update |

### 1.6 Pagination
The patient list is paginated client-side with configurable page sizes (10 / 20 / 30 / 50). This limits the number of DOM nodes rendered at once, keeping scrolling and interaction smooth even with 500+ patient records.

### 1.7 Skeleton Loading States
Every async data boundary shows a matching skeleton UI:
- Shell routes show a `PageSkeleton` during lazy-load
- MFE pages show context-appropriate skeletons (`DashboardSkeleton`, `PatientsTableSkeleton`, `AnalyticsSkeleton`)
- This eliminates layout shift (CLS) and provides immediate visual feedback

---

## 2. Security

### 2.1 PostMessage Origin Validation
Every inbound message from an MFE iframe is validated against a whitelist:
```typescript
const ALLOWED_ORIGINS = new Set([MFE_ORIGINS.ANALYTICS, MFE_ORIGINS.PATIENTS])
if (!ALLOWED_ORIGINS.has(event.origin)) return // reject silently
```
**Threat mitigated:** A malicious third-party iframe or injected script cannot forge `AUTH_TOKEN_READY` or `NAVIGATE` messages.

### 2.2 Firebase JWT (Short-Lived Tokens)
Firebase ID Tokens expire in 1 hour by default. The `getIdToken()` call transparently refreshes the token if it has expired. MFEs receive short-lived tokens — even if intercepted, they become worthless quickly.

### 2.3 No Token Persistence in MFEs
The current implementation does **not** store the JWT in `localStorage` or `sessionStorage` within MFEs:
```typescript
// store token if you need it for real API calls later
// e.g. sessionStorage.setItem('token', msg.payload.token)
```
This is a deliberate design choice — the token stays in-memory only, reducing XSS attack surface.

### 2.4 Environment Variable Isolation
All sensitive Firebase config values (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.) are injected at build time from `.env` files. They are never hardcoded in source.

### 2.5 Auth Guard on All Protected Routes
`AuthGuard` wraps the entire protected route tree. No protected page renders without a valid Firebase user. The redirect also preserves the originally requested path for post-login redirect.

### 2.6 Friendly Error Mapping
Firebase error codes (`auth/user-not-found`, `auth/wrong-password`) are mapped to non-technical messages. This prevents information leakage about the authentication backend to end users.

---

## 3. Reliability & Error Handling

### 3.1 Error Boundaries
`<ErrorBoundary>` wraps the protected `<AppLayout>` at the shell level. If any MFE embed component throws a render error:
- The error is caught without crashing the entire app
- An error card is displayed with "Try again" (component reset) and "Reload page" options
- Error details are logged to console and optionally forwarded via the `onError` prop

### 3.2 Service Worker Install Resilience
During Service Worker install, shell assets are pre-cached using `Promise.allSettled()` instead of `Promise.all()`:
```typescript
await Promise.allSettled(SHELL_ASSETS.map(url => cache.add(url).catch(() => {})))
```
**Impact:** A single missing asset (e.g., `/offline.html` not yet created) does not abort the entire Service Worker installation.

### 3.3 Offline Fallback Chain
On network failure:
1. Try Service Worker cache
2. For navigation requests: serve `/offline.html`
3. Last resort: return a `503` response (rather than a silent failure)

### 3.4 MFE Loading Fallbacks
All route embeds use `<Suspense>` with skeleton fallbacks. If the MFE iframe takes time to load:
- The skeleton is shown immediately
- No blank white screen or layout flash

### 3.5 Firebase Double-Init Guard
```typescript
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
```
Prevents Firebase from throwing `app/duplicate-app` errors during Vite hot module replacement (HMR) in development.

### 3.6 Notification Cap
`NotificationContext` limits the notification array to 100 entries:
```typescript
const next = [n, ...prev].slice(0, 100)
```
Prevents unbounded memory growth from notification flooding.

---

## 4. Maintainability

### 4.1 Monorepo with Shared Packages
All cross-cutting concerns are extracted into dedicated packages:
- `@raga/shared-types` — Single source of truth for all data types and the postMessage contract
- `@raga/shared-ui` — Component library ensures UI consistency without duplication
- `@raga/mock-api` — Fake data layer can be swapped for a real HTTP client without touching MFE logic

Adding a new MFE only requires:
1. Creating `apps/<new-mfe>/`
2. Adding it to `pnpm-workspace.yaml`
3. Importing `@raga/shared-types` for bridge communication
4. Registering its origin in the Shell's `mfe.ts` config

### 4.2 Turborepo Build Pipeline
```json
{
  "build": { "dependsOn": ["^build"] }
}
```
The `^` prefix means "build all my dependencies first." This ensures `shared-types` and `shared-ui` are compiled before any app that consumes them — preventing stale type errors in CI/CD.

### 4.3 Single Source of Truth for Types
`packages/shared-types/src/index.ts` defines every domain entity once. Both the Shell and MFEs import from `@raga/shared-types`. A type change only needs to happen in one place, and TypeScript immediately flags all affected consumers.

### 4.4 Custom Hook Encapsulation
Complex logic is extracted into named hooks:
- `useMFEBridge` — all MFE communication logic in one place
- `useDebounce` — reusable debounce primitive
- `useLocalStorage` — type-safe localStorage with JSON serialization/deserialization
- `useAuth` / `useNotifications` — typed context accessors with guard errors

### 4.5 Consistent Code Organization
Every app follows the same folder structure:
```
src/
├── context/       ← React contexts
├── hooks/         ← Custom hooks
├── pages/         ← Route-level components
│   └── Feature/   ← Feature-specific sub-components
├── routes/        ← Router + guard
└── services/      ← External API/SDK integrations
```

---

## 5. Scalability

### 5.1 Independent MFE Deployability
Each MFE (`apps/shell`, `apps/analytics`, `apps/patients`) has its own:
- `package.json` with independent dependencies
- `vite.config.ts` with its own port and build output
- `vercel.json` for independent deployment configuration

A team can update the Patients MFE and deploy it without touching the Shell or Analytics MFE.

### 5.2 Adding New MFEs
The architecture supports adding new MFEs (e.g., Billing, Pharmacy, Lab Results) by:
1. Registering a new iframe in the Shell's config (`mfe.ts`)
2. Adding the new origin to `ALLOWED_MFE_ORIGINS`
3. Creating embed pages and routes in the Shell's router
4. The new MFE inherits the same auth broadcast flow automatically via `useMFEBridge`

### 5.3 Real API Migration Path
The `mock-api` package exports the same function signatures a real HTTP client would use. Replacing the mock with real API calls requires only changing `packages/mock-api/src/index.ts` — no changes to contexts, pages, or components.

### 5.4 Date-Filtered Analytics
`AnalyticsContext` tracks a `dateRange` state and calls `refetch()` on changes. When a real backend is connected, the date range can be passed as query parameters without any structural change to the MFE.

---

## 6. Testability

### 6.1 Jest + Testing Library Setup
- `jest-environment-jsdom` provides a DOM simulation environment
- `@testing-library/react` encourages testing from the user's perspective (by role, label, text) rather than implementation details
- `@testing-library/user-event` provides realistic user interaction simulation

### 6.2 Module Aliasing in Tests
`jest.config.cjs` maps all `@raga/*` workspace aliases so tests use the exact same import paths as production code:
```js
'^@raga/shared-ui$': '<rootDir>/packages/shared-ui/src'
```

### 6.3 CSS Module Mocking
CSS imports are intercepted by `identity-obj-proxy`, returning the class name string itself. This allows component tests to work without a CSS bundler.

### 6.4 Existing Test Coverage
Tests present in `packages/shared-ui/src/`:
- `Button.test.tsx` — renders variants, handles click, shows loading state, respects disabled
- `Badge.test.tsx` — renders correct label and color class per status
- `Avatar.test.tsx` — renders image when src given, falls back to initials

Tests present in `apps/shell/src/`:
- `App.test.tsx` — smoke test verifying the Shell root renders without crashing

### 6.5 Isolated Context Testing
Since contexts use the standard React Context API (not Redux), they can be tested by wrapping components in the provider directly in test files, with no special mocking infrastructure needed.

---

## 7. Developer Experience (DX)

### 7.1 Parallel Dev Server
```bash
pnpm run dev:all  # starts all 3 apps in parallel on ports 5173, 5174, 5175
```
`--parallel -r` runs the `dev` script recursively across all workspace packages simultaneously.

### 7.2 Hot Module Replacement (HMR)
Vite's HMR updates components in the browser without a full page reload. Firebase's double-init guard (`getApps().length ? getApp() : initializeApp(...)`) prevents HMR from breaking the Firebase connection.

### 7.3 TypeScript Strict Mode
All packages use TypeScript. `tsconfig.app.json` settings enforce strict null checks and type safety. The `BridgeMessage` discriminated union provides full autocomplete and type narrowing when handling postMessage events.

### 7.4 Prettier Formatting
`.prettierrc` enforces consistent formatting across the monorepo (single quotes, 2-space indent, 100-char print width, trailing commas).

### 7.5 Path Aliases
Both Vite (`resolve.alias`) and Jest (`moduleNameMapper`) resolve `@raga/shared-ui`, `@raga/shared-types`, and `@raga/mock-api` to local package sources — no npm publishing required during development.

---

## 8. Accessibility (A11y)

- Shared `Input` component supports `label` and `error` props for proper `<label>` / `aria-invalid` association
- `AuthGuard` shows a spinner with `label="Checking authentication…"` (screen-reader text)
- `Spinner` component includes an `aria-label`
- `ErrorBoundary` fallback uses semantic headings (`<h2>`) and descriptive button text
- Focus-visible styles are applied to preset buttons in `AnalyticsPage`
- All `disabled` button states include visual opacity reduction

**Current gaps:**
- MFEs embedded in `<iframe>` require `title` attributes for screen readers (not currently set)
- Color-only status distinctions (badge colors) should include ARIA roles or text labels for color-blind users

---

## 9. Deployment Model

Each app is independently deployable to Vercel (confirmed by `vercel.json` in each app):
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
This single-line config makes Vercel serve `index.html` for all routes, enabling client-side routing to function correctly.

**Production environment variables** (`VITE_FIREBASE_*`, `VITE_PATIENTS_URL`, `VITE_ANALYTICS_URL`) are configured per-deployment in the Vercel dashboard — not hardcoded.

---

## 10. Known Constraints & Technical Debt

| Area | Constraint | Notes |
|------|------------|-------|
| Auth propagation | MFE auth depends on Shell postMessage; if Shell tab is slow, MFE shows "Waiting for session…" | Acceptable for MVP — real systems use shared cookie or token store |
| Analytics date filter | Mock API slices static data client-side; no real backend filtering | Clearly commented as a stub for real API integration |
| User roles | Role is hardcoded to `'doctor'` on signup | Marked in code: "extend with Firestore claims later" |
| No token refresh in MFE | JWT is not refreshed after initial handshake in MFEs | For sessions > 1 hour, a re-broadcast on token refresh is needed |
| Push simulation runs forever | `simulatePush()` is never stopped in the current shell entry | Should be tied to notification permission grant + cleanup |
| iFrame `title` attributes | MFE iframes lack `title` attributes | Accessibility gap for screen readers |
| No E2E tests | Only unit tests exist | Playwright/Cypress tests would cover the full Shell–MFE postMessage flow |
