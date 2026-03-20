import { useNavigate } from 'react-router-dom'
import { Avatar, Badge } from '@raga/shared-ui'
import { postToShell } from '@raga/shared-types'
import type { Patient } from '@raga/shared-types'
import clsx from 'clsx'

interface Props {
  patients: Patient[]
}

// ── Vital threshold colors ────────────────────────────────────────
function vitalColor(val: number, low: number, high: number) {
  return val < low || val > high ? 'text-red-500' : 'text-emerald-600'
}

// ── Patient card ──────────────────────────────────────────────────
function PatientCard({
  patient: p,
  index,
  onClick,
}: {
  patient: Patient
  index: number
  onClick: (p: Patient) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(p)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(p)}
      aria-label={`View profile for ${p.name}`}
      className={clsx(
        // Base
        'group relative bg-white rounded-2xl border border-slate-100',
        'flex flex-col overflow-hidden cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        // Hover lift
        'shadow-sm hover:shadow-lg hover:shadow-slate-200/60',
        'hover:-translate-y-0.5 hover:border-indigo-200',
        // Entry animation stagger
        'animate-fade-in-up',
        // Critical pulse border
        p.status === 'critical' && 'border-red-200 hover:border-red-300'
      )}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      {/* ── Critical indicator strip ────────────────────── */}
      {p.status === 'critical' && (
        <div
          className="absolute top-0 inset-x-0 h-0.5
                        bg-gradient-to-r from-red-400 to-rose-500"
        />
      )}

      {/* ── Card body ───────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Avatar + name + badge */}
        <div className="flex items-start gap-3">
          <Avatar name={p.name} src={undefined} size="lg" className="shrink-0 shadow-sm" />
          <div className="flex-1 min-w-0 pt-0.5">
            <p
              className="text-sm font-bold text-slate-800
                          group-hover:text-indigo-600 transition-colors
                          truncate leading-tight"
            >
              {p.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {p.age}y · <span className="capitalize">{p.gender}</span>
            </p>
            <div className="mt-2">
              <Badge status={p.status} />
            </div>
          </div>
        </div>

        {/* Tags row: department + blood */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Department tag */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1
                           rounded-full bg-slate-100 text-slate-600
                           text-[11px] font-medium truncate max-w-[150px]"
          >
            <DeptIcon />
            {p.department}
          </span>

          {/* Blood group */}
          <span
            className="inline-flex items-center px-2.5 py-1
                           rounded-full bg-red-50 text-red-700
                           text-[11px] font-bold font-mono"
          >
            {p.bloodGroup}
          </span>
        </div>

        {/* Vitals strip */}
        <div
          className="grid grid-cols-3 gap-1 px-3 py-2.5
                        bg-slate-50 rounded-xl"
        >
          <VitalPill
            label="HR"
            value={p.vitals.heartRate}
            unit="bpm"
            color={vitalColor(p.vitals.heartRate, 60, 100)}
          />
          <VitalPill
            label="SpO₂"
            value={p.vitals.oxygenSaturation}
            unit="%"
            color={vitalColor(p.vitals.oxygenSaturation, 95, 100)}
          />
          <VitalPill
            label="Temp"
            value={p.vitals.temperature}
            unit="°F"
            color={vitalColor(p.vitals.temperature, 97, 99)}
          />
        </div>

        {/* Last visit */}
        <div
          className="flex items-center justify-between
                        text-[11px] text-slate-400"
        >
          <span className="flex items-center gap-1">
            <CalendarIcon />
            Last: {p.lastVisit}
          </span>
          {p.nextAppointment && (
            <span className="text-indigo-500 font-medium">Next: {p.nextAppointment}</span>
          )}
        </div>
      </div>

      {/* ── View profile button ──────────────────────────── */}
      <div
        className={clsx(
          'px-5 pb-4 pt-1',
          'translate-y-1 group-hover:translate-y-0',
          'transition-transform duration-200'
        )}
      >
        <div
          className={clsx(
            'flex items-center justify-center gap-1.5',
            'w-full py-2 rounded-xl text-xs font-semibold',
            'border border-slate-100 text-slate-400',
            'group-hover:bg-indigo-600 group-hover:text-white',
            'group-hover:border-indigo-600',
            'transition-all duration-200'
          )}
        >
          View Profile
          <ArrowIcon />
        </div>
      </div>
    </div>
  )
}

// ── Grid component ────────────────────────────────────────────────
export default function PatientGrid({ patients }: Props) {
  const navigate = useNavigate()

  const handleClick = (p: Patient) => {
    navigate(`/${p.id}`)
    postToShell({ type: 'NAVIGATE', payload: { path: `/patients/${p.id}` } })
  }

  if (patients.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center
                      min-h-[400px] gap-3 text-slate-400 select-none"
      >
        <div
          className="h-16 w-16 rounded-full bg-slate-100
                        flex items-center justify-center text-3xl"
        >
          🔍
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600">No patients found</p>
          <p className="text-xs mt-1">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('grid gap-4', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3')}>
      {patients.map((p, i) => (
        <PatientCard key={p.id} patient={p} index={i} onClick={handleClick} />
      ))}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────
function VitalPill({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: number
  unit: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5">
      <span className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={clsx('text-xs font-bold tabular-nums', color)}>
        {value}
        <span className="text-[9px] font-normal text-slate-400 ml-0.5">{unit}</span>
      </span>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────
const DeptIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
    <path
      d="M6 1a4 4 0 100 8A4 4 0 006 1zM0 6a6 6 0
             1112 0A6 6 0 010 6z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 1a.5.5 0 01.5.5V2h3V1.5a.5.5 0 011
         0V2H9a2 2 0 012 2v5a2 2 0 01-2 2H3a2
         2 0 01-2-2V4a2 2 0 012-2h.5V1.5A.5.5
         0 014 1zm5 3H3a1 1 0 00-1 1v4a1 1 0
         001 1h6a1 1 0 001-1V5a1 1 0 00-1-1z"
    />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 6a.5.5 0 01.5-.5h5.793L6.146 3.354a.5.5
         0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5
         0 01-.708-.708L8.293 6.5H2.5A.5.5 0 012 6z"
    />
  </svg>
)
