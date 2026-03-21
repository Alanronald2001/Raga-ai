import { jsx as _jsx } from "react/jsx-runtime";
import clsx from 'clsx';
const sizes = {
    xs: { container: 'h-6 w-6', text: 'text-[10px]' },
    sm: { container: 'h-8 w-8', text: 'text-xs' },
    md: { container: 'h-10 w-10', text: 'text-sm' },
    lg: { container: 'h-12 w-12', text: 'text-base' },
    xl: { container: 'h-16 w-16', text: 'text-lg' },
};
const palette = [
    'bg-indigo-100 text-indigo-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700',
];
function initials(name) {
    if (!name)
        return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function colorFor(name) {
    if (!name)
        return palette[0];
    const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return palette[code % palette.length];
}
export function Avatar({ src, name, size = 'md', className }) {
    const { container, text } = sizes[size];
    return (_jsx("span", { className: clsx('relative inline-flex shrink-0 rounded-full overflow-hidden', container, className), children: src ? (_jsx("img", { src: src, alt: name ?? 'Avatar', className: "h-full w-full object-cover" })) : (_jsx("span", { className: clsx('flex h-full w-full items-center justify-center font-semibold', text, colorFor(name)), children: initials(name) })) }));
}
