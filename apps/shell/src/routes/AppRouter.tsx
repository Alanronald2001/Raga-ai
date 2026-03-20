import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@raga/shared-ui'
import AuthGuard from '../components/layout/AuthGuard'

// ── Lazy pages ────────────────────────────────────────────────────
const LoginPage = lazy(() => import('../pages/LoginPage'))
const AppLayout = lazy(() => import('../layout/AppLayout'))
const DashboardEmbed = lazy(() => import('../pages/DashboardEmbed'))
const AnalyticsEmbed = lazy(() => import('../pages/AnalyticsEmbed'))
const PatientsEmbed = lazy(() => import('../pages/PatientsEmbed'))

// ── Suspense fallback ─────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full h-full">
      <Skeleton height="2.5rem" width="40%" rounded="lg" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height="6rem" rounded="lg" />
        ))}
      </div>
      <Skeleton height="24rem" rounded="lg" />
    </div>
  )
}

// ── Suspense wrapper ──────────────────────────────────────────────
function SuspenseRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

// ── Router ────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Public
  {
    path: '/login',
    element: (
      <SuspenseRoute>
        <LoginPage />
      </SuspenseRoute>
    ),
  },

  // Protected — all routes under AuthGuard + AppLayout
  {
    path: '/',
    element: (
      <SuspenseRoute>
        <AppLayout>
          <AuthGuard />
        </AppLayout>
      </SuspenseRoute>
    ),
    children: [
      // Default → dashboard
      {
        index: true,
        element: (
          <SuspenseRoute>
            <DashboardEmbed />
          </SuspenseRoute>
        ),
      },

      // Analytics MFE
      {
        path: 'analytics',
        element: (
          <SuspenseRoute>
            <AnalyticsEmbed />
          </SuspenseRoute>
        ),
      },

      // Patients MFE — list
      {
        path: 'patients',
        element: (
          <SuspenseRoute>
            <PatientsEmbed />
          </SuspenseRoute>
        ),
      },

      // Patients MFE — detail
      {
        path: 'patients/:id',
        element: (
          <SuspenseRoute>
            <PatientsEmbed />
          </SuspenseRoute>
        ),
      },

      // Catch-all → home
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

// ── Export ────────────────────────────────────────────────────────
export default function AppRouter() {
  return <RouterProvider router={router} />
}
