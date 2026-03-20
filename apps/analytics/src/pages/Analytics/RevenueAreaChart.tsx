import type { RevenuePoint } from '@raga/shared-types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const fmt = (v: number) =>
  v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`

export default function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalExpenses = data.reduce((s, d) => s + d.expenses, 0)
  const netMargin = (((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1)

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Revenue Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Revenue vs expenses (area)</p>
        </div>
        {/* Summary pills */}
        <div className="flex flex-col gap-1 items-end">
          <span
            className="text-[10px] bg-indigo-50 text-indigo-700
                           rounded-full px-2 py-0.5 font-medium"
          >
            Rev: {fmt(totalRevenue)}
          </span>
          <span
            className="text-[10px] bg-red-50 text-red-600
                           rounded-full px-2 py-0.5 font-medium"
          >
            Exp: {fmt(totalExpenses)}
          </span>
          <span
            className="text-[10px] bg-emerald-50 text-emerald-700
                           rounded-full px-2 py-0.5 font-medium"
          >
            Margin: {netMargin}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: number) => fmt(v)}
            contentStyle={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              padding: '8px 12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1' }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#expGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#ef4444' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
