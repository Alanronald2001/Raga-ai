import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge } from '@raga/shared-ui'
import { postToShell } from '@raga/shared-types'
import type { Patient } from '@raga/shared-types'
import clsx from 'clsx'

// ── Types ─────────────────────────────────────────────────────────
type SortKey = 'name' | 'age' | 'department' | 'status' | 'lastVisit'
type SortDir = 'asc' | 'desc'

interface SortState {
  key: SortKey
  dir: SortDir
}

interface Props {
  patients: Patient[]
}

// ── Column config ─────────────────────────────────────────────────
interface Column {
  key: SortKey | null
  label: string
  width?: string
  align?: 'left' | 'right' | 'center'
}

const COLUMNS: Column[] = [
  { key: 'name', label: 'Patient', width: 'w-52' },
  { key: 'age', label: 'Age', width: 'w-16', align: 'center' },
  { key: null, label: 'Gender', width: 'w-20' },
  { key: 'status', label: 'Status', width: 'w-28' },
  { key: 'department', label: 'Department', width: 'w-36' },
  { key: null, label: 'Blood', width: 'w-20', align: 'center' },
  { key: 'lastVisit', label: 'Last Visit', width: 'w-28' },
  { key: null, label: 'Actions', width: 'w-20', align: 'center' },
]

// ── Sort helpers ──────────────────────────────────────────────────
function sortPatients(patients: Patient[], sort: SortState): Patient[] {
  return [...patients].sort((a, b) => {
    let cmp = 0
    switch (sort.key) {
      case 'name':
        cmp = a.name.localeCompare(b.name)
        break
      case 'age':
        cmp = a.age - b.age
        break
      case 'department':
        cmp = a.department.localeCompare(b.department)
        break
      case 'status':
        cmp = a.status.localeCompare(b.status)
        break
      case 'lastVisit':
        cmp = a.lastVisit.localeCompare(b.lastVisit)
        break
    }
    return sort.dir === 'asc' ? cmp : -cmp
  })
}

// ── Sort icon ─────────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={clsx(
        'inline-flex flex-col gap-[1px] ml-1 transition-opacity',
        active ? 'opacity-100' : 'opacity-25 group-hover/th:opacity-60'
      )}
    >
      <svg
        viewBox="0 0 8 8"
        className={clsx(
          'w-2 h-2 transition-colors',
          active && dir === 'asc' ? 'text-indigo-600' : 'text-slate-400'
        )}
        fill="currentColor"
      >
        <path d="M4 1L7 6H1L4 1Z" />
      </svg>
      <svg
        viewBox="0 0 8 8"
        className={clsx(
          'w-2 h-2 transition-colors',
          active && dir === 'desc' ? 'text-indigo-600' : 'text-slate-400'
        )}
        fill="currentColor"
      >
        <path d="M4 7L1 2H7L4 7Z" />
      </svg>
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function PatientTable({ patients }: Props) {
  const navigate = useNavigate()

  const [sort, setSort] = useState<SortState>({
    key: 'name',
    dir: 'asc',
  })

  const handleSort = useCallback((key: SortKey) => {
    setSort(prev =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }, [])

  const sorted = useMemo(() => sortPatients(patients, sort), [patients, sort])

  const handleRowClick = useCallback(
    (p: Patient) => {
      navigate(`/${p.id}`)
      postToShell({ type: 'NAVIGATE', payload: { path: `/patients/${p.id}` } })
    },
    [navigate]
  )

  return (
    <div
      className="bg-white rounded-xl border border-slate-100
                    shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          {/* ── Sticky header ─────────────────────────────── */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 border-b border-slate-100">
              {COLUMNS.map(col => (
                <th
                  key={col.label}
                  className={clsx(
                    'px-4 py-3 text-xs font-semibold text-slate-500',
                    'uppercase tracking-wide whitespace-nowrap select-none',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    !col.align && 'text-left',
                    col.key && 'cursor-pointer group/th',
                    col.key && 'hover:text-slate-700 hover:bg-slate-100',
                    col.key && 'transition-colors duration-100',
                    col.width
                  )}
                  onClick={() => col.key && handleSort(col.key)}
                  aria-sort={
                    col.key && sort.key === col.key
                      ? sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-0.5">
                    {col.label}
                    {col.key && <SortIcon active={sort.key === col.key} dir={sort.dir} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ──────────────────────────────────────── */}
          <tbody className="divide-y divide-slate-50">
            {sorted.length === 0 ? (
              <EmptyRow />
            ) : (
              sorted.map(p => <PatientRow key={p.id} patient={p} onClick={handleRowClick} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Patient row ───────────────────────────────────────────────────
function PatientRow({ patient: p, onClick }: { patient: Patient; onClick: (p: Patient) => void }) {
  return (
    <tr
      onClick={() => onClick(p)}
      className={clsx(
        'group cursor-pointer transition-colors duration-100',
        'hover:bg-indigo-50/40',
        p.status === 'critical' && 'bg-red-50/30 hover:bg-red-50/60'
      )}
    >
      {/* Avatar + Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={p.name} size="sm" />
          <div className="min-w-0">
            <p
              className="text-xs font-semibold text-slate-800
                          group-hover:text-indigo-600 transition-colors
                          truncate max-w-[140px]"
            >
              {p.name}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
          </div>
        </div>
      </td>

      {/* Age */}
      <td className="px-4 py-3 text-center">
        <span className="text-xs text-slate-600 tabular-nums">
          {p.age}
          <span className="text-slate-400">y</span>
        </span>
      </td>

      {/* Gender */}
      <td className="px-4 py-3">
        <span
          className={clsx(
            'text-xs capitalize px-2 py-0.5 rounded-full font-medium',
            p.gender === 'male' && 'bg-sky-50 text-sky-700',
            p.gender === 'female' && 'bg-pink-50 text-pink-700',
            p.gender === 'other' && 'bg-slate-100 text-slate-600'
          )}
        >
          {p.gender}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {p.status === 'critical' && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-red-500
                             animate-pulse shrink-0"
            />
          )}
          <Badge status={p.status} />
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3">
        <span className="text-xs text-slate-600 truncate block max-w-[130px]">{p.department}</span>
      </td>

      {/* Blood Group */}
      <td className="px-4 py-3 text-center">
        <span
          className="text-xs font-bold font-mono px-2 py-0.5
                         rounded-md bg-red-50 text-red-700"
        >
          {p.bloodGroup}
        </span>
      </td>

      {/* Last Visit */}
      <td className="px-4 py-3">
        <span className="text-xs text-slate-500 tabular-nums">{p.lastVisit}</span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={e => {
            e.stopPropagation()
            onClick(p)
          }}
          aria-label={`View ${p.name}`}
          className="p-1.5 rounded-lg text-slate-300
                     hover:text-indigo-600 hover:bg-indigo-50
                     transition-colors duration-100
                     opacity-0 group-hover:opacity-100"
        >
          <ChevronRightIcon />
        </button>
      </td>
    </tr>
  )
}

// ── Empty state row ───────────────────────────────────────────────
function EmptyRow() {
  return (
    <tr>
      <td colSpan={COLUMNS.length}>
        <div
          className="flex flex-col items-center justify-center
                        py-16 gap-3 text-slate-400 select-none"
        >
          <div
            className="h-14 w-14 rounded-full bg-slate-100
                          flex items-center justify-center"
          >
            <EmptyIcon />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">No patients match your filters</p>
            <p className="text-xs mt-1 text-slate-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      </td>
    </tr>
  )
}

// ── Icons ─────────────────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75
         0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06
         L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
    />
  </svg>
)

const EmptyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-7 h-7 text-slate-300"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0
         017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0
         A17.933 17.933 0 0112 21.75c-2.676
         0-5.216-.584-7.499-1.632z"
    />
  </svg>
)
