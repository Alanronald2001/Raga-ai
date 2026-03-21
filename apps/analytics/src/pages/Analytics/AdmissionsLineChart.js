import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, } from 'recharts';
export default function AdmissionsLineChart({ data }) {
    const peak = Math.max(...data.map(d => d.admissions));
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100 shadow-sm p-5", children: [_jsxs("div", { className: "flex items-start justify-between mb-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Patient Admissions Trend" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Admissions vs discharges over selected period" })] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-slate-500", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-indigo-500" }), "Admissions"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500" }), "Discharges"] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 240, children: _jsxs(LineChart, { data: data, margin: { top: 10, right: 10, left: -15, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fontSize: 11, fill: '#94a3b8' }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: {
                                background: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#f8fafc',
                                fontSize: '12px',
                                padding: '8px 12px',
                            }, cursor: { stroke: '#e2e8f0', strokeWidth: 1 } }), _jsx(Legend, { wrapperStyle: { fontSize: '11px', paddingTop: '12px' }, iconType: "circle", iconSize: 8 }), _jsx(ReferenceLine, { y: peak, stroke: "#6366f1", strokeDasharray: "4 4", strokeOpacity: 0.4, label: {
                                value: `Peak: ${peak}`,
                                position: 'right',
                                fontSize: 10,
                                fill: '#6366f1',
                            } }), _jsx(Line, { type: "monotone", dataKey: "admissions", name: "Admissions", stroke: "#6366f1", strokeWidth: 2.5, dot: { fill: '#6366f1', r: 3, strokeWidth: 0 }, activeDot: { r: 5, fill: '#6366f1' } }), _jsx(Line, { type: "monotone", dataKey: "discharges", name: "Discharges", stroke: "#22c55e", strokeWidth: 2.5, dot: { fill: '#22c55e', r: 3, strokeWidth: 0 }, activeDot: { r: 5, fill: '#22c55e' } })] }) })] }));
}
