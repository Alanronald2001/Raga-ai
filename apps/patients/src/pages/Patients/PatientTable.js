import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '@raga/shared-ui';
import { postToShell } from '@raga/shared-types';
import clsx from 'clsx';
const COLUMNS = [
    { key: 'name', label: 'Patient', width: 'w-52' },
    { key: 'age', label: 'Age', width: 'w-16', align: 'center' },
    { key: null, label: 'Gender', width: 'w-20' },
    { key: 'status', label: 'Status', width: 'w-28' },
    { key: 'department', label: 'Department', width: 'w-36' },
    { key: null, label: 'Blood', width: 'w-20', align: 'center' },
    { key: 'lastVisit', label: 'Last Visit', width: 'w-28' },
    { key: null, label: 'Actions', width: 'w-20', align: 'center' },
];
// ── Sort helpers ──────────────────────────────────────────────────
function sortPatients(patients, sort) {
    return [...patients].sort((a, b) => {
        let cmp = 0;
        switch (sort.key) {
            case 'name':
                cmp = a.name.localeCompare(b.name);
                break;
            case 'age':
                cmp = a.age - b.age;
                break;
            case 'department':
                cmp = a.department.localeCompare(b.department);
                break;
            case 'status':
                cmp = a.status.localeCompare(b.status);
                break;
            case 'lastVisit':
                cmp = a.lastVisit.localeCompare(b.lastVisit);
                break;
        }
        return sort.dir === 'asc' ? cmp : -cmp;
    });
}
// ── Sort icon ─────────────────────────────────────────────────────
function SortIcon({ active, dir }) {
    return (_jsxs("span", { className: clsx('inline-flex flex-col gap-[1px] ml-1 transition-opacity', active ? 'opacity-100' : 'opacity-25 group-hover/th:opacity-60'), children: [_jsx("svg", { viewBox: "0 0 8 8", className: clsx('w-2 h-2 transition-colors', active && dir === 'asc' ? 'text-indigo-600' : 'text-slate-400'), fill: "currentColor", children: _jsx("path", { d: "M4 1L7 6H1L4 1Z" }) }), _jsx("svg", { viewBox: "0 0 8 8", className: clsx('w-2 h-2 transition-colors', active && dir === 'desc' ? 'text-indigo-600' : 'text-slate-400'), fill: "currentColor", children: _jsx("path", { d: "M4 7L1 2H7L4 7Z" }) })] }));
}
// ── Main component ────────────────────────────────────────────────
export default function PatientTable({ patients }) {
    const navigate = useNavigate();
    const [sort, setSort] = useState({
        key: 'name',
        dir: 'asc',
    });
    const handleSort = useCallback((key) => {
        setSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
    }, []);
    const sorted = useMemo(() => sortPatients(patients, sort), [patients, sort]);
    const handleRowClick = useCallback((p) => {
        navigate(`/${p.id}`);
        postToShell({ type: 'NAVIGATE', payload: { path: `/patients/${p.id}` } });
    }, [navigate]);
    return (_jsx("div", { className: "bg-white rounded-xl border border-slate-100\n                    shadow-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { className: "sticky top-0 z-10", children: _jsx("tr", { className: "bg-slate-50 border-b border-slate-100", children: COLUMNS.map(col => (_jsx("th", { className: clsx('px-4 py-3 text-xs font-semibold text-slate-500', 'uppercase tracking-wide whitespace-nowrap select-none', col.align === 'center' && 'text-center', col.align === 'right' && 'text-right', !col.align && 'text-left', col.key && 'cursor-pointer group/th', col.key && 'hover:text-slate-700 hover:bg-slate-100', col.key && 'transition-colors duration-100', col.width), onClick: () => col.key && handleSort(col.key), "aria-sort": col.key && sort.key === col.key
                                    ? sort.dir === 'asc'
                                        ? 'ascending'
                                        : 'descending'
                                    : undefined, children: _jsxs("span", { className: "inline-flex items-center gap-0.5", children: [col.label, col.key && _jsx(SortIcon, { active: sort.key === col.key, dir: sort.dir })] }) }, col.label))) }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: sorted.length === 0 ? (_jsx(EmptyRow, {})) : (sorted.map(p => _jsx(PatientRow, { patient: p, onClick: handleRowClick }, p.id))) })] }) }) }));
}
// ── Patient row ───────────────────────────────────────────────────
function PatientRow({ patient: p, onClick }) {
    return (_jsxs("tr", { onClick: () => onClick(p), className: clsx('group cursor-pointer transition-colors duration-100', 'hover:bg-indigo-50/40', p.status === 'critical' && 'bg-red-50/30 hover:bg-red-50/60'), children: [_jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { name: p.name, size: "sm" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-xs font-semibold text-slate-800\n                          group-hover:text-indigo-600 transition-colors\n                          truncate max-w-[140px]", children: p.name }), _jsx("p", { className: "text-[10px] text-slate-400 font-mono", children: p.id })] })] }) }), _jsx("td", { className: "px-4 py-3 text-center", children: _jsxs("span", { className: "text-xs text-slate-600 tabular-nums", children: [p.age, _jsx("span", { className: "text-slate-400", children: "y" })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: clsx('text-xs capitalize px-2 py-0.5 rounded-full font-medium', p.gender === 'male' && 'bg-sky-50 text-sky-700', p.gender === 'female' && 'bg-pink-50 text-pink-700', p.gender === 'other' && 'bg-slate-100 text-slate-600'), children: p.gender }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-1.5", children: [p.status === 'critical' && (_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-red-500\n                             animate-pulse shrink-0" })), _jsx(Badge, { status: p.status })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "text-xs text-slate-600 truncate block max-w-[130px]", children: p.department }) }), _jsx("td", { className: "px-4 py-3 text-center", children: _jsx("span", { className: "text-xs font-bold font-mono px-2 py-0.5\n                         rounded-md bg-red-50 text-red-700", children: p.bloodGroup }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "text-xs text-slate-500 tabular-nums", children: p.lastVisit }) }), _jsx("td", { className: "px-4 py-3 text-center", children: _jsx("button", { onClick: e => {
                        e.stopPropagation();
                        onClick(p);
                    }, "aria-label": `View ${p.name}`, className: "p-1.5 rounded-lg text-slate-300\n                     hover:text-indigo-600 hover:bg-indigo-50\n                     transition-colors duration-100\n                     opacity-0 group-hover:opacity-100", children: _jsx(ChevronRightIcon, {}) }) })] }));
}
// ── Empty state row ───────────────────────────────────────────────
function EmptyRow() {
    return (_jsx("tr", { children: _jsx("td", { colSpan: COLUMNS.length, children: _jsxs("div", { className: "flex flex-col items-center justify-center\n                        py-16 gap-3 text-slate-400 select-none", children: [_jsx("div", { className: "h-14 w-14 rounded-full bg-slate-100\n                          flex items-center justify-center", children: _jsx(EmptyIcon, {}) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "No patients match your filters" }), _jsx("p", { className: "text-xs mt-1 text-slate-400", children: "Try adjusting your search or filter criteria" })] })] }) }) }));
}
// ── Icons ─────────────────────────────────────────────────────────
const ChevronRightIcon = () => (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75\n         0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06\n         L9.94 8 6.22 4.28a.75.75 0 010-1.06z" }) }));
const EmptyIcon = () => (_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-7 h-7 text-slate-300", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0\n         017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0\n         A17.933 17.933 0 0112 21.75c-2.676\n         0-5.216-.584-7.499-1.632z" }) }));
