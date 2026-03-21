import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Add to AppLayout.tsx — replace the existing file's imports + body
import { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useMFEBridge } from '../../hooks/useMFEBridge';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationPanel from '../notifications/NotificationPanel';
const SIDEBAR_KEY = 'healthos:sidebar:collapsed';
export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return localStorage.getItem(SIDEBAR_KEY) === 'true';
        }
        catch {
            return false;
        }
    });
    const [notifOpen, setNotifOpen] = useState(false);
    // ── MFE iframe refs ────────────────────────────────────────────
    const patientsRef = useRef(null);
    const analyticsRef = useRef(null);
    // ── Bridge — centralises all cross-frame messaging ─────────────
    const { postToPatients, postToAnalytics } = useMFEBridge({
        patientsRef,
        analyticsRef,
    });
    // Expose refs via context or pass down if needed
    // For now AppLayout just holds them — MFEFrame components
    // use their own onLoad to send initial auth
    const toggleSidebar = useCallback(() => {
        setCollapsed(prev => {
            const next = !prev;
            try {
                localStorage.setItem(SIDEBAR_KEY, String(next));
            }
            catch { }
            return next;
        });
    }, []);
    useEffect(() => {
        if (!notifOpen)
            return;
        const handler = (e) => {
            const panel = document.getElementById('notif-panel');
            const bell = document.getElementById('notif-bell');
            if (panel && !panel.contains(e.target) && bell && !bell.contains(e.target))
                setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [notifOpen]);
    return (_jsxs("div", { className: "flex h-screen w-screen overflow-hidden bg-slate-50", children: [_jsx("aside", { className: [
                    'hidden md:flex flex-col shrink-0 h-full',
                    'bg-white border-r border-slate-100 shadow-sm',
                    'transition-all duration-200 ease-in-out',
                    collapsed ? 'w-16' : 'w-60',
                ].join(' '), children: _jsx(Sidebar, { collapsed: collapsed, onToggle: toggleSidebar }) }), _jsxs("div", { className: "flex flex-col flex-1 min-w-0 h-full overflow-hidden", children: [_jsx(TopBar, { sidebarCollapsed: collapsed, onToggleSidebar: toggleSidebar, onToggleNotif: () => setNotifOpen(o => !o), notifOpen: notifOpen }), _jsxs("div", { className: "relative flex flex-1 min-h-0 overflow-hidden", children: [_jsx("main", { className: "flex-1 min-w-0 overflow-hidden", children: _jsx(Outlet, {}) }), notifOpen && (_jsx("div", { id: "notif-panel", className: [
                                    'absolute right-0 top-0 h-full z-30',
                                    'w-80 bg-white border-l border-slate-100 shadow-xl',
                                    'animate-slide-in-right',
                                ].join(' '), children: _jsx(NotificationPanel, { onClose: () => setNotifOpen(false) }) }))] }), _jsxs("nav", { className: "md:hidden flex items-center justify-around\n                        border-t border-slate-100 bg-white h-16\n                        shrink-0 px-2", children: [_jsx(MobileTab, { to: "/", icon: "\uD83C\uDFE0", label: "Home" }), _jsx(MobileTab, { to: "/patients", icon: "\uD83D\uDC65", label: "Patients" }), _jsx(MobileTab, { to: "/analytics", icon: "\uD83D\uDCCA", label: "Analytics" })] })] })] }));
}
import { NavLink } from 'react-router-dom';
function MobileTab({ to, icon, label }) {
    return (_jsxs(NavLink, { to: to, end: to === '/', className: ({ isActive }) => [
            'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl',
            'text-xs font-medium transition-colors duration-150',
            isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600',
        ].join(' '), children: [_jsx("span", { className: "text-xl leading-none", children: icon }), _jsx("span", { children: label })] }));
}
