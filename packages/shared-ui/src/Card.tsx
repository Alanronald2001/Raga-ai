import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type PaddingVariant = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
  padding?: PaddingVariant
  hoverable?: boolean
}

const paddings: Record<PaddingVariant, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export function Card({
  header,
  footer,
  padding = 'md',
  hoverable,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden',
        hoverable && 'transition-shadow duration-200 hover:shadow-md cursor-pointer',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">{footer}</div>}
    </div>
  )
}
