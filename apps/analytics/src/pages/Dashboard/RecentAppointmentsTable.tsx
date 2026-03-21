import type { Appointment } from '@raga/shared-types'
import { Badge } from '@raga/shared-ui'

const PATIENT_NAMES: Record<string, string> = {
  p001: 'Arjun Mehta',
  p002: 'Priya Nair',
  p003: 'Ravi Shankar',
  p006: 'Meena Krishnan',
  p008: 'Anjali Singh',
  p009: 'Suresh Iyer',
  p013: 'Amit Joshi',
  p015: 'Vijay Kumar',
  p019: 'Santosh Yadav',
  p022: 'Savitha Gowda',
  p025: 'Mohan Lal',
}

const TYPE_LABEL: Record<string, string> = {
  'in-person': 'In-person',
  virtual: 'Virtual',
  'follow-up': 'Follow-up',
  emergency: 'Emergency',
}

interface Props {
  appointments: Appointment[]
}

export default function RecentAppointmentsTable({ appointments }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div
        className="px-5 py-4 border-b border-slate-50 flex
                      items-center justify-between"
      >
        <h2 className="text-sm font-semibold text-slate-800">Today's Appointments</h2>
        <span className="text-xs text-slate-400">{appointments.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-50">
              {['Patient', 'Time', 'Type', 'Status'].map(h => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs
                                       font-medium text-slate-400
                                       uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments.map(appt => (
              <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-7 w-7 rounded-full bg-indigo-100
                                    text-indigo-700 flex items-center
                                    justify-center text-xs font-bold shrink-0"
                    >
                      {(PATIENT_NAMES[appt.patientId] ?? '?')[0]}
                    </div>
                    <span className="font-medium text-slate-700 text-xs">
                      {PATIENT_NAMES[appt.patientId] ?? appt.patientId}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-slate-500 tabular-nums">{appt.time}</td>
                <td className="px-5 py-3">
                  <span className="text-xs text-slate-500">
                    {TYPE_LABEL[appt.type] ?? appt.type}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Badge status={appt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
