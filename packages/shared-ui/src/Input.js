import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import clsx from 'clsx';
export const Input = forwardRef(({ label, error, helperText, fullWidth, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    return (_jsxs("div", { className: clsx('flex flex-col gap-1', fullWidth && 'w-full'), children: [label && (_jsx("label", { htmlFor: id, className: "text-sm font-medium text-slate-700 select-none", children: label })), _jsx("input", { ref: ref, id: id, className: clsx('rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400', 'bg-white outline-none transition-colors duration-150', 'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500', 'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed', error
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-slate-200 hover:border-slate-300', fullWidth && 'w-full', className), "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : helperText ? `${id}-helper` : undefined, ...props }), error && (_jsxs("p", { id: `${id}-error`, className: "text-xs text-red-600 flex items-center gap-1", children: [_jsx("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { d: "M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" }) }), error] })), !error && helperText && (_jsx("p", { id: `${id}-helper`, className: "text-xs text-slate-500", children: helperText }))] }));
});
Input.displayName = 'Input';
