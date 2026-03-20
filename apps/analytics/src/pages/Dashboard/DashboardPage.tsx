import { useAnalytics } from '../../context/AnalyticsContext'
import KPICard from './KPICard'
import RecentAppointmentsTable from './RecentAppointmentsTable'
import ActivityFeed from './ActivityFeed'
import AdmissionsTrendChart from './AdmissionsTrendChart'
import { SkeletonCard, Skeleton } from '@raga/shared-ui'
import { useEffect, useState } from 'react'
import { getAppointments, getActivityFeed } from '@raga/mock-api'
import type { Appointment } from '@raga/shared-types'
import type { ActivityItem } from '@raga/mock-api'

export default function DashboardPage() {
  const { kpis, analyticsData, loading, isAuthed } = useAnalytics()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [subLoading, setSubLoading] = useState(true)

  useEffect(() => {
    if (!isAuthed) return
    Promise.all([getAppointments(), getActivityFeed()])
      .then(([appts, feed]) => {
        setAppointments(appts)
        setActivity(feed)
      })
      .finally(() => setSubLoading(false))
  }, [isAuthed])

  // ── Auth wait ────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <div
        className="flex items-center justify-center
                      min-h-screen bg-slate-50"
      >
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <PulsingDot />
          <span className="text-sm">Waiting for session…</span>
        </div>
      </div>
    )
  }

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading || subLoading) {
    return (
      <div className="p-6 space-y-5 min-h-screen bg-slate-50">
        <Skeleton height="1.75rem" width="200px" rounded="lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    )
  }

  const trend = analyticsData?.admissionsTrend ?? []

  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* ── Page header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5
                         bg-emerald-50 text-emerald-700 rounded-full
                         text-xs font-medium border border-emerald-100"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500
                           animate-pulse"
          />
          Live
        </span>
      </div>

      {/* ── KPI row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 4).map((kpi, i) => (
          <KPICard key={i} kpi={kpi} trend={trend} />
        ))}
      </div>

      {/* ── Middle row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentAppointmentsTable appointments={appointments} />
        </div>
        <ActivityFeed items={activity} />
      </div>

      {/* ── Trend chart ────────────────────────────────────── */}
      <AdmissionsTrendChart data={trend} />
    </div>
  )
}

function PulsingDot() {
  return (
    <div className="relative flex h-8 w-8">
      <span
        className="animate-ping absolute inline-flex h-full w-full
                       rounded-full bg-indigo-300 opacity-50"
      />
      <span
        className="relative inline-flex rounded-full h-8 w-8
                       bg-indigo-500 opacity-70"
      />
    </div>
  )
}
