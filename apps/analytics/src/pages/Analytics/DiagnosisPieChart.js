import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const COLORS = [
    '#6366f1',
    '#0ea5e9',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#14b8a6',
    '#f97316',
    '#ec4899',
    '#64748b',
];
const total = (data) => data.reduce((s, d) => s + d.count, 0);
export default function DiagnosisPieChart({ data }) {
    const sum = total(data);
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100 shadow-sm p-5", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Diagnosis Categories" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Case distribution by diagnosis" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(ResponsiveContainer, { width: "55%", height: 220, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, dataKey: "count", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 90, innerRadius: 52, paddingAngle: 2, strokeWidth: 0, children: data.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) }), _jsx(Tooltip, { formatter: (v, name) => [
                                        `${v} (${((v / sum) * 100).toFixed(1)}%)`,
                                        name,
                                    ], contentStyle: {
                                        background: '#1e293b',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        fontSize: '12px',
                                        padding: '8px 12px',
                                    } })] }) }), _jsx("div", { className: "flex-1 space-y-1.5 overflow-y-auto max-h-[220px]", children: data.map((d, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full shrink-0", style: { background: COLORS[i % COLORS.length] } }), _jsx("span", { className: "text-[11px] text-slate-600 truncate flex-1", children: d.category }), _jsxs("span", { className: "text-[11px] text-slate-400 tabular-nums shrink-0", children: [((d.count / sum) * 100).toFixed(0), "%"] })] }, d.category))) })] })] }));
}
