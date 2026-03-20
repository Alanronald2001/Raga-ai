import { useAnalytics } from '../context/AnalyticsContext'
import { Spinner } from '@raga/shared-ui'

export default function AnalyticsPage() {
  const { analyticsData, loading, isAuthed } = useAnalytics()

  if (!isAuthed) {
    return (
      <div
        className="flex items-center justify-center
                      min-h-screen bg-slate-50 text-slate-400 text-sm"
      >
        Waiting for authentication…
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-slate-800 mb-4">Analytics</h1>
      <pre className="text-xs text-slate-500">{JSON.stringify(analyticsData, null, 2)}</pre>
    </div>
  )
}
