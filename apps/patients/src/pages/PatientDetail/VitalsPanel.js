import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
function status(val, low, high) {
    if (val < low)
        return 'low';
    if (val > high)
        return 'high';
    return 'normal';
}
const STATUS_STYLES = {
    normal: { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', badge: 'Normal' },
    low: { bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', badge: 'Low' },
    high: { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', badge: 'High' },
};
export default function VitalsPanel({ vitals }) {
    const rows = [
        {
            label: 'Heart Rate',
            value: vitals.heartRate,
            unit: 'bpm',
            low: 60,
            high: 100,
            raw: vitals.heartRate,
            icon: _jsx(HeartIcon, {}),
        },
        {
            label: 'Blood Pressure',
            value: vitals.bloodPressure,
            unit: 'mmHg',
            low: 90,
            high: 140,
            raw: parseInt(vitals.bloodPressure.split('/')[0]),
            icon: _jsx(PressureIcon, {}),
        },
        {
            label: 'Temperature',
            value: vitals.temperature,
            unit: '°F',
            low: 97,
            high: 99.5,
            raw: vitals.temperature,
            icon: _jsx(TempIcon, {}),
        },
        {
            label: 'SpO₂',
            value: vitals.oxygenSaturation,
            unit: '%',
            low: 95,
            high: 100,
            raw: vitals.oxygenSaturation,
            icon: _jsx(LungIcon, {}),
        },
        {
            label: 'Weight',
            value: vitals.weight,
            unit: 'kg',
            low: 30,
            high: 200,
            raw: vitals.weight,
            icon: _jsx(WeightIcon, {}),
        },
    ];
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100\n                    shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-50", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Vitals" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Latest recorded values" })] }), _jsx("div", { className: "divide-y divide-slate-50", children: rows.map(row => {
                    const s = status(row.raw, row.low, row.high);
                    const cfg = STATUS_STYLES[s];
                    const pct = Math.min(100, ((row.raw - row.low * 0.6) / (row.high * 1.2 - row.low * 0.6)) * 100);
                    return (_jsxs("div", { className: "flex items-center gap-4 px-5 py-3.5", children: [_jsx("div", { className: clsx('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', cfg.bg), children: _jsx("span", { className: cfg.text, children: row.icon }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [_jsx("span", { className: "text-xs font-medium text-slate-600", children: row.label }), _jsx("span", { className: clsx('text-[10px] font-semibold px-1.5 py-0.5', 'rounded-full', cfg.bg, cfg.text), children: cfg.badge })] }), _jsx("div", { className: "h-1.5 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: clsx('h-full rounded-full transition-all', cfg.bar), style: { width: `${Math.max(4, pct)}%` } }) })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsx("p", { className: "text-sm font-bold text-slate-800 tabular-nums", children: row.value }), _jsx("p", { className: "text-[10px] text-slate-400", children: row.unit })] })] }, row.label));
                }) })] }));
}
// ── Icons ─────────────────────────────────────────────────────────
const ic = 'w-4 h-4';
const HeartIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" }) }));
const PressureIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { d: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" }) }));
const TempIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 2a1 1 0 011 1v7.586l2.707 2.707A1 1 0 0112 15H8a1 1 0 01-.707-1.707L10 10.586V3a1 1 0 011-1z" }) }));
const LungIcon = () => (_jsxs("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: [_jsx("path", { d: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" }), _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" })] }));
const WeightIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 2a4 4 0 00-4 4H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-1a4 4 0 00-4-4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 9a3 3 0 100-6 3 3 0 000 6z" }) }));
