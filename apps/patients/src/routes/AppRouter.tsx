import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { PatientProvider } from '../context/PatientContext'
import { Skeleton, SkeletonCard } from '@raga/shared-ui'

// ── Lazy pages ────────────────────────────────────────────────────
const PatientsPage = lazy(() => import('../pages/Patients/PatientsPage'))
const PatientDetailPage = lazy(() => import('../pages/PatientDetail/PatientDetailPage'))

// ── Suspense fallback ─────────────────────────────────────────────
function ListSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton height="2.25rem" width="280px" rounded="lg" />
        <div className="flex gap-2">
          <Skeleton height="2.25rem" width="100px" rounded="lg" />
          <Skeleton height="2.25rem" width="72px" rounded="lg" />
        </div>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-5 bg-slate-50 min-h-screen">
      {/* Back + name */}
      <div className="flex items-center gap-3">
        <Skeleton height="2rem" width="2rem" rounded="lg" />
        <Skeleton height="1.75rem" width="200px" rounded="lg" />
      </div>
      {/* Header card */}
      <Skeleton height="9rem" rounded="lg" />
      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

// ── Router definition ─────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<ListSkeleton />}>
        <PatientsPage />
      </Suspense>
    ),
  },
  {
    path: '/:id',
    element: (
      <Suspense fallback={<DetailSkeleton />}>
        <PatientDetailPage />
      </Suspense>
    ),
  },
  // Catch-all → list
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

// ── Root with provider ────────────────────────────────────────────
function RouterWithProvider() {
  return (
    <PatientProvider>
      <RouterProvider router={router} />
    </PatientProvider>
  )
}

export default RouterWithProvider
