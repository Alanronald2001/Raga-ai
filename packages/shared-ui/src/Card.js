import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};
export function Card({ header, footer, padding = 'md', hoverable, className, children, ...props }) {
    return (_jsxs("div", { className: clsx('bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden', hoverable && 'transition-shadow duration-200 hover:shadow-md cursor-pointer', className), ...props, children: [header && (_jsx("div", { className: "px-5 py-3 border-b border-slate-100 flex items-center justify-between", children: header })), _jsx("div", { className: paddings[padding], children: children }), footer && _jsx("div", { className: "px-5 py-3 border-t border-slate-100 bg-slate-50", children: footer })] }));
}
