import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@raga/shared-ui';
import clsx from 'clsx';
const TYPE_LABEL = {
    'in-person': 'In-person',
    virtual: 'Virtual',
    'follow-up': 'Follow-up',
    emergency: 'Emergency',
};
export default function AppointmentsTab({ appointments }) {
    if (appointments.length === 0) {
        return (_jsxs("div", { className: "py-12 flex flex-col items-center justify-center text-slate-400 gap-2", children: [_jsx(CalendarIcon, { className: "w-8 h-8 opacity-20" }), _jsx("p", { className: "text-sm", children: "No appointments scheduled for this patient." })] }));
    }
    return (_jsx("div", { className: "overflow-x-auto -mx-5", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-slate-50", children: ['Date & Time', 'Type', 'Status', 'Doctor'].map(h => (_jsx("th", { className: "px-5 py-3 text-left text-[10px]\n                                     font-bold text-slate-400\n                                     uppercase tracking-wider", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: appointments.map(appt => (_jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [_jsx("td", { className: "px-5 py-3.5", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-xs font-semibold text-slate-700 tabular-nums", children: appt.time }), _jsx("span", { className: "text-[10px] text-slate-400", children: "Today" })] }) }), _jsx("td", { className: "px-5 py-3.5", children: _jsx("span", { className: clsx('text-[11px] font-medium px-2 py-0.5 rounded-full', appt.type === 'virtual'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-slate-100 text-slate-600'), children: TYPE_LABEL[appt.type] ?? appt.type }) }), _jsx("td", { className: "px-5 py-3.5", children: _jsx(Badge, { status: appt.status, variant: "subtle" }) }), _jsx("td", { className: "px-5 py-3.5", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500", children: "Dr" }), _jsx("span", { className: "text-xs text-slate-600", children: "Cardiology Dept" })] }) })] }, appt.id))) })] }) }));
}
const CalendarIcon = ({ className }) => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: className, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" }) }));
