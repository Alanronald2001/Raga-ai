import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from '@raga/shared-ui';
const PATIENT_NAMES = {
    p001: 'Arjun Mehta',
    p002: 'Priya Nair',
    p003: 'Ravi Shankar',
    p006: 'Meena Krishnan',
    p008: 'Anjali Singh',
    p009: 'Suresh Iyer',
    p013: 'Amit Joshi',
    p015: 'Vijay Kumar',
    p019: 'Santosh Yadav',
    p022: 'Savitha Gowda',
    p025: 'Mohan Lal',
};
const TYPE_LABEL = {
    'in-person': 'In-person',
    virtual: 'Virtual',
    'follow-up': 'Follow-up',
    emergency: 'Emergency',
};
export default function RecentAppointmentsTable({ appointments }) {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-50 flex\n                      items-center justify-between", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Today's Appointments" }), _jsxs("span", { className: "text-xs text-slate-400", children: [appointments.length, " total"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-slate-50", children: ['Patient', 'Time', 'Type', 'Status'].map(h => (_jsx("th", { className: "px-5 py-3 text-left text-xs\n                                       font-medium text-slate-400\n                                       uppercase tracking-wide", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-slate-50", children: appointments.map(appt => (_jsxs("tr", { className: "hover:bg-slate-50 transition-colors", children: [_jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "h-7 w-7 rounded-full bg-indigo-100\n                                    text-indigo-700 flex items-center\n                                    justify-center text-xs font-bold shrink-0", children: (PATIENT_NAMES[appt.patientId] ?? '?')[0] }), _jsx("span", { className: "font-medium text-slate-700 text-xs", children: PATIENT_NAMES[appt.patientId] ?? appt.patientId })] }) }), _jsx("td", { className: "px-5 py-3 text-xs text-slate-500 tabular-nums", children: appt.time }), _jsx("td", { className: "px-5 py-3", children: _jsx("span", { className: "text-xs text-slate-500", children: TYPE_LABEL[appt.type] ?? appt.type }) }), _jsx("td", { className: "px-5 py-3", children: _jsx(Badge, { status: appt.status }) })] }, appt.id))) })] }) })] }));
}
