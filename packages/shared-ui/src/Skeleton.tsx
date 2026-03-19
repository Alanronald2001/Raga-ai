import clsx from 'clsx'

interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-xl',
  full: 'rounded-full',
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className,
}: SkeletonProps) {
  return (
    <span
      role="presentation"
      className={clsx('block animate-pulse bg-slate-200', roundedMap[rounded], className)}
      style={{ width, height }}
    />
  )
}

// Convenience composite for a card skeleton
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width="2.5rem" height="2.5rem" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton height="0.875rem" width="60%" />
          <Skeleton height="0.75rem" width="40%" />
        </div>
      </div>
      <Skeleton height="0.75rem" />
      <Skeleton height="0.75rem" width="80%" />
      <Skeleton height="0.75rem" width="50%" />
    </div>
  )
}
