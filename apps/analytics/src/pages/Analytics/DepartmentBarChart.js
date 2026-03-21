import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from 'recharts';
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
export default function DepartmentBarChart({ data }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100 shadow-sm p-5", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Department Breakdown" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Patient count by department" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(BarChart, { data: data, layout: "vertical", margin: { top: 0, right: 20, left: 70, bottom: 0 }, barSize: 10, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", horizontal: false }), _jsx(XAxis, { type: "number", tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { type: "category", dataKey: "department", width: 70, tick: { fontSize: 10, fill: '#64748b' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { formatter: (v, _, entry) => [
                                `${v} patients (${entry.payload.percentage}%)`,
                                entry.payload.department,
                            ], contentStyle: {
                                background: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#f8fafc',
                                fontSize: '12px',
                                padding: '8px 12px',
                            } }), _jsx(Bar, { dataKey: "count", radius: [0, 4, 4, 0], name: "Patients", children: data.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) })] }) })] }));
}
