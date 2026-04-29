# Raga-AI — Theoretical Architecture Overview

> **Domain:** Clinical Management Platform (HealthOS)
> **Paradigm:** Micro-Frontend (MFE) architecture with a central Shell host, built on a Turborepo monorepo.

---

## 1. What is the Project?

Raga-AI is a **healthcare management SPA (Single-Page Application)** designed around the concept of a *shell-host / micro-frontend* architecture. It simulates a clinical dashboard used by hospital staff (doctors, nurses, admins) to:

- View and manage patient records
- Track hospital-wide analytics and KPIs
- Receive real-time clinical alerts and notifications
- Authenticate securely via Firebase

The platform is named **HealthOS** internally (per service worker, manifest, and notification payloads) and operates as a **Progressive Web App (PWA)**.

---

## 2. Architectural Paradigm — Micro-Frontend (MFE)

### What is a Micro-Frontend?

A Micro-Frontend is a design pattern for frontend applications analogous to microservices on the backend. Instead of one monolithic frontend bundle, the application is split into smaller, independently deployable frontend "apps" that are composed together at runtime.

Each MFE:
- Has its own routing, state, and build pipeline
- Can be deployed independently
- Communicates with others via a defined contract (a **message bridge**)

### How Raga-AI Implements MFEs

```
┌─────────────────────────────────────────────────┐
│                  SHELL (port 5173)               │
│  ┌──────────────────────────────────────────┐   │
│  │  AuthContext  │  NotificationContext      │   │
│  │  AppRouter    │  useMFEBridge             │   │
│  └──────────┬────────────────┬──────────────┘   │
│             │  <iframe>      │  <iframe>          │
│    ┌────────▼───────┐  ┌────▼─────────────┐     │
│    │  Analytics MFE │  │   Patients MFE   │     │
│    │  (port 5175)   │  │   (port 5174)    │     │
│    └────────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────┘
```

The Shell loads MFEs as `<iframe>` elements. Communication between the Shell and each MFE happens exclusively via the **`window.postMessage` API** — a browser-native, origin-safe inter-frame messaging protocol.

---

## 3. The PostMessage Bridge — Theory

### Why PostMessage?

Since MFEs live in separate origins (different ports / domains in production), they cannot directly share JavaScript memory, React context, or global variables. The `window.postMessage` API provides a structured, origin-validated channel for cross-frame communication.

### Message Protocol

A **typed discriminated union** (`BridgeMessage`) defines all valid messages:

| Message Type        | Direction        | Purpose |
|---------------------|-----------------|---------|
| `MFE_READY`         | MFE → Shell     | MFE signals it has mounted and is ready to receive auth |
| `AUTH_TOKEN_READY`  | Shell → MFE     | Shell sends Firebase JWT + user object after login |
| `AUTH_SIGNED_OUT`   | Shell → MFE     | Shell notifies MFEs that the session has ended |
| `NAVIGATE`          | MFE → Shell     | MFE requests top-level URL navigation |
| `NOTIFICATION_PUSH` | MFE → Shell     | MFE pushes a clinical alert into the shell's notification system |

This is a **publish-subscribe (pub/sub)** pattern implemented over the postMessage transport. The Shell acts as the **event broker**.

### Origin Validation (Security)

The Shell maintains an `ALLOWED_MFE_ORIGINS` Set. Every incoming `postMessage` event is first checked against this set before processing. This prevents malicious iframes or third-party scripts from injecting fraudulent messages.

---

## 4. Authentication Theory — Firebase + MFE Broadcast

### Firebase Auth

Firebase Authentication is a managed identity provider. It uses **JSON Web Tokens (JWTs)** — digitally signed tokens containing user claims — to authenticate requests. Firebase handles:
- User creation (`createUserWithEmailAndPassword`)
- Sign-in (`signInWithEmailAndPassword`)
- Session persistence via secure browser storage
- Token refresh (JWTs expire; Firebase auto-renews silently)

### The Auth Broadcast Problem

In a normal SPA, auth state lives in a React Context and all components share it. In an MFE architecture, each app is isolated — the Patients MFE and Analytics MFE have no access to the Shell's React context.

**Solution — Token Broadcast:**
1. Shell listens to Firebase's `onAuthStateChanged` observable
2. When auth state changes (login/logout), Shell fetches the current JWT via `getIdToken()`
3. Shell posts an `AUTH_TOKEN_READY` message with `{ token, user }` to each MFE iframe
4. MFEs listen for this message, mark themselves as `isAuthed`, and begin fetching data
5. On `AUTH_SIGNED_OUT`, MFEs clear their local state

This is a **reactive push model**: MFEs never poll for auth state — they wait for the shell to push it.

---

## 5. Monorepo Architecture — Turborepo

### What is a Monorepo?

A **monorepo** (monolithic repository) is a single Git repository containing multiple packages/applications. This contrasts with a polyrepo (one repo per package).

### Why Turborepo?

**Turborepo** is a high-performance build system for JavaScript/TypeScript monorepos. It provides:

- **Incremental builds**: Only rebuilds packages whose source files changed
- **Remote caching**: Build artifacts can be shared across machines via a remote cache
- **Parallel task execution**: Runs tasks for multiple packages in parallel while respecting dependency order
- **Task graph**: Understands that `packages/shared-ui` must be built before `apps/shell` (via `"dependsOn": ["^build"]`)

### Workspace Structure

```
raga-ai/                     ← Turborepo root
├── apps/
│   ├── shell/               ← Host SPA (React + Vite, port 5173)
│   ├── analytics/           ← Analytics MFE (React + Vite, port 5175)
│   └── patients/            ← Patients MFE (React + Vite, port 5174)
└── packages/
    ├── shared-ui/           ← Reusable React component library
    ├── shared-types/        ← TypeScript type definitions + bridge utilities
    └── mock-api/            ← Simulated async API with realistic delays
```

**pnpm workspaces** power the dependency linking. A package can import `@raga/shared-ui` or `@raga/shared-types` without publishing to npm — pnpm resolves them from the local `packages/` folder.

---

## 6. PWA (Progressive Web App) Theory

A PWA is a web application that uses modern browser APIs to behave like a native app. Key features:

### Service Worker

A **Service Worker** is a script that runs in the background, separate from the main browser thread. It acts as a programmable network proxy, enabling:

- **Offline support**: Intercepts fetch requests and serves cached content when the network is unavailable
- **Push notifications**: Receives server-sent push events even when the tab is closed
- **Background sync**: Queues operations to be replayed when connectivity is restored

Raga-AI uses a custom Service Worker (`sw-custom.ts`) compiled with the **Workbox** library (via `vite-plugin-pwa`). It employs:

| Strategy | Applied To |
|---|---|
| **Cache-first** | Google Fonts, static images |
| **Network-first** | API calls, Firebase Auth endpoints |
| **Stale-while-revalidate** | MFE iframe origins |

### Web App Manifest

A JSON file (`manifest`) that tells the browser the app can be "installed" on the home screen. It defines the app name, icons, theme color, and display mode (`standalone` = no browser chrome).

---

## 7. React Patterns Used

### Context + Provider Pattern

React Context provides a way to pass data through the component tree without prop drilling. The project uses:
- `AuthContext` — global auth state (user, loading, error, login/logout actions)
- `NotificationContext` — notification queue (add, mark-read, clear)
- `PatientContext` — patient data, filters, view mode (within Patients MFE)
- `AnalyticsContext` — KPIs, chart data, date ranges (within Analytics MFE)

### Code Splitting + Lazy Loading

`React.lazy()` defers loading a component's JavaScript bundle until it is actually needed. Combined with `<Suspense>`, this means:
- The initial JS payload is smaller (faster first load)
- Each route's code is fetched on demand
- A skeleton loading state is shown during the fetch

### Error Boundaries

React class component lifecycle method `componentDidCatch` + `getDerivedStateFromError` allows catching render-time JavaScript errors and displaying a fallback UI instead of crashing the entire app.

---

## 8. State Management Philosophy

The project deliberately avoids global state management libraries (Redux, Zustand, Jotai). Instead, it uses a **layered state approach**:

| Layer | Technology | Scope |
|---|---|---|
| Server/async state | Direct `useState` + async functions | Per context |
| Global UI state | React Context | Cross-component within one app |
| Persisted UI preferences | `localStorage` via `useLocalStorage` hook | Survives page reload |
| Cross-app state | `postMessage` bridge | Cross-MFE |
| Derived/computed state | `useMemo` | Avoids redundant recalculation |

---

## 9. TypeScript Type Safety

All data contracts are defined in `packages/shared-types/src/index.ts`. Key types:

- `User` — uid, email, displayName, role, avatar
- `Patient` — full clinical record including vitals
- `Appointment` — scheduling record
- `AnalyticsData` — composite analytics payload
- `BridgeMessage` — discriminated union of all postMessage types
- `Notification` — in-app notification record

TypeScript's **discriminated unions** on `BridgeMessage` ensure that the `payload` type is correctly narrowed depending on the `type` field — eliminating runtime type errors.

---

## 10. Testing Strategy

The project uses **Jest** + **@testing-library/react** for unit and integration tests:

- Tests run against the jsdom environment (browser simulation in Node.js)
- CSS modules are mocked via `identity-obj-proxy`
- Module aliases (`@raga/*`) are mapped in `jest.config.cjs` so tests use the same import paths as the app
- Coverage is collected across all `apps/` and `packages/` source files
- Workers are excluded from coverage (service worker code cannot run in jsdom)
