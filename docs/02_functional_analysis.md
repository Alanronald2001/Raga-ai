# Raga-AI — Functional Analysis

> **What the system does — feature by feature, screen by screen.**

---

## 1. Authentication Module (`apps/shell`)

### 1.1 User Registration — `SignupPage.tsx`
- User submits email + password via a signup form
- Calls `createUserWithEmailAndPassword` (Firebase)
- On success, Firebase `onAuthStateChanged` fires → `AuthContext` sets `user` state
- Shell broadcasts `AUTH_TOKEN_READY` to all MFE iframes with the JWT + user object
- User is redirected to the protected dashboard

### 1.2 User Login — `LoginPage.tsx`
- User submits credentials to `signInWithEmailAndPassword`
- Auth state change triggers the same broadcast flow as registration
- Friendly error messages map Firebase error codes to readable strings:
  - `user-not-found` → "No account found with this email."
  - `wrong-password` → "Incorrect password."
  - `too-many-requests` → "Too many attempts. Try again later."

### 1.3 Route Protection — `AuthGuard.tsx`
- Every protected route (`/`, `/analytics`, `/patients`, `/patients/:id`) is wrapped in `<AuthGuard>`
- If `loading` is true → shows a full-screen spinner
- If `user` is null (not logged in) → redirects to `/login`, preserving the attempted path in `location.state`
- If `user` exists → renders the child route

### 1.4 Sign Out
- Calls Firebase `signOut()`
- `onAuthStateChanged` fires with `null` → `AuthContext` sets `user = null`
- Shell broadcasts `AUTH_SIGNED_OUT` to MFEs, which clear their data
- `AuthGuard` catches the null user and redirects to `/login`

---

## 2. Shell Navigation & Layout (`apps/shell`)

### 2.1 Application Router — `AppRouter.tsx`
The Shell defines these routes:

| Route | Component | Protection |
|-------|-----------|------------|
| `/login` | `LoginPage` | Public |
| `/signup` | `SignupPage` | Public |
| `/` | `DashboardEmbed` → Analytics MFE | Auth-guarded |
| `/analytics` | `AnalyticsEmbed` → Analytics MFE | Auth-guarded |
| `/patients` | `PatientsEmbed` → Patients MFE | Auth-guarded |
| `/patients/:id` | `PatientsEmbed` → Patients MFE | Auth-guarded |
| `*` | Redirect to `/` | Auth-guarded |

All protected routes are lazy-loaded using `React.lazy()` — the JS chunk is only downloaded when the user first navigates to that route.

### 2.2 MFE Embedding — `PatientsEmbed.tsx`, `AnalyticsEmbed.tsx`, `DashboardEmbed.tsx`
- Each embed renders the corresponding MFE inside an `<iframe>`
- The shell renders these pages, while the actual UI comes from the MFE's own Vite dev server
- The Shell passes no props into the iframe — all data transfer happens via postMessage

### 2.3 App Layout — `AppLayout`
- Wraps the entire protected area with a persistent sidebar/navbar layout
- Houses the notifications bell, user avatar, and primary navigation links

---

## 3. MFE Communication Bridge (`apps/shell`)

### 3.1 `useMFEBridge` Hook
This is the central communication orchestrator for the Shell:

**Outbound (Shell → MFE):**
- `broadcastAuth()` — Fetches a fresh Firebase JWT and posts `AUTH_TOKEN_READY` to both Patients and Analytics iframes
- `broadcastSignOut()` — Posts `AUTH_SIGNED_OUT` to both iframes
- `postToPatients(msg)` / `postToAnalytics(msg)` — Typed helpers for targeted messages

**Inbound (MFE → Shell):**
Handles three message types from trusted origins:
- `MFE_READY` → Immediately broadcasts current auth state to the newly-loaded MFE
- `NAVIGATE` → Calls React Router's `navigate(path)` to change the shell URL
- `NOTIFICATION_PUSH` → Adds a notification to the `NotificationContext` queue

**Security gate:** All inbound messages are rejected if `event.origin` is not in `ALLOWED_MFE_ORIGINS`.

**Auth re-broadcast:** Whenever `user` state in `AuthContext` changes (login / logout), `useMFEBridge` automatically re-broadcasts to all MFEs via a `useEffect` dependency on `user`.

---

## 4. Notification System (`apps/shell`)

### 4.1 In-App Notifications — `NotificationContext.tsx`
- Maintains an in-memory array of `Notification` objects (capped at 100)
- Each notification has: `id`, `type` (alert/info/success/warning), `title`, `message`, `read`, `timestamp`, optional `patientId`
- Actions: `addNotification`, `markAsRead`, `markAllAsRead`, `clearAll`, `requestPushPermission`
- Listens to `NOTIFICATION_PUSH` postMessages from MFE iframes
- Computes `unreadCount` as a derived value (no extra state needed)
- Fires native browser `Notification` API when permission is granted

### 4.2 Push Notification Simulation — `notificationService.ts`
Since there is no live backend push server, the system simulates push notifications:
- `simulatePush(intervalMs)` starts a `setInterval` (default 30 s)
- Picks a random entry from 8 hard-coded mock clinical alerts (BP spike, lab results, medication due, etc.)
- Posts the payload to the Service Worker via `navigator.serviceWorker.ready`
- Service Worker shows a native OS-level push notification with action buttons
- Falls back to in-page `Notification` API if Service Worker is unavailable

### 4.3 Service Worker Push Handling — `sw-custom.ts`
- Listens to the `push` event (real server push) and `__SIMULATE_PUSH__` message (simulation)
- Shows native OS notifications with dynamic action buttons based on notification type:
  - `alert` + `patientId` → "View Patient" + "Dismiss"
  - `warning` → "View" + "Dismiss"
  - Default → "Open" + "Dismiss"
- On notification click: focuses an existing app window and posts `NAVIGATE` to go to the patient's URL, or opens a new window if none exists

---

## 5. Patients MFE (`apps/patients`)

### 5.1 Auth Handshake
On mount, `PatientContext` does two things simultaneously:
1. Posts `MFE_READY` to `window.parent` → Shell responds with `AUTH_TOKEN_READY`
2. Subscribes to `onBridgeMessage` via the shared `bridge.ts` utility

On receiving `AUTH_TOKEN_READY`: sets `isAuthed = true` → triggers patient data fetch.
On `AUTH_SIGNED_OUT`: clears patients array, resets selection, sets `isAuthed = false`.

### 5.2 Patient List — `PatientsPage.tsx`
**Filters (all composable):**
- **Search**: debounced 300 ms — searches across name, department, email, phone, ID
- **Status filter**: All / Active / Stable / Critical / Discharged
- **Department filter**: Dynamically derived from the patient dataset

**View Modes (persisted in `localStorage`):**
- **List view** (`PatientTable.tsx`): Tabular layout with sortable columns — Name, Age, Gender, Status badge, Department, Last Visit, Actions
- **Grid view** (`PatientGrid.tsx`): Card layout — Avatar, name, status badge, vitals summary

**Pagination:**
- Page size options: 10 / 20 / 30 / 50 (persisted in `localStorage`)
- Smart ellipsis page number display (shows `1 … 4 5 6 … 30`)
- Resets to page 1 on any filter change

**Loading states:**
- If not authed → pulsing dot + "Waiting for session…"
- If loading → 9-card skeleton grid

### 5.3 Navigation Bridge — `NavigationBridge` component
- Lives inside the Patients MFE's router
- On any route change within the MFE (e.g., navigating to `/:id`), posts a `NAVIGATE` message to the Shell
- Shell's `useMFEBridge` receives this and updates the top-level URL to `/patients/:id`
- This keeps the browser URL bar and browser history in sync with the MFE's internal state

### 5.4 Patient Detail — `PatientDetailPage.tsx`
Tabbed view with 4 tabs:

| Tab | Component | Content |
|-----|-----------|---------|
| Overview | `OverviewTab.tsx` | Demographics, blood group, address, last visit |
| Vitals | `VitalsPanel.tsx` | BP, heart rate, temperature, O₂ saturation, weight |
| Appointments | `AppointmentsTab.tsx` | Upcoming/past appointments with status badges |
| Notes | `NotesTab.tsx` | Clinical notes, editable text area |

Also includes:
- `ContactPanel.tsx` — phone, email, address with copy actions
- Back button → posts `NAVIGATE { path: '/patients' }` to return to list

---

## 6. Analytics & Dashboard MFE (`apps/analytics`)

### 6.1 Auth Handshake
Identical pattern to Patients MFE — `AnalyticsContext` posts `MFE_READY`, awaits `AUTH_TOKEN_READY`, then fetches data in parallel:
```typescript
const [kpiData, analytics] = await Promise.all([getDashboardKPIs(), getAnalytics()])
```

### 6.2 Dashboard Page — `DashboardPage.tsx`
**KPI Row (4 cards):**
- Total Patients, Today's Appointments, Admissions This Month, Revenue
- Each card shows value, delta (% change), trend direction icon, and a mini sparkline chart

**Middle Row:**
- `RecentAppointmentsTable` — upcoming appointments with patient name, type (in-person / virtual / follow-up / emergency), time, status badge
- `ActivityFeed` — timestamped log of recent clinical events (admissions, discharges, notes)

**Admissions Trend Chart:**
- Line chart (Recharts) showing monthly admissions + discharges over the last 12 months

### 6.3 Analytics Page — `AnalyticsPage.tsx`
**Date Range Controls:**
- Preset buttons: Last 7d / Last 30d / Last 90d / Custom
- Custom mode reveals two native `<input type="date">` fields + Apply button
- Changing date range triggers `AnalyticsContext.refetch()` (real API would pass date params)

**Chart Grid:**
- `AdmissionsLineChart` — full-width: monthly admissions vs discharges (Recharts LineChart)
- `DepartmentBarChart` — patient counts by hospital department (BarChart)
- `DiagnosisPieChart` — diagnosis category distribution (PieChart / RadialChart)
- `RevenueAreaChart` — revenue vs expenses area chart (AreaChart)
- `SummaryTable` — tabular summary: peak months, top departments, revenue totals

**Data slicing:** For the mock API, the preset selection slices the static dataset to the appropriate number of months, simulating real date-filtered responses.

---

## 7. Shared UI Library (`packages/shared-ui`)

| Component | Function |
|-----------|----------|
| `Button` | Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. Supports loading spinner and disabled state |
| `Input` | Text input with label, error message, prefix/suffix icons, fullWidth option |
| `Badge` | Status pill — maps patient/appointment status to color (green=active, red=critical, etc.) |
| `Avatar` | Circular avatar with image + fallback to initials, multiple sizes |
| `Skeleton` | Animated shimmer placeholder — configurable width/height/border-radius |
| `SkeletonCard` | Pre-composed skeleton block for card layouts |
| `DashboardSkeleton`, `PatientsTableSkeleton`, `AnalyticsSkeleton` | Full-page skeleton layouts for route-level loading states |
| `Spinner` | Circular loading indicator with optional label |
| `Toggle` | List/Grid view toggle button group |
| `Card` | White rounded container with shadow |
| `ErrorBoundary` | Class component error catcher — shows error card with "Try again" / "Reload page" actions |
| `withErrorBoundary` | HOC that wraps any component in an ErrorBoundary |

---

## 8. Mock API (`packages/mock-api`)

Simulates a real HTTP API with artificial delays:

| Function | Delay | Returns |
|----------|-------|---------|
| `getPatients()` | ~300 ms | Array of 30 Patient records |
| `getPatientById(id)` | 200 ms | Single Patient or undefined |
| `getAnalytics()` | 600 ms | Full AnalyticsData |
| `getDashboardKPIs()` | 300 ms | Array of 4 KPICard objects |
| `getAppointments()` | 400 ms | Array of Appointment records |
| `getActivityFeed()` | 250 ms | Array of ActivityItem (timestamped events) |

Delays are randomized slightly via the `delay.ts` utility, giving a realistic feel to async interactions.

---

## 9. PWA Offline Support

When the user loses network connectivity:
1. Service Worker intercepts all same-origin GET fetch requests
2. Tries the network first; on failure, falls back to the Cache API
3. For navigation requests (clicking a link), serves `/offline.html` if available
4. Returns a `503 Service Unavailable` text response as a last resort

Shell assets (`/`, `/index.html`, `/offline.html`, PWA icons) are pre-cached on Service Worker install, ensuring they're always available offline.

---

## 10. Full User Journey (End-to-End Flow)

```
1. User opens https://raga-ai.vercel.app/
2. AuthGuard checks user → null → redirect to /login
3. User enters email + password → Firebase signIn
4. onAuthStateChanged fires → AuthContext sets user
5. Shell fetches JWT → broadcastAuth() → posts AUTH_TOKEN_READY to both iframes
6. Analytics MFE receives AUTH_TOKEN_READY → fetches KPIs + analytics → renders Dashboard
7. User clicks "Patients" in sidebar → Shell navigates to /patients
8. Patients MFE receives AUTH_TOKEN_READY → fetches patients → renders patient list
9. User clicks a patient → Patients MFE posts NAVIGATE { path: '/patients/p001' }
10. Shell updates URL → renders PatientDetailPage inside the iframe
11. A clinical alert fires → Service Worker shows OS notification
12. User clicks notification → SW posts NAVIGATE → Shell opens /patients/p009
13. User clicks logout → Firebase signOut → AUTH_SIGNED_OUT broadcast → both MFEs clear data → redirect to /login
```
