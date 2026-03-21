import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const ListIcon = () => (_jsx("svg", { className: "h-4 w-4", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { strokeLinecap: "round", d: "M2 4h12M2 8h12M2 12h12" }) }));
const GridIcon = () => (_jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: [_jsx("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }), _jsx("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1" }), _jsx("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1" }), _jsx("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1" })] }));
export function Toggle({ value, onChange, className }) {
    return (_jsx("div", { role: "group", "aria-label": "View mode", className: clsx('inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 gap-0.5', className), children: ['list', 'grid'].map(mode => (_jsx("button", { type: "button", role: "radio", "aria-checked": value === mode, "aria-label": `${mode} view`, onClick: () => onChange(mode), className: clsx('flex items-center justify-center h-7 w-7 rounded-md transition-all duration-150', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500', value === mode
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'), children: mode === 'list' ? _jsx(ListIcon, {}) : _jsx(GridIcon, {}) }, mode))) }));
}
