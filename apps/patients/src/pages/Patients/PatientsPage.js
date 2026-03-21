import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { usePatients } from '../../context/PatientContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Input, Toggle, Skeleton } from '@raga/shared-ui';
import PatientTable from './PatientTable';
import PatientGrid from './PatientGrid';
import clsx from 'clsx';
// ── Constants ─────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Stable', value: 'stable' },
    { label: 'Critical', value: 'critical' },
    { label: 'Discharged', value: 'discharged' },
];
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];
// ── Component ─────────────────────────────────────────────────────
export default function PatientsPage() {
    const { filtered, loading, isAuthed, viewMode, setViewMode, setSearch, setStatusFilter, statusFilter, } = usePatients();
    // ── Local search input (debounced before hitting context) ──────
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 300);
    // Sync debounced value → context
    useMemo(() => {
        setSearch(debouncedSearch);
    }, [debouncedSearch, setSearch]);
    // ── Department filter (local — derived from data) ──────────────
    const [deptFilter, setDeptFilter] = useState('all');
    // ── Persisted view mode ────────────────────────────────────────
    const [storedView, setStoredView] = useLocalStorage('healthos:patients:viewMode', 'list');
    const handleViewChange = (mode) => {
        setViewMode(mode);
        setStoredView(mode);
    };
    // ── Pagination ─────────────────────────────────────────────────
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useLocalStorage('healthos:patients:pageSize', 20);
    // Derive unique departments from full patient list
    const departments = useMemo(() => {
        const depts = new Set(filtered.map(p => p.department));
        return ['all', ...Array.from(depts).sort()];
    }, [filtered]);
    // Apply department filter on top of context filtered list
    const displayed = useMemo(() => {
        if (deptFilter === 'all')
            return filtered;
        return filtered.filter(p => p.department === deptFilter);
    }, [filtered, deptFilter]);
    // Paginate
    const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageSlice = displayed.slice((safePage - 1) * pageSize, safePage * pageSize);
    // Reset to page 1 on filter change
    useMemo(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, deptFilter]);
    // ── Auth / loading states ──────────────────────────────────────
    if (!isAuthed) {
        return (_jsx("div", { className: "flex items-center justify-center\n                      min-h-screen bg-slate-50", children: _jsxs("div", { className: "flex flex-col items-center gap-3 text-slate-400", children: [_jsx(PulsingDot, {}), _jsx("span", { className: "text-sm", children: "Waiting for session\u2026" })] }) }));
    }
    if (loading) {
        return (_jsxs("div", { className: "p-6 space-y-4 bg-slate-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx(Skeleton, { height: "2.25rem", width: "280px", rounded: "lg" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { height: "2.25rem", width: "140px", rounded: "lg" }), _jsx(Skeleton, { height: "2.25rem", width: "140px", rounded: "lg" }), _jsx(Skeleton, { height: "2.25rem", width: "72px", rounded: "lg" })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({ length: 9 }).map((_, i) => (_jsxs("div", { className: "bg-white rounded-xl border\n                                    border-slate-100 shadow-sm p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { width: "2.5rem", height: "2.5rem", rounded: "full" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { height: "0.875rem", width: "60%" }), _jsx(Skeleton, { height: "0.75rem", width: "40%" })] })] }), _jsx(Skeleton, { height: "0.75rem" }), _jsx(Skeleton, { height: "0.75rem", width: "80%" })] }, i))) })] }));
    }
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-slate-50", children: [_jsx("div", { className: "sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm\n                      border-b border-slate-100 px-6 py-3", children: _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsx("div", { className: "flex-1 min-w-[200px] max-w-xs", children: _jsx(Input, { placeholder: "Search patients\u2026", value: searchInput, onChange: e => setSearchInput(e.target.value), fullWidth: true }) }), _jsx(Select, { value: statusFilter, onChange: v => setStatusFilter(v), options: STATUS_OPTIONS.map(o => ({ label: o.label, value: o.value })), placeholder: "Status" }), _jsx(Select, { value: deptFilter, onChange: setDeptFilter, options: departments.map(d => ({
                                label: d === 'all' ? 'All Departments' : d,
                                value: d,
                            })), placeholder: "Department" }), _jsx("div", { className: "flex-1" }), _jsxs("span", { className: "text-xs text-slate-400 hidden sm:block tabular-nums", children: [displayed.length, " patient", displayed.length !== 1 ? 's' : ''] }), _jsx(Toggle, { value: storedView, onChange: handleViewChange })] }) }), _jsx("div", { className: "flex-1 px-6 py-5", children: pageSlice.length === 0 ? (_jsx(EmptyState, { query: searchInput })) : storedView === 'list' ? (_jsx(PatientTable, { patients: pageSlice })) : (_jsx(PatientGrid, { patients: pageSlice })) }), displayed.length > 0 && (_jsxs("div", { className: "sticky bottom-0 bg-white border-t border-slate-100\n                        px-6 py-3 flex items-center justify-between gap-4\n                        flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500", children: [_jsx("span", { children: "Rows:" }), _jsx("div", { className: "flex gap-1", children: PAGE_SIZE_OPTIONS.map(size => (_jsx("button", { onClick: () => {
                                        setPageSize(size);
                                        setPage(1);
                                    }, className: clsx('px-2.5 py-1 rounded-md text-xs font-medium transition-colors', pageSize === size
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-500 hover:bg-slate-100'), children: size }, size))) })] }), _jsxs("span", { className: "text-xs text-slate-400 tabular-nums", children: [(safePage - 1) * pageSize + 1, "\u2013", Math.min(safePage * pageSize, displayed.length), " of", ' ', displayed.length] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(PageBtn, { label: "\u2190", onClick: () => setPage(p => Math.max(1, p - 1)), disabled: safePage === 1 }), getPageNumbers(safePage, totalPages).map((p, i) => p === '…' ? (_jsx("span", { className: "px-2 text-xs text-slate-400", children: "\u2026" }, `ellipsis-${i}`)) : (_jsx(PageBtn, { label: String(p), onClick: () => setPage(Number(p)), active: safePage === p }, p))), _jsx(PageBtn, { label: "\u2192", onClick: () => setPage(p => Math.min(totalPages, p + 1)), disabled: safePage === totalPages })] })] }))] }));
}
// ── Sub-components ────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder, }) {
    return (_jsx("select", { value: value, onChange: e => onChange(e.target.value), className: "text-xs border border-slate-200 rounded-lg px-3 py-2\n                 text-slate-700 bg-white focus:outline-none\n                 focus:ring-2 focus:ring-indigo-500 cursor-pointer\n                 hover:border-slate-300 transition-colors", children: options.map(o => (_jsx("option", { value: o.value, children: o.label }, o.value))) }));
}
function PageBtn({ label, onClick, disabled, active, }) {
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: clsx('min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium', 'transition-colors duration-100', 'disabled:opacity-40 disabled:cursor-not-allowed', active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'), children: label }));
}
function EmptyState({ query }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center\n                    min-h-[400px] gap-3 text-slate-400 select-none", children: [_jsx("div", { className: "h-16 w-16 rounded-full bg-slate-100\n                      flex items-center justify-center text-3xl", children: "\uD83D\uDD0D" }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "No patients found" }), _jsx("p", { className: "text-xs mt-1", children: query
                            ? `No results for "${query}" — try a different search`
                            : 'Try adjusting your filters' })] })] }));
}
function PulsingDot() {
    return (_jsxs("div", { className: "relative flex h-8 w-8", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full\n                       rounded-full bg-indigo-300 opacity-50" }), _jsx("span", { className: "relative inline-flex rounded-full h-8 w-8\n                       bg-indigo-500 opacity-70" })] }));
}
// ── Pagination helpers ────────────────────────────────────────────
function getPageNumbers(current, total) {
    if (total <= 7)
        return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4)
        return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3)
        return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '…', current - 1, current, current + 1, '…', total];
}
