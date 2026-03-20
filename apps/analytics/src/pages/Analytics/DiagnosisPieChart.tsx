import type { DiagnosisCategory } from '@raga/shared-types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

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

const total = (data: DiagnosisCategory[]) => data.reduce((s, d) => s + d.count, 0)

export default function DiagnosisPieChart({ data }: { data: DiagnosisCategory[] }) {
  const sum = total(data)

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-800">Diagnosis Categories</h2>
        <p className="text-xs text-slate-400 mt-0.5">Case distribution by diagnosis</p>
      </div>

      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={52}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number, name: string) => [
                `${v} (${((v / sum) * 100).toFixed(1)}%)`,
                name,
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
          </PieChart>
        </ResponsiveContainer>

        {/* Custom legend */}
        <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[220px]">
          {data.map((d, i) => (
            <div key={d.category} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-[11px] text-slate-600 truncate flex-1">{d.category}</span>
              <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                {((d.count / sum) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
