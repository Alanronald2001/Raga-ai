import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePatients } from '../../context/PatientContext'
import { postToShell } from '@raga/shared-types'
import { Avatar, Badge, Spinner, Button } from '@raga/shared-ui'
import { getPatientById, getAppointments } from '@raga/mock-api'
import type { Patient, Appointment } from '@raga/shared-types'
import VitalsPanel from './VitalsPanel'
import ContactPanel from './ContactPanel'
import OverviewTab from './OverviewTab'
import AppointmentsTab from './AppointmentsTab'
import NotesTab from './NotesTab'
import clsx from 'clsx'

// ── Tab config ────────────────────────────────────────────────────
type Tab = 'overview' | 'appointments' | 'notes'

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'notes', label: 'Notes' },
]

// ── Component ─────────────────────────────────────────────────────
export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthed } = usePatients()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // ── Fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthed || !id) return
    setLoading(true)
    setError(null)

    Promise.all([getPatientById(id), getAppointments()])
      .then(([p, appts]) => {
        if (!p) {
          setError('Patient not found.')
          return
        }
        setPatient(p)
        setAppointments(appts.filter(a => a.patientId === id))
      })
      .catch(() => {
        setError('Failed to load patient data.')
      })
      .finally(() => setLoading(false))
  }, [id, isAuthed])

  // ── Back navigation ────────────────────────────────────────────
  const handleBack = useCallback(() => {
    navigate('/')
    postToShell({ type: 'NAVIGATE', payload: { path: '/patients' } })
  }, [navigate])

  // ── Auth wait ──────────────────────────────────────────────────
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

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="flex items-center justify-center
                      min-h-screen bg-slate-50"
      >
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────
  if (error || !patient) {
    return (
      <div
        className="flex flex-col items-center justify-center
                      min-h-screen bg-slate-50 gap-4"
      >
        <div
          className="h-14 w-14 rounded-full bg-red-50
                        flex items-center justify-center"
        >
          <ErrorIcon />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">{error ?? 'Patient not found'}</p>
          <p className="text-xs text-slate-400 mt-1">The patient record could not be loaded.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleBack}>
          ← Back to Patients
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Back bar ────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm
                      border-b border-slate-100 px-6 py-3"
      >
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs
                     font-medium text-slate-500 hover:text-indigo-600
                     transition-colors group"
        >
          <ChevronLeftIcon
            className="group-hover:-translate-x-0.5
                                      transition-transform"
          />
          Back to Patients
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5 flex-1">
        {/* ── Header card ─────────────────────────────────── */}
        <div
          className={clsx(
            'bg-white rounded-2xl border shadow-sm p-6',
            'flex flex-col sm:flex-row sm:items-center gap-5',
            patient.status === 'critical' ? 'border-red-200' : 'border-slate-100'
          )}
        >
          {/* Critical strip */}
          {patient.status === 'critical' && (
            <div
              className="hidden sm:block w-1 self-stretch
                            rounded-full bg-gradient-to-b
                            from-red-400 to-rose-600"
            />
          )}

          {/* Avatar */}
          <Avatar
            name={patient.name}
            size="xl"
            className="shadow-md shrink-0 self-start sm:self-center"
          />

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start flex-wrap gap-2">
              <h1 className="text-xl font-bold text-slate-800 leading-tight">{patient.name}</h1>
              <Badge status={patient.status} variant="subtle" />
              {patient.status === 'critical' && (
                <span
                  className="inline-flex items-center gap-1 text-[10px]
                                 font-bold text-red-600 bg-red-50 px-2 py-1
                                 rounded-full animate-pulse border
                                 border-red-200"
                >
                  ● CRITICAL
                </span>
              )}
            </div>
            <div
              className="flex flex-wrap gap-x-5 gap-y-1 text-xs
                            text-slate-500"
            >
              <span>
                <span className="text-slate-400">ID: </span>
                <span className="font-mono font-medium text-slate-700">{patient.id}</span>
              </span>
              <span>
                <span className="text-slate-400">Age: </span>
                <span className="font-medium text-slate-700">{patient.age}y</span>
              </span>
              <span className="capitalize">
                <span className="text-slate-400">Gender: </span>
                <span className="font-medium text-slate-700">{patient.gender}</span>
              </span>
              <span>
                <span className="text-slate-400">Blood: </span>
                <span className="font-bold font-mono text-red-700">{patient.bloodGroup}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DeptIcon />
              <span
                className="text-xs font-medium text-indigo-700
                               bg-indigo-50 px-2.5 py-0.5 rounded-full"
              >
                {patient.department}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div
            className="flex sm:flex-col gap-4 sm:gap-2
                          sm:items-end shrink-0"
          >
            <QuickStat label="Last Visit" value={patient.lastVisit} />
            <QuickStat
              label="Next Appt"
              value={patient.nextAppointment ?? 'Not scheduled'}
              accent={!!patient.nextAppointment}
            />
          </div>
        </div>

        {/* ── Two-column panel row ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <VitalsPanel vitals={patient.vitals} />
          <ContactPanel patient={patient} />
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl border border-slate-100
                        shadow-sm overflow-hidden flex flex-col"
        >
          {/* Tab bar */}
          <div className="flex border-b border-slate-100 px-5 pt-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={clsx(
                  'px-4 py-3 text-sm font-medium transition-all',
                  'border-b-2 -mb-px focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-inset',
                  'focus-visible:ring-indigo-500',
                  activeTab === t.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {activeTab === 'overview' && <OverviewTab patient={patient} />}
            {activeTab === 'appointments' && <AppointmentsTab appointments={appointments} />}
            {activeTab === 'notes' && <NotesTab patient={patient} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────
function QuickStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</p>
      <p
        className={clsx(
          'text-xs font-semibold mt-0.5 tabular-nums',
          accent ? 'text-indigo-600' : 'text-slate-600'
        )}
      >
        {value}
      </p>
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

// ── Icons ─────────────────────────────────────────────────────────
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={clsx('w-3.5 h-3.5', className)}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.78 3.97a.75.75 0 010 1.06L6.81 8l2.97
         2.97a.75.75 0 11-1.06 1.06L5.25 8.53a.75.75
         0 010-1.06l3.47-3.47a.75.75 0 011.06 0z"
    />
  </svg>
)

const DeptIcon = () => (
  <svg viewBox="0 0 14 14" fill="currentColor" className="w-3 h-3 text-indigo-400 shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 1a5 5 0 100 10A5 5 0 007 1zM0 6a7 7 0
         1114 0A7 7 0 010 6z"
    />
  </svg>
)

const ErrorIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-red-400">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75
         0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75
         0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
    />
  </svg>
)
