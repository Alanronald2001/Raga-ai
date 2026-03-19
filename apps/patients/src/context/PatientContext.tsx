import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { getPatients } from '@raga/mock-api'
import type { Patient, ViewMode, PatientStatus } from '@raga/shared-types'
import { onBridgeMessage } from '@raga/shared-types'

// ── Types ────────────────────────────────────────────────────────
interface PatientContextValue {
  // State
  patients: Patient[]
  filtered: Patient[]
  selectedPatient: Patient | null
  viewMode: ViewMode
  searchQuery: string
  statusFilter: PatientStatus | 'all'
  loading: boolean
  error: string | null
  isAuthed: boolean

  // Actions
  setViewMode: (mode: ViewMode) => void
  setSearch: (query: string) => void
  setStatusFilter: (status: PatientStatus | 'all') => void
  selectPatient: (patient: Patient | null) => void
  refetch: () => Promise<void>
}

// ── Context ──────────────────────────────────────────────────────
const PatientContext = createContext<PatientContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────
export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthed, setIsAuthed] = useState(false)

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Bridge: wait for AUTH_TOKEN_READY before fetching ─────────
  useEffect(() => {
    const unsubscribe = onBridgeMessage(msg => {
      if (msg.type === 'AUTH_TOKEN_READY') {
        setIsAuthed(true)
        // store token if you need it for real API calls later
        // e.g. sessionStorage.setItem('token', msg.payload.token)
      }
      if (msg.type === 'AUTH_SIGNED_OUT') {
        setIsAuthed(false)
        setPatients([])
        setSelectedPatient(null)
      }
    })

    // Signal shell that this MFE is ready to receive auth
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'MFE_READY' }, '*')
    }

    return unsubscribe
  }, [])

  // ── Fetch once authed ──────────────────────────────────────────
  useEffect(() => {
    if (isAuthed) fetchPatients()
  }, [isAuthed, fetchPatients])

  // ── Derived: filtered list ─────────────────────────────────────
  const filtered = useMemo(() => {
    let list = patients

    if (statusFilter !== 'all') {
      list = list.filter(p => p.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.id.toLowerCase().includes(q)
      )
    }

    return list
  }, [patients, statusFilter, searchQuery])

  // ── Actions ───────────────────────────────────────────────────
  const setSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setSelectedPatient(null)
  }, [])

  const selectPatient = useCallback((patient: Patient | null) => {
    setSelectedPatient(patient)
  }, [])

  const refetch = useCallback(async () => {
    if (isAuthed) await fetchPatients()
  }, [isAuthed, fetchPatients])

  return (
    <PatientContext.Provider
      value={{
        patients,
        filtered,
        selectedPatient,
        viewMode,
        searchQuery,
        statusFilter,
        loading,
        error,
        isAuthed,
        setViewMode,
        setSearch,
        setStatusFilter,
        selectPatient,
        refetch,
      }}
    >
      {children}
    </PatientContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function usePatients(): PatientContextValue {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error('usePatients must be used inside <PatientProvider>')
  return ctx
}
