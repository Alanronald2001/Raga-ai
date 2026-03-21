import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('[ErrorBoundary]', error, info);
        this.props.onError?.(error, info);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback)
                return this.props.fallback;
            return _jsx(ErrorCard, { error: this.state.error, onReset: this.handleReset });
        }
        return this.props.children;
    }
}
// ── Error card UI ─────────────────────────────────────────────────
function ErrorCard({ error, onReset }) {
    return (_jsx("div", { className: "flex items-center justify-center\n                    min-h-[400px] p-6 bg-slate-50", children: _jsxs("div", { className: "bg-white rounded-2xl border border-red-100\n                      shadow-md shadow-red-50 p-8 max-w-md w-full\n                      flex flex-col items-center gap-5 text-center\n                      animate-scale-in", children: [_jsx("div", { className: "h-14 w-14 rounded-2xl bg-red-50 border\n                        border-red-100 flex items-center justify-center", children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "w-7 h-7 text-red-500", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217\n                 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874\n                 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898\n                 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" }) }) }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("h2", { className: "text-base font-bold text-slate-800", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-slate-500 leading-relaxed", children: "An unexpected error occurred while rendering this page. You can try again or reload the app." }), error?.message && (_jsxs("details", { className: "mt-3 text-left", children: [_jsx("summary", { className: "text-xs text-slate-400 cursor-pointer\n                                  hover:text-slate-600 transition-colors", children: "Technical details" }), _jsx("pre", { className: "mt-2 text-[10px] text-red-600 bg-red-50\n                              rounded-lg p-3 overflow-auto max-h-32\n                              whitespace-pre-wrap break-words", children: error.message })] }))] }), _jsxs("div", { className: "flex items-center gap-2 w-full", children: [_jsx("button", { onClick: onReset, className: "flex-1 px-4 py-2.5 rounded-xl text-sm\n                       font-medium border border-slate-200\n                       text-slate-600 hover:bg-slate-50\n                       transition-colors duration-150", children: "Try again" }), _jsx("button", { onClick: () => window.location.reload(), className: "flex-1 px-4 py-2.5 rounded-xl text-sm\n                       font-medium bg-red-600 text-white\n                       hover:bg-red-700 transition-colors duration-150", children: "Reload page" })] })] }) }));
}
// ── Convenience HOC ───────────────────────────────────────────────
export function withErrorBoundary(Component, fallback) {
    return function WrappedComponent(props) {
        return (_jsx(ErrorBoundary, { fallback: fallback, children: _jsx(Component, { ...props }) }));
    };
}
