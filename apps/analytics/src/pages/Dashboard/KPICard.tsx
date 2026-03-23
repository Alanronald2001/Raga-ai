import type { KPICard as KPICardType } from '@raga/shared-types'
import type { AdmissionPoint } from '@raga/shared-types'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'
import React from 'react'

interface KPICardProps {
  kpi: KPICardType
  trend: AdmissionPoint[]
}

// ── Mini icons ─────────────────────────────────────────────────────
const s = 'w-4 h-4'
const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 100 6 3 3 0 000-6zm8 3a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
    />
  </svg>
)
const BedIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v3H2V4zm0 5h16v5a1 1 0 01-1 1H3a1 1 0 01-1-1V9zm5 2a1 1 0 100 2h6a1 1 0 100-2H7z" />
  </svg>
)
const RupeeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 2a8 8 0 100 16A8 8 0 0010 2zM7 7h6a1 1 0 010 2h-1.586l2.293 2.293a1 1 0 01-1.414 1.414L10 10.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 9H7a1 1 0 010-2z"
    />
  </svg>
)
const AlertIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
    />
  </svg>
)
const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
    />
  </svg>
)
const LogOutIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z"
    />
  </svg>
)
const StethIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <path d="M10 2a3 3 0 00-3 3v1H5a1 1 0 000 2h1v3a5 5 0 009.9.9A3 3 0 0014 5V2h-4zm2 3V3h-4v2h4z" />
  </svg>
)
const DefaultIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={s}>
    <circle cx="10" cy="10" r="8" />
  </svg>
)

const ICON_MAP: Record<string, React.ReactNode> = {
  Users: <UsersIcon />,
  Calendar: <CalendarIcon />,
  BedDouble: <BedIcon />,
  IndianRupee: <RupeeIcon />,
  AlertTriangle: <AlertIcon />,
  Clock: <ClockIcon />,
  LogOut: <LogOutIcon />,
  Stethoscope: <StethIcon />,
}

export default function KPICard({ kpi, trend }: KPICardProps) {
  const isUp = kpi.deltaType === 'increase'
  const isDown = kpi.deltaType === 'decrease'
  const isNeutral = kpi.deltaType === 'neutral'

  const deltaColor = isNeutral ? 'text-slate-400' : isUp ? 'text-emerald-600' : 'text-red-500'

  const sparkData = trend.map(t => ({ v: t.admissions }))

  return (
    <div
      className="bg-white rounded-xl border border-slate-100
                    shadow-sm p-4 flex flex-col gap-3 hover:shadow-md
                    transition-shadow duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${kpi.color}18` }}
        >
          <span style={{ color: kpi.color }}>{ICON_MAP[kpi.icon] ?? <DefaultIcon />}</span>
        </div>

        {/* Sparkline */}
        <div className="w-16 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight tabular-nums">{kpi.value}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{kpi.title}</p>
      </div>

      {/* Delta */}
      <div className={clsx('flex items-center gap-1 text-xs font-medium', deltaColor)}>
        {!isNeutral && <span>{isUp ? '↑' : '↓'}</span>}
        <span>{Math.abs(kpi.delta)}% vs last month</span>
      </div>
    </div>
  )
}
