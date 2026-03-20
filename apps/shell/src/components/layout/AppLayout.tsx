import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import NotificationPanel from '../notifications/NotificationPanel'

const SIDEBAR_KEY = 'raga:sidebar:collapsed'

export default function AppLayout() {
  // ── Sidebar collapse — persisted ──────────────────────────────
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true'
    } catch {
      return false
    }
  })

  const [notifOpen, setNotifOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  // Close notification panel on outside click
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      const panel = document.getElementById('notif-panel')
      const bell = document.getElementById('notif-bell')
      if (panel && !panel.contains(e.target as Node) && bell && !bell.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* ── Desktop Sidebar ──────────────────────────────────── */}
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

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* TopBar */}
        <TopBar
          sidebarCollapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onToggleNotif={() => setNotifOpen(o => !o)}
          notifOpen={notifOpen}
        />

        {/* Content + notification panel side by side */}
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          {/* iframe / page area */}
          <main className="flex-1 min-w-0 overflow-hidden">
            <Outlet />
          </main>

          {/* Notification slide-over panel */}
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

        {/* ── Mobile bottom tab bar ────────────────────────── */}
        <nav
          className="md:hidden flex items-center justify-around
                        border-t border-slate-100 bg-white h-16 shrink-0 px-2"
        >
          <MobileTab to="/" icon="🏠" label="Home" />
          <MobileTab to="/patients" icon="👥" label="Patients" />
          <MobileTab to="/analytics" icon="📊" label="Analytics" />
        </nav>
      </div>
    </div>
  )
}

// ── Mobile tab button ─────────────────────────────────────────────
import { NavLink } from 'react-router-dom'

function MobileTab({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl text-xs font-medium',
          'transition-colors duration-150',
          isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600',
        ].join(' ')
      }
    >
      <span className="text-xl leading-none">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}
