import type { Appointment } from '@raga/shared-types'
import { Badge } from '@raga/shared-ui'
import clsx from 'clsx'

interface AppointmentsTabProps {
  appointments: Appointment[]
}

const TYPE_LABEL: Record<string, string> = {
  'in-person': 'In-person',
  virtual: 'Virtual',
  'follow-up': 'Follow-up',
  emergency: 'Emergency',
}

export default function AppointmentsTab({ appointments }: AppointmentsTabProps) {
  if (appointments.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
        <CalendarIcon className="w-8 h-8 opacity-20" />
        <p className="text-sm">No appointments scheduled for this patient.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-50">
            {['Date & Time', 'Type', 'Status', 'Doctor'].map(h => (
              <th
                key={h}
                className="px-5 py-3 text-left text-[10px]
                                     font-bold text-slate-400
                                     uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {appointments.map(appt => (
            <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    {appt.time}
                  </span>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={clsx(
                    'text-[11px] font-medium px-2 py-0.5 rounded-full',
                    appt.type === 'virtual'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {TYPE_LABEL[appt.type] ?? appt.type}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <Badge status={appt.status} variant="subtle" />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    Dr
                  </div>
                  <span className="text-xs text-slate-600">Cardiology Dept</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
    />
  </svg>
)
