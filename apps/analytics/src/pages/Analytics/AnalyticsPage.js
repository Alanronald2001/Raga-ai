import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { Skeleton, SkeletonCard } from '@raga/shared-ui';
import AdmissionsLineChart from './AdmissionsLineChart';
import DepartmentBarChart from './DepartmentBarChart';
import DiagnosisPieChart from './DiagnosisPieChart';
import RevenueAreaChart from './RevenueAreaChart';
import SummaryTable from './SummaryTable';
import clsx from 'clsx';
const PRESETS = [
    { label: 'Last 7d', value: '7d' },
    { label: 'Last 30d', value: '30d' },
    { label: 'Last 90d', value: '90d' },
    { label: 'Custom', value: 'custom' },
];
function presetsToRange(preset) {
    const to = new Date();
    const from = new Date();
    if (preset === '7d')
        from.setDate(from.getDate() - 7);
    if (preset === '30d')
        from.setDate(from.getDate() - 30);
    if (preset === '90d')
        from.setDate(from.getDate() - 90);
    return {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
    };
}
// ── Component ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
    const { analyticsData, dateRange, setDateRange, loading, isAuthed } = useAnalytics();
    const [preset, setPreset] = useState('30d');
    const [customFrom, setCustomFrom] = useState(dateRange.from);
    const [customTo, setCustomTo] = useState(dateRange.to);
    const handlePreset = (p) => {
        setPreset(p);
        if (p !== 'custom')
            setDateRange(presetsToRange(p));
    };
    const handleCustomApply = () => {
        setDateRange({ from: customFrom, to: customTo });
    };
    // Slice data to roughly match date range for mock purposes
    const slicedData = useMemo(() => {
        if (!analyticsData)
            return null;
        const months = preset === '7d' ? 1 : preset === '30d' ? 3 : preset === '90d' ? 6 : 12;
        return {
            ...analyticsData,
            admissionsTrend: analyticsData.admissionsTrend.slice(-months),
            revenueData: analyticsData.revenueData.slice(-months),
        };
    }, [analyticsData, preset]);
    // ── Auth wait ────────────────────────────────────────────────
    if (!isAuthed) {
        return (_jsx("div", { className: "flex items-center justify-center\n                      min-h-screen bg-slate-50 text-slate-400 text-sm", children: "Waiting for session\u2026" }));
    }
    // ── Loading skeleton ──────────────────────────────────────────
    if (loading || !slicedData) {
        return (_jsxs("div", { className: "p-6 space-y-5 min-h-screen bg-slate-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { height: "1.75rem", width: "180px", rounded: "lg" }), _jsx(Skeleton, { height: "2.25rem", width: "320px", rounded: "lg" })] }), _jsx(SkeletonCard, {}), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(SkeletonCard, {}), _jsx(SkeletonCard, {})] })] }));
    }
    return (_jsxs("div", { className: "p-6 space-y-5 bg-slate-50 min-h-screen", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-lg font-bold text-slate-800", children: "Analytics" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Hospital performance overview" })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "flex items-center bg-white border border-slate-200\n                          rounded-lg p-0.5 gap-0.5", children: PRESETS.map(p => (_jsx("button", { onClick: () => handlePreset(p.value), className: clsx('px-3 py-1.5 rounded-md text-xs font-medium', 'transition-all duration-150', 'focus-visible:outline-none focus-visible:ring-2', 'focus-visible:ring-indigo-500', preset === p.value
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'), children: p.label }, p.value))) }), preset === 'custom' && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "date", value: customFrom, max: customTo, onChange: e => setCustomFrom(e.target.value), className: "text-xs border border-slate-200 rounded-lg\n                           px-2.5 py-1.5 text-slate-700 bg-white\n                           focus:outline-none focus:ring-2\n                           focus:ring-indigo-500 cursor-pointer" }), _jsx("span", { className: "text-xs text-slate-400", children: "\u2192" }), _jsx("input", { type: "date", value: customTo, min: customFrom, onChange: e => setCustomTo(e.target.value), className: "text-xs border border-slate-200 rounded-lg\n                           px-2.5 py-1.5 text-slate-700 bg-white\n                           focus:outline-none focus:ring-2\n                           focus:ring-indigo-500 cursor-pointer" }), _jsx("button", { onClick: handleCustomApply, className: "px-3 py-1.5 bg-indigo-600 text-white\n                           rounded-lg text-xs font-medium\n                           hover:bg-indigo-700 transition-colors", children: "Apply" })] }))] })] }), _jsx(AdmissionsLineChart, { data: slicedData.admissionsTrend }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(DepartmentBarChart, { data: slicedData.departmentBreakdown }), _jsx(DiagnosisPieChart, { data: slicedData.diagnosisCategories })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(RevenueAreaChart, { data: slicedData.revenueData }), _jsx(SummaryTable, { admissions: slicedData.admissionsTrend, revenue: slicedData.revenueData, departments: slicedData.departmentBreakdown })] })] }));
}
