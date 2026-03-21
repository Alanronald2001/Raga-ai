import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '@raga/shared-ui';
import { postToShell } from '@raga/shared-types';
import clsx from 'clsx';
// ── Vital threshold colors ────────────────────────────────────────
function vitalColor(val, low, high) {
    return val < low || val > high ? 'text-red-500' : 'text-emerald-600';
}
// ── Patient card ──────────────────────────────────────────────────
function PatientCard({ patient: p, index, onClick, }) {
    return (_jsxs("div", { role: "button", tabIndex: 0, onClick: () => onClick(p), onKeyDown: e => (e.key === 'Enter' || e.key === ' ') && onClick(p), "aria-label": `View profile for ${p.name}`, className: clsx(
        // Base
        'group relative bg-white rounded-2xl border border-slate-100', 'flex flex-col overflow-hidden cursor-pointer select-none', 'focus-visible:outline-none focus-visible:ring-2', 'focus-visible:ring-indigo-500 focus-visible:ring-offset-2', 
        // Hover lift
        'shadow-sm hover:shadow-lg hover:shadow-slate-200/60', 'hover:-translate-y-0.5 hover:border-indigo-200', 
        // Entry animation stagger
        'animate-fade-in-up', 
        // Critical pulse border
        p.status === 'critical' && 'border-red-200 hover:border-red-300'), style: { animationDelay: `${Math.min(index * 30, 300)}ms` }, children: [p.status === 'critical' && (_jsx("div", { className: "absolute top-0 inset-x-0 h-0.5\n                        bg-gradient-to-r from-red-400 to-rose-500" })), _jsxs("div", { className: "flex flex-col gap-4 p-5 flex-1", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Avatar, { name: p.name, src: undefined, size: "lg", className: "shrink-0 shadow-sm" }), _jsxs("div", { className: "flex-1 min-w-0 pt-0.5", children: [_jsx("p", { className: "text-sm font-bold text-slate-800\n                          group-hover:text-indigo-600 transition-colors\n                          truncate leading-tight", children: p.name }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: [p.age, "y \u00B7 ", _jsx("span", { className: "capitalize", children: p.gender })] }), _jsx("div", { className: "mt-2", children: _jsx(Badge, { status: p.status }) })] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1\n                           rounded-full bg-slate-100 text-slate-600\n                           text-[11px] font-medium truncate max-w-[150px]", children: [_jsx(DeptIcon, {}), p.department] }), _jsx("span", { className: "inline-flex items-center px-2.5 py-1\n                           rounded-full bg-red-50 text-red-700\n                           text-[11px] font-bold font-mono", children: p.bloodGroup })] }), _jsxs("div", { className: "grid grid-cols-3 gap-1 px-3 py-2.5\n                        bg-slate-50 rounded-xl", children: [_jsx(VitalPill, { label: "HR", value: p.vitals.heartRate, unit: "bpm", color: vitalColor(p.vitals.heartRate, 60, 100) }), _jsx(VitalPill, { label: "SpO\u2082", value: p.vitals.oxygenSaturation, unit: "%", color: vitalColor(p.vitals.oxygenSaturation, 95, 100) }), _jsx(VitalPill, { label: "Temp", value: p.vitals.temperature, unit: "\u00B0F", color: vitalColor(p.vitals.temperature, 97, 99) })] }), _jsxs("div", { className: "flex items-center justify-between\n                        text-[11px] text-slate-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(CalendarIcon, {}), "Last: ", p.lastVisit] }), p.nextAppointment && (_jsxs("span", { className: "text-indigo-500 font-medium", children: ["Next: ", p.nextAppointment] }))] })] }), _jsx("div", { className: clsx('px-5 pb-4 pt-1', 'translate-y-1 group-hover:translate-y-0', 'transition-transform duration-200'), children: _jsxs("div", { className: clsx('flex items-center justify-center gap-1.5', 'w-full py-2 rounded-xl text-xs font-semibold', 'border border-slate-100 text-slate-400', 'group-hover:bg-indigo-600 group-hover:text-white', 'group-hover:border-indigo-600', 'transition-all duration-200'), children: ["View Profile", _jsx(ArrowIcon, {})] }) })] }));
}
// ── Grid component ────────────────────────────────────────────────
export default function PatientGrid({ patients }) {
    const navigate = useNavigate();
    const handleClick = (p) => {
        navigate(`/${p.id}`);
        postToShell({ type: 'NAVIGATE', payload: { path: `/patients/${p.id}` } });
    };
    if (patients.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center\n                      min-h-[400px] gap-3 text-slate-400 select-none", children: [_jsx("div", { className: "h-16 w-16 rounded-full bg-slate-100\n                        flex items-center justify-center text-3xl", children: "\uD83D\uDD0D" }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "No patients found" }), _jsx("p", { className: "text-xs mt-1", children: "Try adjusting your search or filter criteria" })] })] }));
    }
    return (_jsx("div", { className: clsx('grid gap-4', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'), children: patients.map((p, i) => (_jsx(PatientCard, { patient: p, index: i, onClick: handleClick }, p.id))) }));
}
// ── Sub-components ────────────────────────────────────────────────
function VitalPill({ label, value, unit, color, }) {
    return (_jsxs("div", { className: "flex flex-col items-center gap-0.5 py-0.5", children: [_jsx("span", { className: "text-[9px] text-slate-400 uppercase tracking-wider", children: label }), _jsxs("span", { className: clsx('text-xs font-bold tabular-nums', color), children: [value, _jsx("span", { className: "text-[9px] font-normal text-slate-400 ml-0.5", children: unit })] })] }));
}
// ── Icons ─────────────────────────────────────────────────────────
const DeptIcon = () => (_jsx("svg", { viewBox: "0 0 12 12", fill: "currentColor", className: "w-3 h-3 shrink-0", children: _jsx("path", { d: "M6 1a4 4 0 100 8A4 4 0 006 1zM0 6a6 6 0\n             1112 0A6 6 0 010 6z" }) }));
const CalendarIcon = () => (_jsx("svg", { viewBox: "0 0 12 12", fill: "currentColor", className: "w-3 h-3 shrink-0", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 1a.5.5 0 01.5.5V2h3V1.5a.5.5 0 011\n         0V2H9a2 2 0 012 2v5a2 2 0 01-2 2H3a2\n         2 0 01-2-2V4a2 2 0 012-2h.5V1.5A.5.5\n         0 014 1zm5 3H3a1 1 0 00-1 1v4a1 1 0\n         001 1h6a1 1 0 001-1V5a1 1 0 00-1-1z" }) }));
const ArrowIcon = () => (_jsx("svg", { viewBox: "0 0 12 12", fill: "currentColor", className: "w-3 h-3", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6a.5.5 0 01.5-.5h5.793L6.146 3.354a.5.5\n         0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5\n         0 01-.708-.708L8.293 6.5H2.5A.5.5 0 012 6z" }) }));
