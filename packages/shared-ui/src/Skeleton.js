import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-xl',
    full: 'rounded-full',
};
export function Skeleton({ width = '100%', height = '1rem', rounded = 'md', className, }) {
    return (_jsx("span", { role: "presentation", className: clsx('block animate-pulse bg-slate-200', roundedMap[rounded], className), style: { width, height } }));
}
// Convenience composite for a card skeleton
export function SkeletonCard() {
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Skeleton, { width: "2.5rem", height: "2.5rem", rounded: "full" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx(Skeleton, { height: "0.875rem", width: "60%" }), _jsx(Skeleton, { height: "0.75rem", width: "40%" })] })] }), _jsx(Skeleton, { height: "0.75rem" }), _jsx(Skeleton, { height: "0.75rem", width: "80%" }), _jsx(Skeleton, { height: "0.75rem", width: "50%" })] }));
}
