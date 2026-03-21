import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAnalytics } from '../../context/AnalyticsContext';
import KPICard from './KPICard';
import RecentAppointmentsTable from './RecentAppointmentsTable';
import ActivityFeed from './ActivityFeed';
import AdmissionsTrendChart from './AdmissionsTrendChart';
import { SkeletonCard, Skeleton } from '@raga/shared-ui';
import { useEffect, useState } from 'react';
import { getAppointments, getActivityFeed } from '@raga/mock-api';
export default function DashboardPage() {
    const { kpis, analyticsData, loading, isAuthed } = useAnalytics();
    const [appointments, setAppointments] = useState([]);
    const [activity, setActivity] = useState([]);
    const [subLoading, setSubLoading] = useState(true);
    useEffect(() => {
        if (!isAuthed)
            return;
        Promise.all([getAppointments(), getActivityFeed()])
            .then(([appts, feed]) => {
            setAppointments(appts);
            setActivity(feed);
        })
            .finally(() => setSubLoading(false));
    }, [isAuthed]);
    // ── Auth wait ────────────────────────────────────────────────
    if (!isAuthed) {
        return (_jsx("div", { className: "flex items-center justify-center\n                      min-h-screen bg-slate-50", children: _jsxs("div", { className: "flex flex-col items-center gap-3 text-slate-400", children: [_jsx(PulsingDot, {}), _jsx("span", { className: "text-sm", children: "Waiting for session\u2026" })] }) }));
    }
    // ── Loading skeleton ──────────────────────────────────────────
    if (loading || subLoading) {
        return (_jsxs("div", { className: "p-6 space-y-5 min-h-screen bg-slate-50", children: [_jsx(Skeleton, { height: "1.75rem", width: "200px", rounded: "lg" }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx(SkeletonCard, {}, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(SkeletonCard, {}) }), _jsx(SkeletonCard, {})] }), _jsx(SkeletonCard, {})] }));
    }
    const trend = analyticsData?.admissionsTrend ?? [];
    return (_jsxs("div", { className: "p-6 space-y-5 bg-slate-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Dashboard" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: new Date().toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                }) })] }), _jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1.5\n                         bg-emerald-50 text-emerald-700 rounded-full\n                         text-xs font-medium border border-emerald-100", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500\n                           animate-pulse" }), "Live"] })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.slice(0, 4).map((kpi, i) => (_jsx(KPICard, { kpi: kpi, trend: trend }, i))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(RecentAppointmentsTable, { appointments: appointments }) }), _jsx(ActivityFeed, { items: activity })] }), _jsx(AdmissionsTrendChart, { data: trend })] }));
}
function PulsingDot() {
    return (_jsxs("div", { className: "relative flex h-8 w-8", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full\n                       rounded-full bg-indigo-300 opacity-50" }), _jsx("span", { className: "relative inline-flex rounded-full h-8 w-8\n                       bg-indigo-500 opacity-70" })] }));
}
