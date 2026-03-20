import { useState, useMemo } from 'react'
import { useAnalytics } from '../../context/AnalyticsContext'
import { Skeleton, SkeletonCard } from '@raga/shared-ui'
import AdmissionsLineChart from './AdmissionsLineChart'
import DepartmentBarChart from './DepartmentBarChart'
import DiagnosisPieChart from './DiagnosisPieChart'
import RevenueAreaChart from './RevenueAreaChart'
import SummaryTable from './SummaryTable'
import clsx from 'clsx'

// ── Date range presets ────────────────────────────────────────────
type Preset = '7d' | '30d' | '90d' | 'custom'

const PRESETS: { label: string; value: Preset }[] = [
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 30d', value: '30d' },
  { label: 'Last 90d', value: '90d' },
  { label: 'Custom', value: 'custom' },
]

function presetsToRange(preset: Preset): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  if (preset === '7d') from.setDate(from.getDate() - 7)
  if (preset === '30d') from.setDate(from.getDate() - 30)
  if (preset === '90d') from.setDate(from.getDate() - 90)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

// ── Component ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { analyticsData, dateRange, setDateRange, loading, isAuthed } = useAnalytics()

  const [preset, setPreset] = useState<Preset>('30d')
  const [customFrom, setCustomFrom] = useState(dateRange.from)
  const [customTo, setCustomTo] = useState(dateRange.to)

  const handlePreset = (p: Preset) => {
    setPreset(p)
    if (p !== 'custom') setDateRange(presetsToRange(p))
  }

  const handleCustomApply = () => {
    setDateRange({ from: customFrom, to: customTo })
  }

  // Slice data to roughly match date range for mock purposes
  const slicedData = useMemo(() => {
    if (!analyticsData) return null
    const months = preset === '7d' ? 1 : preset === '30d' ? 3 : preset === '90d' ? 6 : 12
    return {
      ...analyticsData,
      admissionsTrend: analyticsData.admissionsTrend.slice(-months),
      revenueData: analyticsData.revenueData.slice(-months),
    }
  }, [analyticsData, preset])

  // ── Auth wait ────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div
        className="flex items-center justify-center
                      min-h-screen bg-slate-50 text-slate-400 text-sm"
      >
        Waiting for session…
      </div>
    )
  }

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading || !slicedData) {
    return (
      <div className="p-6 space-y-5 min-h-screen bg-slate-50">
        <div className="flex items-center justify-between">
          <Skeleton height="1.75rem" width="180px" rounded="lg" />
          <Skeleton height="2.25rem" width="320px" rounded="lg" />
        </div>
        <SkeletonCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Hospital performance overview</p>
        </div>

        {/* ── Date range controls ────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset toggle buttons */}
          <div
            className="flex items-center bg-white border border-slate-200
                          rounded-lg p-0.5 gap-0.5"
          >
            {PRESETS.map(p => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-medium',
                  'transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-indigo-500',
                  preset === p.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom date inputs */}
          {preset === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                max={customTo}
                onChange={e => setCustomFrom(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg
                           px-2.5 py-1.5 text-slate-700 bg-white
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400">→</span>
              <input
                type="date"
                value={customTo}
                min={customFrom}
                onChange={e => setCustomTo(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg
                           px-2.5 py-1.5 text-slate-700 bg-white
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500 cursor-pointer"
              />
              <button
                onClick={handleCustomApply}
                className="px-3 py-1.5 bg-indigo-600 text-white
                           rounded-lg text-xs font-medium
                           hover:bg-indigo-700 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Full-width admissions line chart ───────────────── */}
      <AdmissionsLineChart data={slicedData.admissionsTrend} />

      {/* ── Two column: bar + pie ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DepartmentBarChart data={slicedData.departmentBreakdown} />
        <DiagnosisPieChart data={slicedData.diagnosisCategories} />
      </div>

      {/* ── Revenue area chart + summary table ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueAreaChart data={slicedData.revenueData} />
        <SummaryTable
          admissions={slicedData.admissionsTrend}
          revenue={slicedData.revenueData}
          departments={slicedData.departmentBreakdown}
        />
      </div>
    </div>
  )
}
