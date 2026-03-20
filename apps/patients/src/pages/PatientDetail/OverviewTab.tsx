import type { Patient } from '@raga/shared-types'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Props {
  patient: Patient
}

export default function OverviewTab({ patient: p }: Props) {
  // Normalise vitals to 0-100 scale for radar
  const radarData = [
    { metric: 'Heart Rate', value: norm(p.vitals.heartRate, 40, 140) },
    { metric: 'SpO₂', value: norm(p.vitals.oxygenSaturation, 80, 100) },
    { metric: 'Temp', value: norm(p.vitals.temperature, 96, 104) },
    { metric: 'BP (sys)', value: norm(parseInt(p.vitals.bloodPressure), 60, 180) },
    { metric: 'Weight', value: norm(p.vitals.weight, 30, 150) },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Radar chart */}
        <div>
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Vitals Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar
                name="Vitals"
                dataKey="value"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(0)}%`, 'Score']}
                contentStyle={{
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '11px',
                  padding: '6px 10px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Notes / condition summary */}
        <div>
          <h3 className="text-xs font-semibold text-slate-700 mb-3">Clinical Notes</h3>
          <div
            className="bg-slate-50 rounded-xl p-4 text-xs
                          text-slate-600 leading-relaxed min-h-[160px]"
          >
            {p.notes ?? 'No clinical notes recorded for this patient.'}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-xs font-semibold text-slate-700 mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {mockActivity(p).map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl
                            bg-slate-50 hover:bg-slate-100
                            transition-colors"
            >
              <span
                className={`mt-0.5 h-6 w-6 rounded-full shrink-0
                               flex items-center justify-center
                               text-[10px] font-bold ${a.color}`}
              >
                {a.icon}
              </span>
              <div>
                <p className="text-xs font-medium text-slate-700">{a.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function norm(val: number, min: number, max: number) {
  return Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100))
}

function mockActivity(p: Patient) {
  return [
    {
      icon: '📋',
      color: 'bg-indigo-100 text-indigo-700',
      title: `Admitted to ${p.department}`,
      time: p.lastVisit,
    },
    {
      icon: '💊',
      color: 'bg-amber-100 text-amber-700',
      title: 'Medication administered',
      time: `${p.lastVisit} · 09:30`,
    },
    {
      icon: '🩺',
      color: 'bg-emerald-100 text-emerald-700',
      title: 'Vitals recorded by nursing staff',
      time: `${p.lastVisit} · 08:00`,
    },
    {
      icon: '📄',
      color: 'bg-sky-100 text-sky-700',
      title: 'Lab results reviewed',
      time: p.lastVisit,
    },
  ]
}
