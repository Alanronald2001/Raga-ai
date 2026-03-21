import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Skeleton } from '@raga/shared-ui';
import clsx from 'clsx';
// ── Helper: post typed message to iframe ──────────────────────────
function postToIframe(ref, msg) {
    ref.current?.contentWindow?.postMessage(msg, '*');
}
// ── Component ─────────────────────────────────────────────────────
export default function MFEFrame({ src, title, onMessage, className }) {
    const iframeRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [errored, setErrored] = useState(false);
    const titleId = useId();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    // ── Send AUTH_TOKEN_READY when iframe finishes loading ─────────
    const handleLoad = useCallback(async () => {
        setLoading(false);
        setErrored(false);
        if (!user)
            return;
        try {
            // Get fresh token from Firebase
            const { auth } = await import('../../services/firebase');
            const token = (await auth.currentUser?.getIdToken()) ?? '';
            postToIframe(iframeRef, {
                type: 'AUTH_TOKEN_READY',
                payload: { token, user },
            });
        }
        catch (err) {
            console.error('[MFEFrame] Failed to send auth token:', err);
        }
    }, [user]);
    const handleError = useCallback(() => {
        setLoading(false);
        setErrored(true);
    }, []);
    // ── Listen for messages from this MFE ─────────────────────────
    useEffect(() => {
        const handler = (event) => {
            // Only accept messages from the iframe's origin
            const iframeOrigin = new URL(src).origin;
            if (event.origin !== iframeOrigin)
                return;
            const msg = event.data;
            if (!msg?.type)
                return;
            // Hand off to caller first
            onMessage?.(msg);
            // Shell handles these globally
            switch (msg.type) {
                case 'MFE_READY': {
                    // MFE is ready — send auth immediately
                    handleLoad();
                    break;
                }
                case 'NOTIFICATION_PUSH': {
                    addNotification({
                        type: msg.payload.type,
                        title: msg.payload.title,
                        message: msg.payload.message,
                        patientId: msg.payload.patientId,
                    });
                    break;
                }
                case 'NAVIGATE': {
                    navigate(msg.payload.path);
                    break;
                }
                default:
                    break;
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [src, onMessage, handleLoad, addNotification, navigate]);
    return (_jsxs("div", { className: clsx('relative w-full h-full overflow-hidden', className), role: "region", "aria-labelledby": titleId, children: [_jsx("span", { id: titleId, className: "sr-only", children: title }), loading && !errored && (_jsxs("div", { className: "absolute inset-0 z-10 bg-slate-50\n                        flex flex-col gap-4 p-6 pointer-events-none", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx(Skeleton, { height: "5.5rem", rounded: "lg" }, i))) }), _jsxs("div", { className: "flex gap-4 flex-1", children: [_jsx(Skeleton, { width: "66%", height: "100%", rounded: "lg", className: "min-h-[300px]" }), _jsxs("div", { className: "flex flex-col gap-4 flex-1", children: [_jsx(Skeleton, { height: "48%", rounded: "lg" }), _jsx(Skeleton, { height: "48%", rounded: "lg" })] })] })] })), errored && (_jsxs("div", { className: "absolute inset-0 z-10 flex flex-col\n                        items-center justify-center gap-3\n                        bg-slate-50 text-slate-500", children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-slate-100\n                          flex items-center justify-center", children: _jsx(ErrorIcon, {}) }), _jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-sm font-medium text-slate-700", children: ["Failed to load ", title] }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: ["Make sure the app is running at ", _jsx("code", { className: "font-mono text-[11px]", children: src })] })] }), _jsx("button", { onClick: () => {
                            setErrored(false);
                            setLoading(true);
                            // Force iframe reload
                            if (iframeRef.current) {
                                iframeRef.current.src = src;
                            }
                        }, className: "mt-1 px-4 py-1.5 rounded-lg text-xs font-medium\n                       bg-white border border-slate-200 text-slate-600\n                       hover:bg-slate-50 transition-colors", children: "Retry" })] })), _jsx("iframe", { ref: iframeRef, src: src, title: title, onLoad: handleLoad, onError: handleError, className: clsx('w-full h-full border-0 bg-transparent', 
                // Hide scrollbar — MFE manages its own scroll
                '[&::-webkit-scrollbar]:hidden', 
                // Fade in once loaded
                loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'), 
                // Security
                allow: "clipboard-read; clipboard-write", sandbox: "allow-scripts allow-same-origin allow-forms allow-popups", loading: "eager" })] }));
}
// ── Error icon ────────────────────────────────────────────────────
const ErrorIcon = () => (_jsx("svg", { viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 text-slate-400", children: _jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75\n         0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75\n         0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" }) }));
