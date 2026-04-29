# Raga-AI — Depth Analysis Index

> This document is the entry point for the complete technical analysis of the **Raga-AI (HealthOS)** project.
> The analysis is split into three focused files for clarity.

---

## Files in This Analysis

| File | Contents |
|------|----------|
| [`01_theoretical_overview.md`](./01_theoretical_overview.md) | Core concepts, architectural patterns, and technology explanations — *why the system is built the way it is* |
| [`02_functional_analysis.md`](./02_functional_analysis.md) | Feature-by-feature breakdown — *what the system does* |
| [`03_non_functional_analysis.md`](./03_non_functional_analysis.md) | Quality attributes — *how well the system does it* |
| [`04_best_practices_performance_complex_tasks.md`](./04_best_practices_performance_complex_tasks.md) | Engineering best practices, performance optimisations with code traces, and complex task dissections |

---

## Quick Reference: Project at a Glance

```
raga-ai/                     ← Turborepo + pnpm monorepo
├── apps/
│   ├── shell/               ← React SPA host (Vite, port 5173) — Auth, routing, notifications, PWA
│   ├── analytics/           ← Analytics MFE (Vite, port 5175) — Dashboard, KPIs, charts
│   └── patients/            ← Patients MFE (Vite, port 5174) — Patient list, detail, vitals
└── packages/
    ├── shared-ui/           ← React component library (Button, Badge, Skeleton, ErrorBoundary…)
    ├── shared-types/        ← TypeScript entities + postMessage bridge contract
    └── mock-api/            ← Simulated async API with realistic delays
```

**Tech Stack:** React 18 · TypeScript · Vite · Turborepo · pnpm · Firebase Auth · Recharts · Tailwind CSS v4 · Workbox (PWA) · Jest + Testing Library

**Architecture:** Micro-Frontend (MFE) via `<iframe>` + `window.postMessage` bridge

---

## Key Architectural Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| MFE composition strategy | `<iframe>` + postMessage | Origin isolation, independent deployment, no shared runtime |
| Auth propagation | Token broadcast via postMessage | MFEs are cross-origin; no shared memory |
| State management | React Context + hooks | No library overhead; sufficient for app scale |
| Monorepo tooling | Turborepo + pnpm | Incremental builds, workspace dependency resolution |
| API layer | Mock API package | Swap-for-real-API ready without touching MFE code |
| Offline support | Custom Workbox Service Worker | PWA installability + resilient network layer |
| Testing | Jest + Testing Library | Behaviour-driven, fast, no browser required |
| Deployment | Vercel (per-app) | Independent MFE deployment, SPA route rewriting |
