// Add to AppLayout.tsx — replace the existing file's imports + body

import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { useMFEBridge } from '../../hooks/useMFEBridge'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import NotificationPanel from '../notifications/NotificationPanel'

const SIDEBAR_KEY = 'healthos:sidebar:collapsed'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [notifOpen, setNotifOpen] = useState(false)

  // ── MFE iframe refs ────────────────────────────────────────────
  const patientsRef = useRef<HTMLIFrameElement | null>(null)
  const analyticsRef = useRef<HTMLIFrameElement | null>(null)

  // ── Bridge — centralises all cross-frame messaging ─────────────
  const { postToPatients, postToAnalytics } = useMFEBridge({
    patientsRef,
    analyticsRef,
  })

  // Expose refs via context or pass down if needed
  // For now AppLayout just holds them — MFEFrame components
  // use their own onLoad to send initial auth

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      const panel = document.getElementById('notif-panel')
      const bell = document.getElementById('notif-bell')
      if (panel && !panel.contains(e.target as Node) && bell && !bell.contains(e.target as Node))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <aside
        className={[
          'hidden md:flex flex-col shrink-0 h-full',
          'bg-white border-r border-slate-100 shadow-sm',
          'transition-all duration-200 ease-in-out',
          collapsed ? 'w-16' : 'w-60',
        ].join(' ')}
      >
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar
          sidebarCollapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onToggleNotif={() => setNotifOpen(o => !o)}
          notifOpen={notifOpen}
        />

        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <main className="flex-1 min-w-0 overflow-hidden">
            <Outlet />
          </main>

          {notifOpen && (
            <div
              id="notif-panel"
              className={[
                'absolute right-0 top-0 h-full z-30',
                'w-80 bg-white border-l border-slate-100 shadow-xl',
                'animate-slide-in-right',
              ].join(' ')}
            >
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            </div>
          )}
        </div>

        <nav
          className="md:hidden flex items-center justify-around
                        border-t border-slate-100 bg-white h-16
                        shrink-0 px-2"
        >
          <MobileTab to="/" icon="🏠" label="Home" />
          <MobileTab to="/patients" icon="👥" label="Patients" />
          <MobileTab to="/analytics" icon="📊" label="Analytics" />
        </nav>
      </div>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
function MobileTab({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl',
          'text-xs font-medium transition-colors duration-150',
          isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600',
        ].join(' ')
      }
    >
      <span className="text-xl leading-none">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}
