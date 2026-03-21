import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-11 w-11 border-[3px]',
};
export function Spinner({ size = 'md', label = 'Loading…', className }) {
    return (_jsxs("span", { role: "status", "aria-label": label, className: clsx('inline-block', className), children: [_jsx("span", { className: clsx('block rounded-full border-slate-200 border-t-indigo-600 animate-spin', sizes[size]) }), _jsx("span", { className: "sr-only", children: label })] }));
}
