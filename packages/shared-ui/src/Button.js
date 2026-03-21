import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import clsx from 'clsx';
const base = [
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
    'transition-all duration-150 cursor-pointer select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');
const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
};
const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
};
export const Button = forwardRef(({ variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...props }, ref) => (_jsxs("button", { ref: ref, className: clsx(base, variants[variant], sizes[size], fullWidth && 'w-full', className), disabled: disabled || loading, ...props, children: [loading && (_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })] })), children] })));
Button.displayName = 'Button';
