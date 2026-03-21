import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '@raga/shared-ui';
import clsx from 'clsx';
// ── Icons ─────────────────────────────────────────────────────────
const HomeIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 shrink-0", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0\n         01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1\n         1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0\n         01-.707-1.707l7-7z" }) }));
const ChartIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 shrink-0", children: _jsx("path", { d: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1\n             1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1\n             0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0\n             011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" }) }));
const UsersIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 shrink-0", children: _jsx("path", { d: "M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0\n             3 3 0 016 0zM9 12a3 3 0 100 6 3 3 0 000-6zm8\n             3a3 3 0 11-6 0 3 3 0 016 0z" }) }));
const ChevronIcon = ({ flipped }) => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: clsx('w-4 h-4 transition-transform duration-200', flipped && 'rotate-180'), children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293\n         3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0\n         010-1.414l4-4a1 1 0 011.414 0z" }) }));
const LogoutIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-4 h-4 shrink-0", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293\n         4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3\n         3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0\n         110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" }) }));
// ── Nav config ────────────────────────────────────────────────────
const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: _jsx(HomeIcon, {}), end: true },
    { to: '/analytics', label: 'Analytics', icon: _jsx(ChartIcon, {}) },
    { to: '/patients', label: 'Patients', icon: _jsx(UsersIcon, {}) },
];
// ── Tooltip wrapper (collapsed mode) ──────────────────────────────
function Tooltip({ label, children }) {
    return (_jsxs("div", { className: "relative group/tooltip", children: [children, _jsxs("div", { className: [
                    'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
                    'bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg',
                    'whitespace-nowrap shadow-lg',
                    'opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100',
                    'transition-all duration-150',
                ].join(' '), children: [label, _jsx("div", { className: "absolute right-full top-1/2 -translate-y-1/2\n                        border-4 border-transparent border-r-slate-800" })] })] }));
}
// ── Main component ────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/login', { replace: true });
    }, [logout, navigate]);
    return (_jsxs("div", { className: "flex flex-col h-full overflow-hidden", children: [_jsxs("div", { className: clsx('flex items-center h-14 shrink-0 border-b border-slate-100', 'transition-all duration-200', collapsed ? 'justify-center px-0' : 'justify-between px-4'), children: [!collapsed && (_jsxs("div", { className: "flex items-center gap-2 overflow-hidden", children: [_jsx("div", { className: "h-7 w-7 rounded-lg bg-indigo-600 flex items-center\n                            justify-center shrink-0", children: _jsx("svg", { viewBox: "0 0 20 20", fill: "white", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4\n                     4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0\n                     010-5.656z" }) }) }), _jsx("span", { className: "font-bold text-slate-800 text-base tracking-tight truncate", children: "HealthOS" })] })), _jsx("button", { onClick: onToggle, "aria-label": collapsed ? 'Expand sidebar' : 'Collapse sidebar', className: clsx('p-1.5 rounded-lg text-slate-400 transition-colors', 'hover:text-slate-600 hover:bg-slate-100', collapsed && 'mx-auto'), children: _jsx(ChevronIcon, { flipped: collapsed }) })] }), _jsx("nav", { className: "flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto overflow-x-hidden", children: NAV_ITEMS.map(({ to, label, icon, end }) => {
                    const linkEl = (_jsxs(NavLink, { to: to, end: end, className: ({ isActive }) => clsx('flex items-center gap-3 rounded-lg text-sm font-medium', 'transition-all duration-150 select-none', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500', collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5', isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'), children: [icon, !collapsed && (_jsx("span", { className: "truncate transition-opacity duration-150", children: label }))] }));
                    return collapsed ? (_jsx(Tooltip, { label: label, children: linkEl }, to)) : (_jsx("div", { children: linkEl }, to));
                }) }), user && (_jsx("div", { className: clsx('shrink-0 border-t border-slate-100 transition-all duration-200', collapsed ? 'p-2' : 'p-3'), children: collapsed ? (_jsx(Tooltip, { label: `Sign out ${user.displayName}`, children: _jsx("button", { onClick: handleLogout, "aria-label": "Sign out", className: "flex items-center justify-center w-full p-2 rounded-lg\n                           text-slate-400 hover:text-red-500 hover:bg-red-50\n                           transition-colors duration-150", children: _jsx(LogoutIcon, {}) }) })) : (_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx(Avatar, { name: user.displayName, src: user.avatar, size: "sm" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-semibold text-slate-700 truncate", children: user.displayName }), _jsx("p", { className: "text-[10px] text-slate-400 truncate capitalize", children: user.role })] }), _jsx("button", { onClick: handleLogout, "aria-label": "Sign out", className: "p-1.5 rounded-lg text-slate-300 hover:text-red-500\n                           hover:bg-red-50 transition-colors duration-150 shrink-0", children: _jsx(LogoutIcon, {}) })] })) }))] }));
}
