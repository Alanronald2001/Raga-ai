import type { DepartmentBreakdown } from '@raga/shared-types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const COLORS = [
  '#6366f1',
  '#0ea5e9',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#ec4899',
  '#64748b',
]

export default function DepartmentBarChart({ data }: { data: DepartmentBreakdown[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">Department Breakdown</h2>
        <p className="text-xs text-slate-400 mt-0.5">Patient count by department</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 70, bottom: 0 }}
          barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="department"
            width={70}
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: number, _: string, entry) => [
              `${v} patients (${entry.payload.percentage}%)`,
              entry.payload.department,
            ]}
            contentStyle={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Patients">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
