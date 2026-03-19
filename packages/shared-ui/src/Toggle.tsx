import clsx from 'clsx'
import type { ViewMode } from '@raga/shared-types'

interface ToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

const ListIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" d="M2 4h12M2 8h12M2 12h12" />
  </svg>
)

const GridIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
)

export function Toggle({ value, onChange, className }: ToggleProps) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className={clsx(
        'inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 gap-0.5',
        className
      )}
    >
      {(['list', 'grid'] as ViewMode[]).map(mode => (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={value === mode}
          aria-label={`${mode} view`}
          onClick={() => onChange(mode)}
          className={clsx(
            'flex items-center justify-center h-7 w-7 rounded-md transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
            value === mode
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          )}
        >
          {mode === 'list' ? <ListIcon /> : <GridIcon />}
        </button>
      ))}
    </div>
  )
}
