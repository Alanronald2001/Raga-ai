import type { AdmissionPoint } from '@raga/shared-types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  data: AdmissionPoint[]
}

export default function AdmissionsTrendChart({ data }: Props) {
  return (
    <div
      className="bg-white rounded-xl border border-slate-100
                    shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Admissions vs Discharges</h2>
          <p className="text-xs text-slate-400 mt-0.5">Last 12 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Admissions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Discharges
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="admissions"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#admGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1' }}
          />
          <Area
            type="monotone"
            dataKey="discharges"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#disGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
