import clsx from 'clsx'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
  className?: string
}

const sizes: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-7 w-7 border-2',
  lg: 'h-11 w-11 border-[3px]',
}

export function Spinner({ size = 'md', label = 'Loading…', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={clsx('inline-block', className)}>
      <span
        className={clsx(
          'block rounded-full border-slate-200 border-t-indigo-600 animate-spin',
          sizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
