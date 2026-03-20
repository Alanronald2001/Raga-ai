import type { ActivityItem } from '@raga/mock-api'
import clsx from 'clsx'

interface Props {
  items: ActivityItem[]
}

const TYPE_CONFIG = {
  admission: { dot: 'bg-indigo-500', icon: '↓', label: 'bg-indigo-50  text-indigo-600' },
  discharge: { dot: 'bg-emerald-500', icon: '↑', label: 'bg-emerald-50 text-emerald-600' },
  alert: { dot: 'bg-red-500', icon: '!', label: 'bg-red-50     text-red-600' },
  appointment: { dot: 'bg-sky-500', icon: '◷', label: 'bg-sky-50     text-sky-600' },
  lab: { dot: 'bg-amber-500', icon: '⚗', label: 'bg-amber-50   text-amber-600' },
}

function relTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export default function ActivityFeed({ items }: Props) {
  return (
    <div
      className="bg-white rounded-xl border border-slate-100
                    shadow-sm overflow-hidden flex flex-col"
    >
      <div className="px-5 py-4 border-b border-slate-50 shrink-0">
        <h2 className="text-sm font-semibold text-slate-800">Activity Feed</h2>
      </div>

      <ul
        className="flex-1 overflow-y-auto divide-y divide-slate-50
                     max-h-[340px]"
      >
        {items.map(item => {
          const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.appointment
          return (
            <li
              key={item.id}
              className="flex items-start gap-3 px-5 py-3
                           hover:bg-slate-50 transition-colors"
            >
              {/* Icon */}
              <span
                className={clsx(
                  'mt-0.5 h-6 w-6 rounded-full flex items-center justify-center',
                  'text-[10px] font-bold shrink-0',
                  cfg.label
                )}
              >
                {cfg.icon}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  {item.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                  {relTime(item.timestamp)}
                </p>
              </div>

              {/* Live dot for recent */}
              <span className={clsx('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', cfg.dot)} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
