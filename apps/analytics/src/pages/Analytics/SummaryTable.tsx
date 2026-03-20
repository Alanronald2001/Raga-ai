import type { AdmissionPoint, RevenuePoint, DepartmentBreakdown } from '@raga/shared-types'

interface Props {
  admissions: AdmissionPoint[]
  revenue: RevenuePoint[]
  departments: DepartmentBreakdown[]
}

const fmt = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`

export default function SummaryTable({ admissions, revenue, departments }: Props) {
  const totalAdmissions = admissions.reduce((s, d) => s + d.admissions, 0)
  const totalDischarges = admissions.reduce((s, d) => s + d.discharges, 0)
  const totalRevenue = revenue.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = revenue.reduce((s, d) => s + d.expenses, 0)
  const topDept = [...departments].sort((a, b) => b.count - a.count)[0]
  const occupancyRate = ((totalAdmissions / (totalAdmissions + 50)) * 100).toFixed(1)

  const rows = [
    {
      label: 'Total Admissions',
      value: totalAdmissions.toLocaleString(),
      color: 'text-indigo-600',
    },
    {
      label: 'Total Discharges',
      value: totalDischarges.toLocaleString(),
      color: 'text-emerald-600',
    },
    {
      label: 'Net Inpatients',
      value: (totalAdmissions - totalDischarges).toLocaleString(),
      color: 'text-amber-600',
    },
    { label: 'Total Revenue', value: fmt(totalRevenue), color: 'text-indigo-600' },
    { label: 'Total Expenses', value: fmt(totalExpenses), color: 'text-red-500' },
    { label: 'Net Profit', value: fmt(totalRevenue - totalExpenses), color: 'text-emerald-600' },
    { label: 'Top Department', value: topDept?.department ?? '—', color: 'text-violet-600' },
    { label: 'Avg Occupancy', value: `${occupancyRate}%`, color: 'text-sky-600' },
  ]

  const handleExport = () => {
    const csv = [['Metric', 'Value'], ...rows.map(r => [r.label, r.value])]
      .map(r => r.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `healthos-summary-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="bg-white rounded-xl border border-slate-100
                    shadow-sm overflow-hidden flex flex-col"
    >
      <div
        className="px-5 py-4 border-b border-slate-50 flex
                      items-center justify-between shrink-0"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Period Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">Aggregated metrics</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-medium border border-slate-200
                     text-slate-600 hover:bg-slate-50 hover:border-indigo-300
                     hover:text-indigo-600 transition-all duration-150"
        >
          <DownloadIcon />
          Export CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-50">
            {rows.map(({ label, value, color }) => (
              <tr key={label} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-xs text-slate-500 font-medium">{label}</td>
                <td
                  className={`px-5 py-3 text-xs font-bold
                                text-right tabular-nums ${color}`}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 shrink-0">
        <p className="text-[10px] text-slate-400 text-center">
          Data is for demonstration purposes only · Exports as CSV
        </p>
      </div>
    </div>
  )
}

const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path
      d="M8 1a.75.75 0 01.75.75v5.69l1.97-1.97a.75.75
             0 111.06 1.06l-3.25 3.25a.75.75 0
             01-1.06 0L4.22 6.53a.75.75 0 011.06-1.06l1.97
             1.97V1.75A.75.75 0 018 1zM2.5 13.75a.75.75 0
             010-1.5h11a.75.75 0 010 1.5h-11z"
    />
  </svg>
)
