import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom'
import { PatientProvider } from './context/PatientContext'
import { postToShell } from '@raga/shared-types'
import { Skeleton, SkeletonCard } from '@raga/shared-ui'

// ── Lazy pages ────────────────────────────────────────────────────
const PatientsPage = lazy(() => import('./pages/Patients/PatientsPage'))
const PatientDetailPage = lazy(() => import('./pages/PatientDetail/PatientDetailPage'))

// ── Skeletons (same as before) ────────────────────────────────────
function ListSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <Skeleton height="2.25rem" width="280px" rounded="lg" />
        <div className="flex gap-2">
          <Skeleton height="2.25rem" width="100px" rounded="lg" />
          <Skeleton height="2.25rem" width="72px" rounded="lg" />
        </div>
      </div>
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
      <div className="flex items-center gap-3">
        <Skeleton height="2rem" width="2rem" rounded="lg" />
        <Skeleton height="1.75rem" width="200px" rounded="lg" />
      </div>
      <Skeleton height="9rem" rounded="lg" />
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

// ── Navigation bridge — must live inside RouterProvider ───────────
function NavigationBridge() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Only sync detail routes to shell — list route stays at /patients
    if (pathname === '/') return

    postToShell({
      type: 'NAVIGATE',
      payload: { path: `/patients${pathname}` },
    })
  }, [pathname])

  return null
}

// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavigationBridge />
        <Suspense fallback={<ListSkeleton />}>
          <PatientsPage />
        </Suspense>
      </>
    ),
  },
  {
    path: '/:id',
    element: (
      <>
        <NavigationBridge />
        <Suspense fallback={<DetailSkeleton />}>
          <PatientDetailPage />
        </Suspense>
      </>
    ),
  },
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
