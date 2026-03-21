import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Skeleton } from '@raga/shared-ui';
import AuthGuard from '../components/layout/AuthGuard';
import { ErrorBoundary } from '@raga/shared-ui';
// ── Lazy pages ────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/Auth/SignupPage'));
const AppLayout = lazy(() => import('../components/layout/AppLayout'));
const DashboardEmbed = lazy(() => import('../pages/DashboardEmbed'));
const AnalyticsEmbed = lazy(() => import('../pages/AnalyticsEmbed'));
const PatientsEmbed = lazy(() => import('../pages/PatientsEmbed'));
// ── Suspense fallback ─────────────────────────────────────────────
function PageSkeleton() {
    return (_jsxs("div", { className: "flex flex-col gap-4 p-6 w-full h-full", children: [_jsx(Skeleton, { height: "2.5rem", width: "40%", rounded: "lg" }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx(Skeleton, { height: "6rem", rounded: "lg" }, i))) }), _jsx(Skeleton, { height: "24rem", rounded: "lg" })] }));
}
// ── Suspense wrapper ──────────────────────────────────────────────
function SuspenseRoute({ children }) {
    return _jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: children });
}
// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
    // Public
    {
        path: '/login',
        element: (_jsx(SuspenseRoute, { children: _jsx(LoginPage, {}) })),
    },
    {
        path: '/signup',
        element: (_jsx(SuspenseRoute, { children: _jsx(SignupPage, {}) })),
    },
    // Protected — all routes under AuthGuard + AppLayout
    {
        path: '/',
        element: (_jsx(AuthGuard, { children: _jsx(SuspenseRoute, { children: _jsx(ErrorBoundary, { children: _jsx(AppLayout, {}) }) }) })),
        children: [
            // Default → dashboard
            {
                index: true,
                element: (_jsx(SuspenseRoute, { children: _jsx(DashboardEmbed, {}) })),
            },
            // Analytics MFE
            {
                path: 'analytics',
                element: (_jsx(SuspenseRoute, { children: _jsx(AnalyticsEmbed, {}) })),
            },
            // Patients MFE — list
            {
                path: 'patients',
                element: (_jsx(SuspenseRoute, { children: _jsx(PatientsEmbed, {}) })),
            },
            // Patients MFE — detail
            {
                path: 'patients/:id',
                element: (_jsx(SuspenseRoute, { children: _jsx(PatientsEmbed, {}) })),
            },
            // Catch-all → home
            {
                path: '*',
                element: _jsx(Navigate, { to: "/", replace: true }),
            },
        ],
    },
]);
// ── Export ────────────────────────────────────────────────────────
export default function AppRouter() {
    return _jsx(RouterProvider, { router: router });
}
