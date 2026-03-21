import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/PatientContext';
import { postToShell } from '@raga/shared-types';
import { Avatar, Badge, Spinner, Button } from '@raga/shared-ui';
import { getPatientById, getAppointments } from '@raga/mock-api';
import VitalsPanel from './VitalsPanel';
import ContactPanel from './ContactPanel';
import OverviewTab from './OverviewTab';
import AppointmentsTab from './AppointmentsTab';
import NotesTab from './NotesTab';
import clsx from 'clsx';
const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'appointments', label: 'Appointments' },
    { key: 'notes', label: 'Notes' },
];
// ── Component ─────────────────────────────────────────────────────
export default function PatientDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthed } = usePatients();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    // ── Fetch ──────────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthed || !id)
            return;
        setLoading(true);
        setError(null);
        Promise.all([getPatientById(id), getAppointments()])
            .then(([p, appts]) => {
            if (!p) {
                setError('Patient not found.');
                return;
            }
            setPatient(p);
            setAppointments(appts.filter(a => a.patientId === id));
        })
            .catch(() => {
            setError('Failed to load patient data.');
        })
            .finally(() => setLoading(false));
    }, [id, isAuthed]);
    // ── Back navigation ────────────────────────────────────────────
    const handleBack = useCallback(() => {
        navigate('/');
        postToShell({ type: 'NAVIGATE', payload: { path: '/patients' } });
    }, [navigate]);
    // ── Auth wait ──────────────────────────────────────────────────
    if (!isAuthed) {
        return (_jsx("div", { className: "flex items-center justify-center\n                      min-h-screen bg-slate-50", children: _jsxs("div", { className: "flex flex-col items-center gap-3 text-slate-400", children: [_jsx(PulsingDot, {}), _jsx("span", { className: "text-sm", children: "Waiting for session\u2026" })] }) }));
    }
    // ── Loading ────────────────────────────────────────────────────
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center\n                      min-h-screen bg-slate-50", children: _jsx(Spinner, { size: "lg" }) }));
    }
    // ── Error ──────────────────────────────────────────────────────
    if (error || !patient) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center\n                      min-h-screen bg-slate-50 gap-4", children: [_jsx("div", { className: "h-14 w-14 rounded-full bg-red-50\n                        flex items-center justify-center", children: _jsx(ErrorIcon, {}) }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-semibold text-slate-700", children: error ?? 'Patient not found' }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: "The patient record could not be loaded." })] }), _jsx(Button, { variant: "secondary", size: "sm", onClick: handleBack, children: "\u2190 Back to Patients" })] }));
    }
    return (_jsxs("div", { className: "flex flex-col min-h-screen bg-slate-50", children: [_jsx("div", { className: "sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm\n                      border-b border-slate-100 px-6 py-3", children: _jsxs("button", { onClick: handleBack, className: "inline-flex items-center gap-1.5 text-xs\n                     font-medium text-slate-500 hover:text-indigo-600\n                     transition-colors group", children: [_jsx(ChevronLeftIcon, { className: "group-hover:-translate-x-0.5\n                                      transition-transform" }), "Back to Patients"] }) }), _jsxs("div", { className: "px-6 py-5 flex flex-col gap-5 flex-1", children: [_jsxs("div", { className: clsx('bg-white rounded-2xl border shadow-sm p-6', 'flex flex-col sm:flex-row sm:items-center gap-5', patient.status === 'critical' ? 'border-red-200' : 'border-slate-100'), children: [patient.status === 'critical' && (_jsx("div", { className: "hidden sm:block w-1 self-stretch\n                            rounded-full bg-gradient-to-b\n                            from-red-400 to-rose-600" })), _jsx(Avatar, { name: patient.name, size: "xl", className: "shadow-md shrink-0 self-start sm:self-center" }), _jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [_jsxs("div", { className: "flex items-start flex-wrap gap-2", children: [_jsx("h1", { className: "text-xl font-bold text-slate-800 leading-tight", children: patient.name }), _jsx(Badge, { status: patient.status, variant: "subtle" }), patient.status === 'critical' && (_jsx("span", { className: "inline-flex items-center gap-1 text-[10px]\n                                 font-bold text-red-600 bg-red-50 px-2 py-1\n                                 rounded-full animate-pulse border\n                                 border-red-200", children: "\u25CF CRITICAL" }))] }), _jsxs("div", { className: "flex flex-wrap gap-x-5 gap-y-1 text-xs\n                            text-slate-500", children: [_jsxs("span", { children: [_jsx("span", { className: "text-slate-400", children: "ID: " }), _jsx("span", { className: "font-mono font-medium text-slate-700", children: patient.id })] }), _jsxs("span", { children: [_jsx("span", { className: "text-slate-400", children: "Age: " }), _jsxs("span", { className: "font-medium text-slate-700", children: [patient.age, "y"] })] }), _jsxs("span", { className: "capitalize", children: [_jsx("span", { className: "text-slate-400", children: "Gender: " }), _jsx("span", { className: "font-medium text-slate-700", children: patient.gender })] }), _jsxs("span", { children: [_jsx("span", { className: "text-slate-400", children: "Blood: " }), _jsx("span", { className: "font-bold font-mono text-red-700", children: patient.bloodGroup })] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(DeptIcon, {}), _jsx("span", { className: "text-xs font-medium text-indigo-700\n                               bg-indigo-50 px-2.5 py-0.5 rounded-full", children: patient.department })] })] }), _jsxs("div", { className: "flex sm:flex-col gap-4 sm:gap-2\n                          sm:items-end shrink-0", children: [_jsx(QuickStat, { label: "Last Visit", value: patient.lastVisit }), _jsx(QuickStat, { label: "Next Appt", value: patient.nextAppointment ?? 'Not scheduled', accent: !!patient.nextAppointment })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx(VitalsPanel, { vitals: patient.vitals }), _jsx(ContactPanel, { patient: patient })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-slate-100\n                        shadow-sm overflow-hidden flex flex-col", children: [_jsx("div", { className: "flex border-b border-slate-100 px-5 pt-1", children: TABS.map(t => (_jsx("button", { onClick: () => setActiveTab(t.key), className: clsx('px-4 py-3 text-sm font-medium transition-all', 'border-b-2 -mb-px focus-visible:outline-none', 'focus-visible:ring-2 focus-visible:ring-inset', 'focus-visible:ring-indigo-500', activeTab === t.key
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'), children: t.label }, t.key))) }), _jsxs("div", { className: "p-5", children: [activeTab === 'overview' && _jsx(OverviewTab, { patient: patient }), activeTab === 'appointments' && _jsx(AppointmentsTab, { appointments: appointments }), activeTab === 'notes' && _jsx(NotesTab, { patient: patient })] })] })] })] }));
}
// ── Sub-components ────────────────────────────────────────────────
function QuickStat({ label, value, accent }) {
    return (_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[10px] text-slate-400 uppercase tracking-wide", children: label }), _jsx("p", { className: clsx('text-xs font-semibold mt-0.5 tabular-nums', accent ? 'text-indigo-600' : 'text-slate-600'), children: value })] }));
}
function PulsingDot() {
    return (_jsxs("div", { className: "relative flex h-8 w-8", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full\n                       rounded-full bg-indigo-300 opacity-50" }), _jsx("span", { className: "relative inline-flex rounded-full h-8 w-8\n                       bg-indigo-500 opacity-70" })] }));
}
// ── Icons ─────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ className }) => (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: clsx('w-3.5 h-3.5', className), children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.78 3.97a.75.75 0 010 1.06L6.81 8l2.97\n         2.97a.75.75 0 11-1.06 1.06L5.25 8.53a.75.75\n         0 010-1.06l3.47-3.47a.75.75 0 011.06 0z" }) }));
const DeptIcon = () => (_jsx("svg", { viewBox: "0 0 14 14", fill: "currentColor", className: "w-3 h-3 text-indigo-400 shrink-0", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 1a5 5 0 100 10A5 5 0 007 1zM0 6a7 7 0\n         1114 0A7 7 0 010 6z" }) }));
const ErrorIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-6 h-6 text-red-400", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75\n         0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75\n         0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" }) }));
