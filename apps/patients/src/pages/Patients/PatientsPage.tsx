import { useState, useMemo } from 'react'
import { usePatients } from '../../context/PatientContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { Input, Toggle, Spinner, Skeleton } from '@raga/shared-ui'
import PatientTable from './PatientTable'
import PatientGrid from './PatientGrid'
import type { PatientStatus, ViewMode } from '@raga/shared-types'
import clsx from 'clsx'

// ── Constants ─────────────────────────────────────────────────────
const STATUS_OPTIONS: { label: string; value: PatientStatus | 'all' }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Stable', value: 'stable' },
  { label: 'Critical', value: 'critical' },
  { label: 'Discharged', value: 'discharged' },
]

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

// ── Component ─────────────────────────────────────────────────────
export default function PatientsPage() {
  const {
    filtered,
    loading,
    isAuthed,
    viewMode,
    setViewMode,
    setSearch,
    setStatusFilter,
    statusFilter,
  } = usePatients()

  // ── Local search input (debounced before hitting context) ──────
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 300)

  // Sync debounced value → context
  useMemo(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  // ── Department filter (local — derived from data) ──────────────
  const [deptFilter, setDeptFilter] = useState('all')

  // ── Persisted view mode ────────────────────────────────────────
  const [storedView, setStoredView] = useLocalStorage<ViewMode>(
    'healthos:patients:viewMode',
    'list'
  )

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode)
    setStoredView(mode)
  }

  // ── Pagination ─────────────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useLocalStorage('healthos:patients:pageSize', 20)

  // Derive unique departments from full patient list
  const departments = useMemo(() => {
    const depts = new Set(filtered.map(p => p.department))
    return ['all', ...Array.from(depts).sort()]
  }, [filtered])

  // Apply department filter on top of context filtered list
  const displayed = useMemo(() => {
    if (deptFilter === 'all') return filtered
    return filtered.filter(p => p.department === deptFilter)
  }, [filtered, deptFilter])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageSlice = displayed.slice((safePage - 1) * pageSize, safePage * pageSize)

  // Reset to page 1 on filter change
  useMemo(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, deptFilter])

  // ── Auth / loading states ──────────────────────────────────────
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

  if (loading) {
    return (
      <div className="p-6 space-y-4 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-between gap-3">
          <Skeleton height="2.25rem" width="280px" rounded="lg" />
          <div className="flex gap-2">
            <Skeleton height="2.25rem" width="140px" rounded="lg" />
            <Skeleton height="2.25rem" width="140px" rounded="lg" />
            <Skeleton height="2.25rem" width="72px" rounded="lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border
                                    border-slate-100 shadow-sm p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
                <div className="flex-1 space-y-2">
                  <Skeleton height="0.875rem" width="60%" />
                  <Skeleton height="0.75rem" width="40%" />
                </div>
              </div>
              <Skeleton height="0.75rem" />
              <Skeleton height="0.75rem" width="80%" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-sm
                      border-b border-slate-100 px-6 py-3"
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-xs">
            <Input
              placeholder="Search patients…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              fullWidth
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v as PatientStatus | 'all')}
            options={STATUS_OPTIONS.map(o => ({ label: o.label, value: o.value }))}
            placeholder="Status"
          />

          {/* Department filter */}
          <Select
            value={deptFilter}
            onChange={setDeptFilter}
            options={departments.map(d => ({
              label: d === 'all' ? 'All Departments' : d,
              value: d,
            }))}
            placeholder="Department"
          />

          <div className="flex-1" />

          {/* Results count */}
          <span className="text-xs text-slate-400 hidden sm:block tabular-nums">
            {displayed.length} patient{displayed.length !== 1 ? 's' : ''}
          </span>

          {/* View toggle */}
          <Toggle value={storedView} onChange={handleViewChange} />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-5">
        {pageSlice.length === 0 ? (
          <EmptyState query={searchInput} />
        ) : storedView === 'list' ? (
          <PatientTable patients={pageSlice} />
        ) : (
          <PatientGrid patients={pageSlice} />
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      {displayed.length > 0 && (
        <div
          className="sticky bottom-0 bg-white border-t border-slate-100
                        px-6 py-3 flex items-center justify-between gap-4
                        flex-wrap"
        >
          {/* Page size */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Rows:</span>
            <div className="flex gap-1">
              {PAGE_SIZE_OPTIONS.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size)
                    setPage(1)
                  }}
                  className={clsx(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    pageSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Page info */}
          <span className="text-xs text-slate-400 tabular-nums">
            {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, displayed.length)} of{' '}
            {displayed.length}
          </span>

          {/* Prev / Next */}
          <div className="flex items-center gap-1">
            <PageBtn
              label="←"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
            />
            {getPageNumbers(safePage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-xs text-slate-400">
                  …
                </span>
              ) : (
                <PageBtn
                  key={p}
                  label={String(p)}
                  onClick={() => setPage(Number(p))}
                  active={safePage === p}
                />
              )
            )}
            <PageBtn
              label="→"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────
function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  placeholder: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="text-xs border border-slate-200 rounded-lg px-3 py-2
                 text-slate-700 bg-white focus:outline-none
                 focus:ring-2 focus:ring-indigo-500 cursor-pointer
                 hover:border-slate-300 transition-colors"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function PageBtn({
  label,
  onClick,
  disabled,
  active,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium',
        'transition-colors duration-100',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        active ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
      )}
    >
      {label}
    </button>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center
                    min-h-[400px] gap-3 text-slate-400 select-none"
    >
      <div
        className="h-16 w-16 rounded-full bg-slate-100
                      flex items-center justify-center text-3xl"
      >
        🔍
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">No patients found</p>
        <p className="text-xs mt-1">
          {query
            ? `No results for "${query}" — try a different search`
            : 'Try adjusting your filters'}
        </p>
      </div>
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

// ── Pagination helpers ────────────────────────────────────────────
function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}
