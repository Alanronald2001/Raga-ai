import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const TYPE_CONFIG = {
    admission: { dot: 'bg-indigo-500', icon: '↓', label: 'bg-indigo-50  text-indigo-600' },
    discharge: { dot: 'bg-emerald-500', icon: '↑', label: 'bg-emerald-50 text-emerald-600' },
    alert: { dot: 'bg-red-500', icon: '!', label: 'bg-red-50     text-red-600' },
    appointment: { dot: 'bg-sky-500', icon: '◷', label: 'bg-sky-50     text-sky-600' },
    lab: { dot: 'bg-amber-500', icon: '⚗', label: 'bg-amber-50   text-amber-600' },
};
function relTime(iso) {
    const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (m < 1)
        return 'just now';
    if (m < 60)
        return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
}
export default function ActivityFeed({ items }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100\n                    shadow-sm overflow-hidden flex flex-col", children: [_jsx("div", { className: "px-5 py-4 border-b border-slate-50 shrink-0", children: _jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Activity Feed" }) }), _jsx("ul", { className: "flex-1 overflow-y-auto divide-y divide-slate-50\n                     max-h-[340px]", children: items.map(item => {
                    const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.appointment;
                    return (_jsxs("li", { className: "flex items-start gap-3 px-5 py-3\n                           hover:bg-slate-50 transition-colors", children: [_jsx("span", { className: clsx('mt-0.5 h-6 w-6 rounded-full flex items-center justify-center', 'text-[10px] font-bold shrink-0', cfg.label), children: cfg.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs text-slate-700 leading-relaxed line-clamp-2", children: item.message }), _jsx("p", { className: "text-[10px] text-slate-400 mt-0.5 tabular-nums", children: relTime(item.timestamp) })] }), _jsx("span", { className: clsx('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', cfg.dot) })] }, item.id));
                }) })] }));
}
