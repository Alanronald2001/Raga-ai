import { useCallback } from 'react'
import { useNotifications } from '../../context/NotificationContext'
import NotificationItem from './NotificationItem'
import { Button } from '@raga/shared-ui'
import clsx from 'clsx'

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications()

  const handleClearAll = useCallback(() => {
    clearAll()
    onClose()
  }, [clearAll, onClose])

  return (
    <div className={clsx('flex flex-col h-full w-full', 'bg-white border-l border-slate-100')}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div
        className="flex items-start justify-between px-5 pt-5 pb-4
                      border-b border-slate-100 shrink-0"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-800 leading-tight">Notifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Mark all read
            </Button>
          )}
          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="p-1.5 rounded-lg text-slate-400
                       hover:text-slate-600 hover:bg-slate-100
                       transition-colors duration-150"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* ── Notification list ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-slate-50">
            {notifications.map(n => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </ul>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="shrink-0 px-5 py-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleClearAll}
            className="text-xs text-slate-500"
          >
            Clear all notifications
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center
                    h-full min-h-[320px] px-8 gap-4 select-none"
    >
      {/* Illustration */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full bg-slate-50
                        flex items-center justify-center"
        >
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-10 h-10 text-slate-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            {/* Bell body */}
            <path
              d="M24 12a8 8 0 00-8 8v4l-2 4h20l-2-4v-4a8
                     8 0 00-8-8z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Bell base */}
            <path
              d="M21 28a3 3 0 006 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Zs */}
            <text x="30" y="18" fontSize="6" fill="currentColor" fontWeight="600" opacity="0.5">
              z
            </text>
            <text x="33" y="14" fontSize="5" fill="currentColor" fontWeight="600" opacity="0.35">
              z
            </text>
            <text x="35.5" y="10.5" fontSize="4" fill="currentColor" fontWeight="600" opacity="0.2">
              z
            </text>
          </svg>
        </div>
        {/* Decorative ring */}
        <div
          className="absolute inset-0 rounded-full border-2
                        border-dashed border-slate-100 scale-110"
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">All quiet here</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[200px]">
          Notifications from patients and the system will appear here.
        </p>
      </div>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path
      d="M4.28 3.22a.75.75 0 00-1.06 1.06L6.94 8l-3.72
             3.72a.75.75 0 101.06 1.06L8 9.06l3.72 3.72a.75.75
             0 101.06-1.06L9.06 8l3.72-3.72a.75.75 0
             00-1.06-1.06L8 6.94 4.28 3.22z"
    />
  </svg>
)
