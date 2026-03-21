import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import { postToShell } from '@raga/shared-types';
import { Skeleton, SkeletonCard } from '@raga/shared-ui';
// ── Lazy pages ────────────────────────────────────────────────────
const PatientsPage = lazy(() => import('./pages/Patients/PatientsPage'));
const PatientDetailPage = lazy(() => import('./pages/PatientDetail/PatientDetailPage'));
// ── Skeletons (same as before) ────────────────────────────────────
function ListSkeleton() {
    return (_jsxs("div", { className: "p-6 space-y-4 bg-slate-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsx(Skeleton, { height: "2.25rem", width: "280px", rounded: "lg" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { height: "2.25rem", width: "100px", rounded: "lg" }), _jsx(Skeleton, { height: "2.25rem", width: "72px", rounded: "lg" })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({ length: 9 }).map((_, i) => (_jsx(SkeletonCard, {}, i))) })] }));
}
function DetailSkeleton() {
    return (_jsxs("div", { className: "p-6 space-y-5 bg-slate-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { height: "2rem", width: "2rem", rounded: "lg" }), _jsx(Skeleton, { height: "1.75rem", width: "200px", rounded: "lg" })] }), _jsx(Skeleton, { height: "9rem", rounded: "lg" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] }), _jsxs("div", { className: "space-y-4", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] })] })] }));
}
// ── Navigation bridge — must live inside RouterProvider ───────────
function NavigationBridge() {
    const { pathname } = useLocation();
    useEffect(() => {
        // Only sync detail routes to shell — list route stays at /patients
        if (pathname === '/')
            return;
        postToShell({
            type: 'NAVIGATE',
            payload: { path: `/patients${pathname}` },
        });
    }, [pathname]);
    return null;
}
// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
    {
        path: '/',
        element: (_jsxs(_Fragment, { children: [_jsx(NavigationBridge, {}), _jsx(Suspense, { fallback: _jsx(ListSkeleton, {}), children: _jsx(PatientsPage, {}) })] })),
    },
    {
        path: '/:id',
        element: (_jsxs(_Fragment, { children: [_jsx(NavigationBridge, {}), _jsx(Suspense, { fallback: _jsx(DetailSkeleton, {}), children: _jsx(PatientDetailPage, {}) })] })),
    },
    {
        path: '*',
        element: _jsx(Navigate, { to: "/", replace: true }),
    },
]);
// ── Root with provider ────────────────────────────────────────────
function RouterWithProvider() {
    return (_jsx(PatientProvider, { children: _jsx(RouterProvider, { router: router }) }));
}
export default RouterWithProvider;
