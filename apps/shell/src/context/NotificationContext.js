import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
// ── Context ──────────────────────────────────────────────────────
const NotificationContext = createContext(null);
// ── Helpers ──────────────────────────────────────────────────────
function makeId() {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function fireNativePush(n) {
    if (typeof window === 'undefined')
        return;
    if (Notification.permission !== 'granted')
        return;
    new Notification(n.title, {
        body: n.message,
        icon: '/favicon.ico',
        tag: n.id,
    });
}
// ── Provider ─────────────────────────────────────────────────────
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.read).length;
    // Add a new notification (deduplicates by id)
    const addNotification = useCallback((partial) => {
        const n = {
            ...partial,
            id: makeId(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        setNotifications(prev => {
            // cap at 100 to avoid unbounded growth
            const next = [n, ...prev].slice(0, 100);
            return next;
        });
        fireNativePush(n);
    }, []);
    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    }, []);
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);
    const requestPushPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return 'denied';
        }
        if (Notification.permission === 'granted')
            return 'granted';
        const result = await Notification.requestPermission();
        return result;
    }, []);
    // Listen for NOTIFICATION_PUSH messages from MFE iframes
    useEffect(() => {
        const handler = (event) => {
            if (event.data?.type !== 'NOTIFICATION_PUSH')
                return;
            const incoming = event.data.payload;
            // Rebuild with a fresh id/timestamp in case MFE sends stale ones
            addNotification({
                type: incoming.type,
                title: incoming.title,
                message: incoming.message,
                patientId: incoming.patientId,
            });
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [addNotification]);
    return (_jsx(NotificationContext.Provider, { value: {
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll,
            requestPushPermission,
        }, children: children }));
}
// ── Hook ─────────────────────────────────────────────────────────
export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx)
        throw new Error('useNotifications must be used inside <NotificationProvider>');
    return ctx;
}
