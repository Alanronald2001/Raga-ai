import { useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '@raga/shared-ui'
import clsx from 'clsx'

// ── Types ─────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  to: string
  label: string
  end?: boolean
  icon: React.ReactNode
}

// ── Icons ─────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0
         01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1
         1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0
         01-.707-1.707l7-7z"
    />
  </svg>
)

const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
    <path
      d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1
             1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1
             0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0
             011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
    />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
    <path
      d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0
             3 3 0 016 0zM9 12a3 3 0 100 6 3 3 0 000-6zm8
             3a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const ChevronIcon = ({ flipped }: { flipped: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={clsx('w-4 h-4 transition-transform duration-200', flipped && 'rotate-180')}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293
         3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0
         010-1.414l4-4a1 1 0 011.414 0z"
    />
  </svg>
)

const LogoutIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293
         4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3
         3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0
         110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
    />
  </svg>
)

// ── Nav config ────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <HomeIcon />, end: true },
  { to: '/analytics', label: 'Analytics', icon: <ChartIcon /> },
  { to: '/patients', label: 'Patients', icon: <UsersIcon /> },
]

// ── Tooltip wrapper (collapsed mode) ──────────────────────────────
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div
        className={[
          'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
          'bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg',
          'whitespace-nowrap shadow-lg',
          'opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100',
          'transition-all duration-150',
        ].join(' ')}
      >
        {label}
        {/* Arrow */}
        <div
          className="absolute right-full top-1/2 -translate-y-1/2
                        border-4 border-transparent border-r-slate-800"
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Logo ────────────────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-center h-14 shrink-0 border-b border-slate-100',
          'transition-all duration-200',
          collapsed ? 'justify-center px-0' : 'justify-between px-4'
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center
                            justify-center shrink-0"
            >
              <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4
                     4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0
                     010-5.656z"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base tracking-tight truncate">
              HealthOS
            </span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'p-1.5 rounded-lg text-slate-400 transition-colors',
            'hover:text-slate-600 hover:bg-slate-100',
            collapsed && 'mx-auto'
          )}
        >
          <ChevronIcon flipped={collapsed} />
        </button>
      </div>

      {/* ── Nav items ───────────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, label, icon, end }) => {
          const linkEl = (
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg text-sm font-medium',
                  'transition-all duration-150 select-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                  collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                )
              }
            >
              {icon}
              {!collapsed && (
                <span className="truncate transition-opacity duration-150">{label}</span>
              )}
            </NavLink>
          )

          return collapsed ? (
            <Tooltip key={to} label={label}>
              {linkEl}
            </Tooltip>
          ) : (
            <div key={to}>{linkEl}</div>
          )
        })}
      </nav>

      {/* ── User footer ─────────────────────────────────────── */}
      {user && (
        <div
          className={clsx(
            'shrink-0 border-t border-slate-100 transition-all duration-200',
            collapsed ? 'p-2' : 'p-3'
          )}
        >
          {collapsed ? (
            <Tooltip label={`Sign out ${user.displayName}`}>
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                className="flex items-center justify-center w-full p-2 rounded-lg
                           text-slate-400 hover:text-red-500 hover:bg-red-50
                           transition-colors duration-150"
              >
                <LogoutIcon />
              </button>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar name={user.displayName} src={user.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500
                           hover:bg-red-50 transition-colors duration-150 shrink-0"
              >
                <LogoutIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
