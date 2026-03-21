import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Skeleton } from '@raga/shared-ui';
import { ErrorBoundary } from '@raga/shared-ui';
// ── Lazy pages ────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const AnalyticsPage = lazy(() => import('../pages/Analytics/AnalyticsPage'));
// ── Suspense fallback ─────────────────────────────────────────────
function PageSkeleton() {
    return (_jsxs("div", { className: "flex flex-col gap-4 p-6 w-full h-full min-h-screen bg-slate-50", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx(Skeleton, { height: "5.5rem", rounded: "lg" }, i))) }), _jsxs("div", { className: "flex gap-4 flex-1", children: [_jsx(Skeleton, { width: "66%", height: "320px", rounded: "lg" }), _jsxs("div", { className: "flex flex-col gap-4 flex-1", children: [_jsx(Skeleton, { height: "150px", rounded: "lg" }), _jsx(Skeleton, { height: "150px", rounded: "lg" })] })] })] }));
}
// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
    // Dashboard embed route
    {
        path: '/dashboard',
        element: (_jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: _jsx(DashboardPage, {}) }) })),
    },
    // Full analytics route
    {
        path: '/analytics',
        element: (_jsx(ErrorBoundary, { children: _jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: _jsx(AnalyticsPage, {}) }) })),
    },
    // Default → dashboard
    {
        index: true,
        element: _jsx(Navigate, { to: "/dashboard", replace: true }),
    },
    // Catch-all → dashboard
    {
        path: '*',
        element: _jsx(Navigate, { to: "/dashboard", replace: true }),
    },
]);
// ── Export ────────────────────────────────────────────────────────
export default function AppRouter() {
    return _jsx(RouterProvider, { router: router });
}
