import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Skeleton } from '@raga/shared-ui'
import { ErrorBoundary } from '@raga/shared-ui'
// ── Lazy pages ────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'))
const AnalyticsPage = lazy(() => import('../pages/Analytics/AnalyticsPage'))

// ── Suspense fallback ─────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full h-full min-h-screen bg-slate-50">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height="5.5rem" rounded="lg" />
        ))}
      </div>
      {/* Charts */}
      <div className="flex gap-4 flex-1">
        <Skeleton width="66%" height="320px" rounded="lg" />
        <div className="flex flex-col gap-4 flex-1">
          <Skeleton height="150px" rounded="lg" />
          <Skeleton height="150px" rounded="lg" />
        </div>
      </div>
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Dashboard embed route
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <DashboardPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },

  // Full analytics route
  {
    path: '/analytics',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <AnalyticsPage />
        </Suspense>
      </ErrorBoundary>
    ),
  },

  // Default → dashboard
  {
    index: true,
    element: <Navigate to="/dashboard" replace />,
  },

  // Catch-all → dashboard
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])

// ── Export ────────────────────────────────────────────────────────
export default function AppRouter() {
  return <RouterProvider router={router} />
}
