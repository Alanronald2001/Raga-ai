import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Notification } from '@raga/shared-types'

// ── Types ────────────────────────────────────────────────────────
interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  requestPushPermission: () => Promise<NotificationPermission>
}

// ── Context ──────────────────────────────────────────────────────
const NotificationContext = createContext<NotificationContextValue | null>(null)

// ── Helpers ──────────────────────────────────────────────────────
function makeId() {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function fireNativePush(n: Notification) {
  if (typeof window === 'undefined') return
  if (Notification.permission !== 'granted') return
  new Notification(n.title, {
    body: n.message,
    icon: '/favicon.ico',
    tag: n.id,
  })
}

// ── Provider ─────────────────────────────────────────────────────
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadCount = notifications.filter(n => !n.read).length

  // Add a new notification (deduplicates by id)
  const addNotification = useCallback(
    (partial: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const n: Notification = {
        ...partial,
        id: makeId(),
        timestamp: new Date().toISOString(),
        read: false,
      }
      setNotifications(prev => {
        // cap at 100 to avoid unbounded growth
        const next = [n, ...prev].slice(0, 100)
        return next
      })
      fireNativePush(n)
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const requestPushPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }
    if (Notification.permission === 'granted') return 'granted'
    const result = await Notification.requestPermission()
    return result
  }, [])

  // Listen for NOTIFICATION_PUSH messages from MFE iframes
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'NOTIFICATION_PUSH') return
      const incoming = event.data.payload as Notification

      // Rebuild with a fresh id/timestamp in case MFE sends stale ones
      addNotification({
        type: incoming.type,
        title: incoming.title,
        message: incoming.message,
        patientId: incoming.patientId,
      })
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        requestPushPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>')
  return ctx
}
