import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '@raga/shared-ui';
import clsx from 'clsx';
// ── Route → title map ─────────────────────────────────────────────
const ROUTE_TITLES = {
    '/': 'Dashboard',
    '/analytics': 'Analytics',
    '/patients': 'Patients',
};
function usePageTitle() {
    const { pathname } = useLocation();
    if (pathname.startsWith('/patients/'))
        return 'Patient Detail';
    return ROUTE_TITLES[pathname] ?? 'HealthOS';
}
// ── Icons ─────────────────────────────────────────────────────────
const BellIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5", children: _jsx("path", { d: "M10 2a6 6 0 00-6 6v1.268l-.832 2.218A1 1 0\n             004.108 13H6a4 4 0 008 0h1.892a1 1 0\n             00.94-1.514L16 9.268V8a6 6 0 00-6-6z" }) }));
const HamburgerIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0\n         01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1\n         1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110\n         2H4a1 1 0 01-1-1z" }) }));
const ChevronDownIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-3.5 h-3.5", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1\n         1 0 111.414 1.414l-4 4a1 1 0 01-1.414\n         0l-4-4a1 1 0 010-1.414z" }) }));
const ProfileIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0\n         1114 0H3z" }) }));
const SettingsIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532\n         0 01-2.286.948c-1.372-.836-2.942.734-2.106\n         2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561\n         2.6 0 2.978a1.532 1.532 0 01.947\n         2.287c-.836 1.372.734 2.942 2.106 2.106a1.532\n         1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978\n         0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734\n         2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379\n         1.561-2.6 0-2.978a1.532 1.532 0\n         01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532\n         1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0\n         000 6z" }) }));
const LogoutIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0\n         011-1zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0\n         010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586\n         11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0\n         010-1.414z" }) }));
function UserDropdown({ open, items }) {
    return (_jsx("div", { className: clsx('absolute right-0 top-full mt-2 w-52 z-50', 'bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden', 'transition-all duration-150 origin-top-right', open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'), children: items.map(({ icon, label, onClick, danger }) => (_jsxs("button", { onClick: onClick, className: clsx('flex items-center gap-3 w-full px-4 py-2.5 text-sm', 'transition-colors duration-100', danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'), children: [_jsx("span", { className: danger ? 'text-red-500' : 'text-slate-400', children: icon }), label] }, label))) }));
}
// ── TopBar ────────────────────────────────────────────────────────
export default function TopBar({ onToggleSidebar, onToggleNotif, notifOpen }) {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const title = usePageTitle();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdown] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen)
            return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [dropdownOpen]);
    const handleLogout = useCallback(async () => {
        setDropdown(false);
        await logout();
        navigate('/login', { replace: true });
    }, [logout, navigate]);
    const dropdownItems = [
        {
            icon: _jsx(ProfileIcon, {}),
            label: 'Profile',
            onClick: () => {
                setDropdown(false);
            },
        },
        {
            icon: _jsx(SettingsIcon, {}),
            label: 'Settings',
            onClick: () => {
                setDropdown(false);
            },
        },
        {
            icon: _jsx(LogoutIcon, {}),
            label: 'Sign out',
            onClick: handleLogout,
            danger: true,
        },
    ];
    return (_jsxs("header", { className: "flex items-center h-14 px-4 gap-3\n                       bg-white border-b border-slate-100 shrink-0", children: [_jsx("button", { onClick: onToggleSidebar, "aria-label": "Toggle sidebar", className: "md:hidden p-1.5 rounded-lg text-slate-400\n                   hover:text-slate-600 hover:bg-slate-100 transition-colors", children: _jsx(HamburgerIcon, {}) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("h1", { className: "text-base font-semibold text-slate-800 truncate", children: title }) }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("button", { id: "notif-bell", onClick: onToggleNotif, "aria-label": `Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`, className: clsx('relative p-2 rounded-lg transition-colors', notifOpen
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'), children: [_jsx(BellIcon, {}), unreadCount > 0 && (_jsx("span", { className: clsx('absolute top-1.5 right-1.5 min-w-[16px] h-4 rounded-full', 'bg-red-500 text-white text-[10px] font-bold', 'flex items-center justify-center px-1 leading-none', 'ring-2 ring-white'), children: unreadCount > 99 ? '99+' : unreadCount }))] }), _jsx("div", { className: "w-px h-6 bg-slate-100 mx-1" }), user && (_jsxs("div", { ref: dropdownRef, className: "relative", children: [_jsxs("button", { onClick: () => setDropdown(o => !o), "aria-label": "User menu", "aria-expanded": dropdownOpen, className: clsx('flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg', 'transition-colors duration-150', dropdownOpen ? 'bg-slate-100' : 'hover:bg-slate-50'), children: [_jsx(Avatar, { name: user.displayName, src: user.avatar, size: "sm" }), _jsxs("div", { className: "hidden sm:block text-left min-w-0", children: [_jsx("p", { className: "text-xs font-semibold text-slate-700 truncate max-w-[120px]", children: user.displayName }), _jsx("p", { className: "text-[10px] text-slate-400 capitalize truncate", children: user.role })] }), _jsx(ChevronDownIcon, {})] }), _jsx(UserDropdown, { open: dropdownOpen, items: dropdownItems })] }))] })] }));
}
