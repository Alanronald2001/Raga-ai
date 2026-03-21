import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ContactPanel({ patient: p }) {
    const rows = [
        { label: 'Phone', value: p.phone, icon: _jsx(PhoneIcon, {}) },
        { label: 'Email', value: p.email, icon: _jsx(EmailIcon, {}) },
        { label: 'Address', value: p.address, icon: _jsx(MapIcon, {}) },
        { label: 'Next Appt', value: p.nextAppointment ?? 'Not scheduled', icon: _jsx(CalIcon, {}) },
    ];
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100\n                    shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-slate-50", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-800", children: "Contact & Schedule" }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Patient contact information" })] }), _jsx("div", { className: "divide-y divide-slate-50", children: rows.map(({ label, value, icon }) => (_jsxs("div", { className: "flex items-start gap-4 px-5 py-3.5", children: [_jsx("span", { className: "mt-0.5 h-8 w-8 rounded-lg bg-slate-50\n                             flex items-center justify-center shrink-0\n                             text-slate-400", children: icon }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-[10px] text-slate-400 uppercase tracking-wide", children: label }), _jsx("p", { className: "text-xs font-medium text-slate-700 mt-0.5\n                            break-words", children: value })] })] }, label))) })] }));
}
const ic = 'w-4 h-4';
const PhoneIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { d: "M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" }) }));
const EmailIcon = () => (_jsxs("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: [_jsx("path", { d: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" }), _jsx("path", { d: "M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" })] }));
const MapIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" }) }));
const CalIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: ic, children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" }) }));
