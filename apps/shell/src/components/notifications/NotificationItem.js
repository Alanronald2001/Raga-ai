import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import clsx from 'clsx';
// ── Relative time ─────────────────────────────────────────────────
function relativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60)
        return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60)
        return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)
        return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)
        return `${d}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
// ── Type config ───────────────────────────────────────────────────
const TYPE_CONFIG = {
    alert: {
        bg: 'bg-red-50',
        icon: 'bg-red-100 text-red-600',
        dot: 'bg-red-500',
        svg: (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 1a7 7 0 100 14A7 7 0 008 1zm-.75\n             4.25a.75.75 0 011.5 0v3a.75.75 0 01-1.5\n             0v-3zm.75 6.25a.875.875 0 110-1.75.875.875\n             0 010 1.75z" }) })),
    },
    warning: {
        bg: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-600',
        dot: 'bg-amber-500',
        svg: (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.457 1.047c.659-1.234 2.427-1.234 3.086\n             0l6.082 11.378A1.75 1.75 0 0114.082\n             15H1.918a1.75 1.75 0 01-1.543-2.575L6.457\n             1.047zM8 5a.75.75 0 01.75.75v2.5a.75.75\n             0 01-1.5 0v-2.5A.75.75 0 018 5zm0 6.5a1\n             1 0 110-2 1 1 0 010 2z" }) })),
    },
    success: {
        bg: 'bg-emerald-50',
        icon: 'bg-emerald-100 text-emerald-600',
        dot: 'bg-emerald-500',
        svg: (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 1a7 7 0 100 14A7 7 0 008 1zm3.78\n             5.03a.75.75 0 00-1.06-1.06L6.75 8.94\n             5.28 7.47a.75.75 0 00-1.06 1.06l2 2a.75.75\n             0 001.06 0l4.5-4.5z" }) })),
    },
    info: {
        bg: 'bg-sky-50',
        icon: 'bg-sky-100 text-sky-600',
        dot: 'bg-sky-500',
        svg: (_jsx("svg", { viewBox: "0 0 16 16", fill: "currentColor", className: "w-4 h-4", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 1a7 7 0 100 14A7 7 0 008 1zm.75\n             3.75a.75.75 0 00-1.5 0V8a.75.75 0 001.5\n             0V4.75zM8 11a1 1 0 110-2 1 1 0 010 2z" }) })),
    },
};
export default function NotificationItem({ notification: n }) {
    const { markAsRead } = useNotifications();
    const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
    const handleClick = useCallback(() => {
        if (!n.read)
            markAsRead(n.id);
    }, [n.id, n.read, markAsRead]);
    return (_jsx("li", { children: _jsxs("button", { onClick: handleClick, className: clsx('w-full text-left px-5 py-4 flex items-start gap-3', 'transition-colors duration-150', 'focus-visible:outline-none focus-visible:ring-2', 'focus-visible:ring-inset focus-visible:ring-indigo-500', n.read ? 'bg-white hover:bg-slate-50' : clsx(config.bg, 'hover:brightness-95')), children: [_jsx("span", { className: clsx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', config.icon), children: config.svg }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [_jsx("p", { className: clsx('text-xs font-semibold truncate', n.read ? 'text-slate-700' : 'text-slate-900'), children: n.title }), _jsx("span", { className: "text-[10px] text-slate-400 shrink-0 tabular-nums", children: relativeTime(n.timestamp) })] }), _jsx("p", { className: clsx('text-xs mt-0.5 leading-relaxed line-clamp-2', n.read ? 'text-slate-400' : 'text-slate-600'), children: n.message })] }), !n.read && _jsx("span", { className: clsx('mt-1.5 h-2 w-2 shrink-0 rounded-full', config.dot) })] }) }));
}
