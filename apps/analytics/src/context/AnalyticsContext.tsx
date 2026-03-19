import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { getDashboardKPIs, getAnalytics } from '@raga/mock-api'
import type { KPICard, AnalyticsData } from '@raga/shared-types'
import { onBridgeMessage } from '@raga/shared-types'

// ── Types ────────────────────────────────────────────────────────
interface DateRange {
  from: string // ISO date string
  to: string
}

interface AnalyticsContextValue {
  kpis: KPICard[]
  analyticsData: AnalyticsData | null
  dateRange: DateRange
  loading: boolean
  error: string | null
  isAuthed: boolean
  setDateRange: (range: DateRange) => void
  refetch: () => Promise<void>
}

// ── Defaults ─────────────────────────────────────────────────────
function defaultDateRange(): DateRange {
  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - 12)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

// ── Context ──────────────────────────────────────────────────────
const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [kpis, setKpis] = useState<KPICard[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthed, setIsAuthed] = useState(false)

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kpiData, analytics] = await Promise.all([getDashboardKPIs(), getAnalytics()])
      setKpis(kpiData)
      setAnalyticsData(analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Bridge: auth handshake ─────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onBridgeMessage(msg => {
      if (msg.type === 'AUTH_TOKEN_READY') {
        setIsAuthed(true)
      }
      if (msg.type === 'AUTH_SIGNED_OUT') {
        setIsAuthed(false)
        setKpis([])
        setAnalyticsData(null)
      }
    })

    // Signal shell this MFE is ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'MFE_READY' }, '*')
    }

    return unsubscribe
  }, [])

  // ── Fetch once authed ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthed) fetchAll()
  }, [isAuthed, fetchAll])

  // ── Refetch when dateRange changes (for real API, pass as param)
  useEffect(() => {
    if (isAuthed) fetchAll()
  }, [dateRange]) // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(async () => {
    if (isAuthed) await fetchAll()
  }, [isAuthed, fetchAll])

  return (
    <AnalyticsContext.Provider
      value={{
        kpis,
        analyticsData,
        dateRange,
        loading,
        error,
        isAuthed,
        setDateRange,
        refetch,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalytics must be used inside <AnalyticsProvider>')
  return ctx
}
