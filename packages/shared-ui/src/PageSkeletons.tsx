import { Skeleton, SkeletonCard } from './Skeleton'

// ── Dashboard skeleton ────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen animate-pulse-subtle">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height="1.5rem" width="180px" rounded="md" />
          <Skeleton height="0.875rem" width="120px" rounded="md" />
        </div>
        <Skeleton height="1.75rem" width="60px" rounded="full" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border
                                  border-slate-100 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <Skeleton width="2.25rem" height="2.25rem" rounded="lg" />
              <Skeleton width="4rem" height="2rem" rounded="md" />
            </div>
            <Skeleton height="1.75rem" width="60%" rounded="md" />
            <Skeleton height="0.75rem" width="80%" rounded="md" />
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 bg-white rounded-xl border
                        border-slate-100 overflow-hidden"
        >
          <div
            className="px-5 py-4 border-b border-slate-50 flex
                          items-center justify-between"
          >
            <Skeleton height="1rem" width="160px" rounded="md" />
            <Skeleton height="0.875rem" width="60px" rounded="md" />
          </div>
          <div className="p-2 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <Skeleton width="1.75rem" height="1.75rem" rounded="full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton height="0.75rem" width="40%" rounded="sm" />
                  <Skeleton height="0.625rem" width="60%" rounded="sm" />
                </div>
                <Skeleton height="1.25rem" width="60px" rounded="full" />
              </div>
            ))}
          </div>
        </div>
        <SkeletonCard />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <Skeleton height="1rem" width="200px" rounded="md" />
            <Skeleton height="0.75rem" width="120px" rounded="md" />
          </div>
          <div className="flex gap-4">
            <Skeleton height="0.75rem" width="80px" rounded="md" />
            <Skeleton height="0.75rem" width="80px" rounded="md" />
          </div>
        </div>
        <Skeleton height="200px" rounded="lg" />
      </div>
    </div>
  )
}

// ── Patients table skeleton ───────────────────────────────────────
export function PatientsTableSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Toolbar */}
      <div
        className="sticky top-0 bg-slate-50/90 border-b
                      border-slate-100 px-6 py-3"
      >
        <div className="flex items-center gap-3">
          <Skeleton height="2.25rem" width="280px" rounded="lg" />
          <Skeleton height="2.25rem" width="140px" rounded="lg" />
          <Skeleton height="2.25rem" width="160px" rounded="lg" />
          <div className="flex-1" />
          <Skeleton height="2rem" width="72px" rounded="lg" />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-5">
        <div
          className="bg-white rounded-xl border border-slate-100
                        shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center gap-4 px-5 py-3
                          border-b border-slate-100 bg-slate-50"
          >
            {[52, 16, 20, 28, 36, 20, 28, 20].map((w, i) => (
              <Skeleton key={i} height="0.75rem" width={`${w * 4}px`} rounded="sm" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5
                            border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3 w-52">
                <Skeleton width="2rem" height="2rem" rounded="full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton height="0.75rem" width="70%" rounded="sm" />
                  <Skeleton height="0.625rem" width="50%" rounded="sm" />
                </div>
              </div>
              <Skeleton height="0.75rem" width="32px" rounded="sm" />
              <Skeleton height="0.75rem" width="64px" rounded="sm" />
              <Skeleton height="1.25rem" width="72px" rounded="full" />
              <Skeleton height="0.75rem" width="96px" rounded="sm" />
              <Skeleton height="1.25rem" width="40px" rounded="md" />
              <Skeleton height="0.75rem" width="80px" rounded="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div
        className="mt-auto px-6 py-3 border-t border-slate-100
                      bg-white flex items-center justify-between"
      >
        <Skeleton height="1.75rem" width="180px" rounded="lg" />
        <Skeleton height="0.75rem" width="100px" rounded="sm" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="1.75rem" height="1.75rem" rounded="md" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Analytics skeleton ────────────────────────────────────────────
export function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* Header + date picker */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton height="1.5rem" width="160px" rounded="md" />
          <Skeleton height="0.75rem" width="220px" rounded="md" />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="2rem" width="72px" rounded="md" />
          ))}
        </div>
      </div>

      {/* Full-width line chart */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex items-start justify-between mb-5">
          <div className="space-y-2">
            <Skeleton height="1rem" width="220px" rounded="md" />
            <Skeleton height="0.75rem" width="160px" rounded="md" />
          </div>
          <div className="flex gap-4">
            <Skeleton height="0.75rem" width="80px" rounded="md" />
            <Skeleton height="0.75rem" width="80px" rounded="md" />
          </div>
        </div>
        <Skeleton height="240px" rounded="lg" />
      </div>

      {/* Two charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div
            key={i}
            className="bg-white rounded-xl border
                                  border-slate-100 p-5 space-y-4"
          >
            <div className="space-y-2">
              <Skeleton height="1rem" width="180px" rounded="md" />
              <Skeleton height="0.75rem" width="130px" rounded="md" />
            </div>
            <Skeleton height="220px" rounded="lg" />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton height="1rem" width="160px" rounded="md" />
              <Skeleton height="0.75rem" width="120px" rounded="md" />
            </div>
            <div className="flex flex-col gap-1">
              {[80, 60, 70].map((w, i) => (
                <Skeleton key={i} height="1.25rem" width={`${w}px`} rounded="full" />
              ))}
            </div>
          </div>
          <Skeleton height="200px" rounded="lg" />
        </div>
        {/* Summary table */}
        <div
          className="bg-white rounded-xl border border-slate-100
                        overflow-hidden"
        >
          <div
            className="px-5 py-4 border-b border-slate-50 flex
                          items-center justify-between"
          >
            <Skeleton height="1rem" width="120px" rounded="md" />
            <Skeleton height="1.75rem" width="90px" rounded="lg" />
          </div>
          <div className="divide-y divide-slate-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <Skeleton height="0.75rem" width="120px" rounded="sm" />
                <Skeleton height="0.75rem" width="60px" rounded="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
