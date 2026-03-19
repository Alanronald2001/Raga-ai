import clsx from 'clsx'
import type { PatientStatus, AppointmentStatus } from '@raga/shared-types'

type BadgeStatus = PatientStatus | AppointmentStatus | string
type BadgeVariant = 'solid' | 'subtle'

interface BadgeProps {
  status: BadgeStatus
  variant?: BadgeVariant
  className?: string
}

const statusMap: Record<string, { label: string; solid: string; subtle: string }> = {
  // PatientStatus
  active: {
    label: 'Active',
    solid: 'bg-emerald-600 text-white',
    subtle: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  discharged: {
    label: 'Discharged',
    solid: 'bg-slate-500 text-white',
    subtle: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  },
  critical: {
    label: 'Critical',
    solid: 'bg-red-600 text-white',
    subtle: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
  stable: {
    label: 'Stable',
    solid: 'bg-sky-600 text-white',
    subtle: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  },
  // AppointmentStatus
  scheduled: {
    label: 'Scheduled',
    solid: 'bg-indigo-600 text-white',
    subtle: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  },
  completed: {
    label: 'Completed',
    solid: 'bg-emerald-600 text-white',
    subtle: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  cancelled: {
    label: 'Cancelled',
    solid: 'bg-rose-600 text-white',
    subtle: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  },
  pending: {
    label: 'Pending',
    solid: 'bg-amber-500 text-white',
    subtle: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
}

export function Badge({ status, variant = 'subtle', className }: BadgeProps) {
  const config = statusMap[status] ?? {
    label: status,
    solid: 'bg-slate-500 text-white',
    subtle: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  }
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        variant === 'solid' ? config.solid : config.subtle,
        className
      )}
    >
      {config.label}
    </span>
  )
}
