# Raga-AI — Best Practices, Performance & Complex Tasks

> A senior-engineering-level breakdown of every meaningful pattern, optimization, and complex implementation in the codebase.

---

## Part 1 — Best Practices

### 1.1 Typed Discriminated Union for Cross-Frame Messaging

**Where:** `packages/shared-types/src/bridge.ts`

Instead of sending plain strings or loosely typed objects over `postMessage`, every message is modeled as a **TypeScript discriminated union**:

```typescript
// Each message shape is its own interface
interface AuthTokenReadyMessage {
  type: 'AUTH_TOKEN_READY'
  payload: { token: string; user: User }
}
interface AuthSignedOutMessage {
  type: 'AUTH_SIGNED_OUT'
  payload?: never       // ← `never` prevents accidental payload access
}
interface NavigateMessage {
  type: 'NAVIGATE'
  payload: { path: string }
}

// Union — the `type` field is the discriminant
export type BridgeMessage =
  | AuthTokenReadyMessage
  | AuthSignedOutMessage
  | NavigateMessage
  | NotificationPushMessage
  | MFEReadyMessage
```

**Why it matters:**
- TypeScript narrows `payload` automatically inside a `switch(msg.type)` block
- You cannot accidentally read `msg.payload.token` when `type === 'AUTH_SIGNED_OUT'` — the compiler rejects it
- Adding a new message type forces every `switch` statement to handle it (if `noImplicitReturns` is on)
- Acts as a **contract** between Shell and MFEs — both sides import from the same package

---

### 1.2 useCallback + useRef for Stable Closure References

**Where:** `apps/shell/src/hooks/useMFEBridge.ts`, `AuthContext.tsx`

Event handlers registered on `window` must be stable. Using an inline function inside `useEffect` would create a new handler reference on every render and accumulate duplicate listeners.

```typescript
// ✅ Stable reference via useCallback
const broadcastAuth = useCallback(async () => {
  const u = userRef.current   // ← always reads latest user
  if (!u) return
  const token = await getIdToken()
  postTo(patientsRef, { type: 'AUTH_TOKEN_READY', payload: { token, user: u } }, PATIENTS_ORIGIN)
}, [patientsRef, analyticsRef])
```

The pattern `useRef(user)` + `useEffect(() => { userRef.current = user }, [user])` is the canonical solution for accessing the *latest* value of a state variable inside a `useCallback` that cannot list that state as a dependency (because doing so would recreate the callback and re-register the listener on every auth state change).

---

### 1.3 Single Source of Truth for Domain Types

**Where:** `packages/shared-types/src/index.ts`

All entities (`User`, `Patient`, `Appointment`, `Notification`, `AnalyticsData`, etc.) are defined exactly once and imported by all three apps. This enforces:

- **No type drift** — if `Patient.status` changes from `string` to `PatientStatus`, every consumer fails at compile time, not runtime
- **Shared vocabulary** — developers across MFEs speak the same language
- **Bridge safety** — `BridgeMessage` uses `User` and `Notification` directly, so the types flowing over postMessage are the same as the types rendered in components

---

### 1.4 Guard Hooks with Descriptive Errors

**Where:** `useAuth`, `useNotifications`, `usePatients`, `useAnalytics`

Each context exports a hook that throws if used outside its provider:

```typescript
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
```

**Why it matters:** Without this guard, consuming the hook outside its provider returns `null` and causes a cryptic runtime error somewhere deep in the render tree. The descriptive `throw` immediately points to the root cause during development.

---

### 1.5 Environment-Driven MFE Configuration

**Where:** `apps/shell/src/config/mfe.ts`

All MFE URLs and origins are computed from environment variables with local fallbacks:

```typescript
export const MFE_ORIGINS = {
  ANALYTICS: new URL(import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5175').origin,
  PATIENTS:  new URL(import.meta.env.VITE_PATIENTS_URL  || 'http://localhost:5174').origin,
}
export const ALLOWED_MFE_ORIGINS = new Set([MFE_ORIGINS.ANALYTICS, MFE_ORIGINS.PATIENTS])
```

- Developers get working defaults with zero `.env` setup
- Production deployments override via Vercel environment variables
- The origin whitelist is derived programmatically — no chance of it drifting out of sync with the URL config
- A single `mfe.ts` file is the one place to update when adding a new MFE origin

---

### 1.6 Graceful Firebase Double-Init Protection

**Where:** `apps/shell/src/services/firebase.ts`

```typescript
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
```

Vite's Hot Module Replacement re-executes module code on file saves. Without this guard, every save during development would throw `Firebase: Error (app/duplicate-app)`. The pattern checks whether Firebase is already initialized before calling `initializeApp`.

---

### 1.7 Promise.allSettled for Resilient Cache Priming

**Where:** `apps/shell/src/workers/sw-custom.ts`

```typescript
await Promise.allSettled(
  SHELL_ASSETS.map(url => cache.add(url).catch(() => {}))
)
```

`Promise.all` short-circuits on the first rejection — one missing asset aborts the entire Service Worker install, leaving users without any offline support. `Promise.allSettled` collects all results (fulfilled or rejected) and continues regardless, ensuring partial cache success is better than total failure.

---

### 1.8 Notification Deduplication + Memory Bounding

**Where:** `apps/shell/src/context/NotificationContext.tsx`

```typescript
const addNotification = useCallback((partial) => {
  const n: Notification = { ...partial, id: makeId(), timestamp: new Date().toISOString(), read: false }
  setNotifications(prev => {
    const next = [n, ...prev].slice(0, 100)   // ← cap at 100
    return next
  })
  fireNativePush(n)
}, [])
```

Two safety properties in one function:
1. **Stable IDs** — `makeId()` generates `notif_${Date.now()}_${randomStr}`, making IDs unique even under rapid-fire conditions
2. **Bounded array** — `.slice(0, 100)` prevents the notification array from growing indefinitely if push events arrive faster than the user reads them

---

### 1.9 Consistent Folder Structure Across All Apps

Every app follows the same layout:

```
src/
├── context/      ← State management (one context per domain)
├── hooks/        ← Custom hooks (no business logic in components)
├── pages/        ← Route-level components only
│   └── Feature/  ← Feature sub-components grouped by feature, not type
├── routes/       ← Router definition + guards
└── services/     ← Third-party integrations (Firebase, etc.)
```

This means a developer familiar with `apps/shell` can immediately navigate `apps/patients` without reading documentation.

---

### 1.10 localStorage with Type Safety and JSON Handling

**Where:** `apps/shell/src/hooks/useLocalStorage.ts`, used in `PatientsPage.tsx`

```typescript
const [storedView, setStoredView] = useLocalStorage<ViewMode>('healthos:patients:viewMode', 'list')
const [pageSize, setPageSize]     = useLocalStorage('healthos:patients:pageSize', 20)
```

The generic `useLocalStorage<T>` hook:
- Serializes values to JSON on write
- Deserializes on read with a try/catch to handle corrupted values gracefully
- Returns the default value if the key doesn't exist
- Namespaces keys with `healthos:` prefix to avoid collisions with other apps on the same origin

---

## Part 2 — Performance Deep Dive

### 2.1 Route-Level Code Splitting — Measured Impact

**Where:** `apps/shell/src/routes/AppRouter.tsx`

```typescript
const LoginPage      = lazy(() => import('../pages/Auth/LoginPage'))        // ~13 KB
const SignupPage     = lazy(() => import('../pages/Auth/SignupPage'))        // ~9 KB
const AppLayout      = lazy(() => import('../components/layout/AppLayout'))
const DashboardEmbed = lazy(() => import('../pages/DashboardEmbed'))        // tiny (just iframe)
const AnalyticsEmbed = lazy(() => import('../pages/AnalyticsEmbed'))        // tiny
const PatientsEmbed  = lazy(() => import('../pages/PatientsEmbed'))         // tiny
```

**What happens at runtime:**
1. Browser downloads only the shell bootstrap JS (~50 KB)
2. On first navigation to `/login`, Vite's dynamic import fetches the `LoginPage` chunk
3. If the user never visits `/analytics`, that chunk is never downloaded
4. All embed pages are tiny (they render an `<iframe>` with a URL) — their chunks load instantly

**Suspense skeleton during chunk download:**
```tsx
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full h-full">
      <Skeleton height="2.5rem" width="40%" rounded="lg" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height="6rem" rounded="lg" />
        ))}
      </div>
      <Skeleton height="24rem" rounded="lg" />
    </div>
  )
}
```
The skeleton mirrors the layout of the arriving content, eliminating Cumulative Layout Shift (CLS).

---

### 2.2 Derived State with useMemo — Avoiding Re-Filter Cascades

**Where:** `apps/patients/src/context/PatientContext.tsx`

```typescript
const filtered = useMemo(() => {
  let list = patients

  // 1. Status filter (O(n) linear scan)
  if (statusFilter !== 'all') {
    list = list.filter(p => p.status === statusFilter)
  }

  // 2. Full-text search (O(n) linear scan)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.id.toLowerCase().includes(q)
    )
  }

  return list
}, [patients, statusFilter, searchQuery])
```

**Without useMemo:** Every render of any component that consumes `PatientContext` (even unrelated renders triggered by notification count changes) would re-scan the entire 30-patient array and string-match every field.

**With useMemo:** Re-filtering only occurs when `patients`, `statusFilter`, or `searchQuery` actually change. The result is cached and reused for all other renders.

---

### 2.3 Debounce — Preventing Keystroke Flooding

**Where:** `apps/patients/src/pages/Patients/PatientsPage.tsx`

```
User types "John"  →  j → jo → joh → john  (4 keystrokes)

Without debounce:  4 × useMemo recalculations, 4 × re-renders of PatientTable/PatientGrid
With 300ms debounce: 1 recalculation, 1 re-render (after 300ms idle)
```

```typescript
const [searchInput, setSearchInput] = useState('')
const debouncedSearch = useDebounce(searchInput, 300)

// Only syncs to context (triggers the useMemo) after 300ms idle
useMemo(() => {
  setSearch(debouncedSearch)
}, [debouncedSearch, setSearch])
```

The input field (`searchInput`) updates on every keystroke for instant visual feedback. Only the debounced value (`debouncedSearch`) propagates to the context and triggers the expensive filter operation.

---

### 2.4 Parallel Data Fetching — Eliminating Sequential Waterfalls

**Where:** `apps/analytics/src/context/AnalyticsContext.tsx` and `DashboardPage.tsx`

**Anti-pattern (sequential waterfall):**
```typescript
// Total time = 300ms + 600ms = 900ms
const kpis      = await getDashboardKPIs()   // 300ms
const analytics = await getAnalytics()        // 600ms
```

**Pattern used (parallel):**
```typescript
// Total time = max(300ms, 600ms) = 600ms  — saves 300ms
const [kpiData, analytics] = await Promise.all([getDashboardKPIs(), getAnalytics()])
```

Dashboard page also independently fetches appointments and activity feed in parallel with the context's KPI/analytics fetch, ensuring all four data sources load concurrently.

---

### 2.5 Pagination — Limiting DOM Node Count

**Where:** `apps/patients/src/pages/Patients/PatientsPage.tsx`

```typescript
const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
const safePage   = Math.min(page, totalPages)   // clamp to valid range
const pageSlice  = displayed.slice((safePage - 1) * pageSize, safePage * pageSize)
```

With 30 patients and `pageSize = 10`, only 10 `<tr>` or card DOM nodes are rendered at a time. In a production system with 10,000 patients, this becomes critical — rendering 10,000 rows would freeze the browser's layout engine.

**Smart ellipsis pagination:**
```typescript
function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7)           return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4)         return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
```
Always shows at most 7 page number elements, regardless of total page count.

---

### 2.6 Workbox Runtime Caching — Tiered Strategy

**Where:** `apps/shell/vite.config.ts`

The Service Worker applies different caching logic depending on the resource type:

```
Request lifecycle for each resource category:

[Google Fonts]       → Cache-first → Serve from cache; update in background (1 year TTL)
[Static Images]      → Cache-first → Serve from cache; update in background (30 day TTL)
[API Calls]          → Network-first → Try network (10s timeout) → fall back to cache (5 min TTL)
[Firebase Auth]      → Network-first → Try network (10s timeout) → fall back to cache
[MFE Iframes]        → Stale-while-revalidate → Serve stale immediately; fetch fresh in background
[Same-origin assets] → Network-first → Custom SW handler → cache on success; serve cached on failure
```

This means:
- Font/image-heavy pages load instantly from cache on repeat visits
- API data is always fresh if the network is available, but works offline with slightly stale data
- The shell itself is always served even without a network connection

---

### 2.7 Skeleton Loading — Eliminating Layout Shift

Every async boundary has a skeleton that geometrically matches the arriving content:

```
Dashboard loading skeleton:
┌────────────────────────────────────────┐
│ ████████████████ (title skeleton)      │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  │  │  ← 4 SkeletonCards matching KPI grid
│ └──────┘ └──────┘ └──────┘ └──────┘  │
│ ┌────────────────────┐ ┌──────────┐  │
│ │  Appointments      │ │ Activity │  │  ← 2/3 + 1/3 layout matching content
│ └────────────────────┘ └──────────┘  │
│ ┌────────────────────────────────────┐│
│ │     Trend Chart skeleton           ││  ← Full-width card
│ └────────────────────────────────────┘│
└────────────────────────────────────────┘
```

When data arrives, the skeleton is replaced by content at the same positions — zero layout shift, no "pop" effect.

---

## Part 3 — Complex Tasks Dissected

### 3.1 The MFE Auth Handshake (Most Complex Flow)

This is the most architecturally nuanced feature in the system. Here is the full sequence:

```
TIMELINE:

t=0    User logs in on Shell
       ↓
t=1    Firebase onAuthStateChanged fires in AuthContext
       AuthContext.setUser(user)
       AuthContext calls broadcastAuth(user)
       ↓
t=2    broadcastAuth() fetches Firebase JWT via getIdToken()
       Posts AUTH_TOKEN_READY to patientsRef.current (iframe DOM node)
       Posts AUTH_TOKEN_READY to analyticsRef.current (iframe DOM node)
       ↓
t=3    [Meanwhile, MFE loads]
       PatientContext (inside patients iframe) fires MFE_READY to window.parent
       Shell's window.addEventListener('message') receives MFE_READY
       useMFEBridge handler calls broadcastAuth() again → sends token to freshly loaded MFE
       ↓
t=4    PatientContext receives AUTH_TOKEN_READY
       setIsAuthed(true)
       ↓
t=5    useEffect([isAuthed]) fires
       fetchPatients() called
       Patients rendered
```

**Why two broadcast points?**

There is a race condition: the MFE might finish loading *after* the Shell has already broadcast `AUTH_TOKEN_READY`. The Shell handles this by:
1. Broadcasting when auth state changes (Shell-initiated)
2. Also broadcasting when it receives `MFE_READY` (MFE-initiated)

This ensures the MFE gets the token regardless of whether it loaded before or after the auth event.

---

### 3.2 Push Notification Lifecycle (End-to-End)

```
[1] simulatePush() starts setInterval(30s)
    ↓
[2] fireRandomNotification() picks a mock clinical alert
    ↓
[3] sendToServiceWorker(payload) posts '__SIMULATE_PUSH__' to SW via postMessage
    ↓
[4] Service Worker receives message:
    sw.addEventListener('message', event => {
      if (event.data?.type !== '__SIMULATE_PUSH__') return
      event.waitUntil(sw.registration.showNotification(title, options))
    })
    ↓
[5] OS shows native push notification (appears in notification tray, even if tab is minimized)
    ↓
[6] User clicks notification action "View Patient"
    ↓
[7] sw.addEventListener('notificationclick') fires:
    • Finds existing app window in sw.clients.matchAll()
    • client.focus() + client.postMessage({ type: 'NAVIGATE', payload: { path: '/patients/p009' } })
    ↓
[8] Shell's window message listener receives NAVIGATE
    • useMFEBridge handler calls navigate('/patients/p009')
    ↓
[9] React Router renders PatientsEmbed at /patients/p009
    ↓
[10] Patients MFE (inside iframe) receives the new shell URL context
     Renders PatientDetailPage for patient p009
```

**Key insight:** The Service Worker lives outside the React app. It communicates back *into* the app via `client.postMessage()`, which the Shell's `window.addEventListener('message')` picks up. The entire notification-to-navigation pipeline spans: `setInterval → SW message → OS notification → SW notificationclick → client.postMessage → React Router`.

---

### 3.3 Offline Service Worker Fetch Handling

The custom SW fetch handler implements a **network-first with graceful degradation** pattern:

```typescript
sw.addEventListener('fetch', (event: FetchEvent) => {
  // Gate 1: only handle GET (never intercept mutations)
  if (event.request.method !== 'GET') return

  // Gate 2: only same-origin (let cross-origin go through unmodified)
  const url = new URL(event.request.url)
  if (url.origin !== sw.location.origin) return

  // Gate 3: never intercept Vite dev internals
  if (url.pathname.startsWith('/@vite/') || ...) return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          // Clone response — a Response can only be consumed once
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(async () => {
        // Waterfall: cache → offline page → 503
        const cached = await caches.match(event.request)
        if (cached) return cached
        if (event.request.mode === 'navigate') {
          const offline = await caches.match(OFFLINE_URL)
          if (offline) return offline
        }
        return new Response('Service unavailable', { status: 503 })
      })
  )
})
```

Three implementation subtleties:
1. **Response cloning** — `response.clone()` is necessary because `Response` is a stream and can only be read once. The original goes to the browser, the clone goes to the cache.
2. **Three gate checks** — Without these, the SW intercepts Vite HMR websocket upgrade requests and Firebase calls, breaking development and authentication.
3. **Navigate mode** — `event.request.mode === 'navigate'` specifically catches browser navigation (typing a URL, clicking a link) vs resource fetches, ensuring the offline page only appears for page loads.

---

### 3.4 Multi-Layer Patient Filtering Pipeline

The filtering pipeline in `PatientsPage.tsx` has three independent layers that compose:

```
Raw patients array (PatientContext — fetched from mock-api)
        ↓
[ Layer 1: Status filter ]  ← set via context (persisted via statusFilter state)
  e.g. filter(p => p.status === 'critical')
        ↓
[ Layer 2: Full-text search ] ← debounced 300ms (persisted via searchQuery state)
  e.g. filter(p => p.name.includes('john') || p.email.includes('john') || ...)
  → Result: `filtered` (computed in PatientContext via useMemo)
        ↓
[ Layer 3: Department filter ] ← local to PatientsPage (not in context)
  e.g. filter(p => p.department === 'Cardiology')
  → Result: `displayed`
        ↓
[ Pagination slice ]
  displayed.slice((page - 1) * pageSize, page * pageSize)
  → Result: `pageSlice` (what actually renders)
```

**Design decision:** Layer 3 (department) is kept *local* to `PatientsPage` rather than in context because it's purely a UI concern — no other component needs it. This avoids polluting the context with UI-only state.

**Page reset on filter change:**
```typescript
useMemo(() => {
  setPage(1)
}, [debouncedSearch, statusFilter, deptFilter])
```
Whenever any filter changes, the page resets to 1. Without this, a user on page 5 of a 30-patient list could filter to 3 patients and see an empty page (since page 5 of 3 results doesn't exist).

---

### 3.5 Smart Pagination Ellipsis Algorithm

```typescript
function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
```

**Trace through all cases (total = 20):**

| Current Page | Output |
|---|---|
| 1 | `1 2 3 4 5 … 20` |
| 4 | `1 2 3 4 5 … 20` |
| 5 | `1 … 4 5 6 … 20` |
| 10 | `1 … 9 10 11 … 20` |
| 16 | `1 … 15 16 17 18 19 20` |
| 17 | `1 … 15 16 17 18 19 20` |

Always exactly 7 elements — never causes layout shift in the pagination bar.

---

### 3.6 Analytics Date Range + Data Slicing

**Context layer:** `AnalyticsContext` stores `dateRange: { from: string, to: string }` and calls `refetch()` when it changes.

**Page layer:** `AnalyticsPage` maps UI presets to date ranges and slices mock data:

```typescript
const slicedData = useMemo(() => {
  if (!analyticsData) return null
  const months = preset === '7d' ? 1 : preset === '30d' ? 3 : preset === '90d' ? 6 : 12
  return {
    ...analyticsData,
    admissionsTrend: analyticsData.admissionsTrend.slice(-months),
    revenueData:     analyticsData.revenueData.slice(-months),
  }
}, [analyticsData, preset])
```

**Architecture insight:** The data slicing happens in the *page* component, not the context. This is intentional:
- The context holds the full dataset (fetched once per date range change)
- The page derives the visual subset using `useMemo` without network round-trips
- Switching between `7d` → `30d` → `90d` presets re-slices the in-memory data instantly

For a real API, the `dateRange` from the context would be sent as query parameters: `GET /api/analytics?from=2025-01-01&to=2025-04-26`.

---

### 3.7 NavigationBridge — Keeping Two Routers in Sync

**Problem:** The Shell has its own React Router at the top level. The Patients MFE has its own React Router inside the iframe. When a user clicks a patient card inside the MFE, the MFE's router navigates to `/:id` — but the Shell's URL bar still shows `/patients`.

**Solution — `NavigationBridge` component:**

```typescript
function NavigationBridge() {
  const { pathname } = useLocation()   // MFE's internal router location

  useEffect(() => {
    if (pathname === '/') return   // list route — Shell already shows /patients

    // Detail route — tell Shell to push /patients/:id to its history
    postToShell({
      type: 'NAVIGATE',
      payload: { path: `/patients${pathname}` },
    })
  }, [pathname])

  return null   // renders nothing — pure side-effect component
}
```

**Why `return null`?** `NavigationBridge` is a **headless component** — it exists only to run effects in response to the MFE router's location changes. It has no visual output.

**The full sync chain:**
```
MFE router navigates to /:p001
  → NavigationBridge useEffect fires
  → postToShell({ type: 'NAVIGATE', payload: { path: '/patients/p001' } })
  → Shell window.addEventListener('message') receives it
  → useMFEBridge switch case 'NAVIGATE'
  → navigate('/patients/p001')
  → Shell's React Router updates URL
  → Browser history API records /patients/p001
  → User can press Back button → Shell navigates to /patients → iframe shows list
```

---

## Part 4 — What to Do Next (Improvement Roadmap)

| Priority | Task | Why |
|----------|------|-----|
| 🔴 High | Add `title` attribute to all MFE `<iframe>` elements | WCAG 2.1 compliance for screen readers |
| 🔴 High | Implement JWT refresh broadcast in Shell (on Firebase `tokenRefreshed` event) | Sessions > 1 hour will silently use expired tokens in MFEs |
| 🟡 Medium | Add Playwright E2E tests for the Shell ↔ MFE postMessage flow | Critical paths currently have no integration-level coverage |
| 🟡 Medium | Implement `stopSimulation()` cleanup when notification permission is revoked | `simulatePush()` currently runs forever with no cleanup |
| 🟡 Medium | Replace `role: 'doctor'` hardcode with Firestore custom claims | Multi-role support is blocked on this |
| 🟢 Low | Add `React.memo` to `PatientTable` and `PatientGrid` rows | Row components re-render on any parent state change even when props haven't changed |
| 🟢 Low | Virtualise long patient lists with `@tanstack/virtual` | For production-scale datasets (1000+ patients), DOM virtualization is necessary |
| 🟢 Low | Add `aria-live` region for notification toasts | Screen readers need programmatic announcement of new notifications |
