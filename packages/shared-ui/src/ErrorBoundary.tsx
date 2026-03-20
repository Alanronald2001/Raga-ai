import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
    this.props.onError?.(error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return <ErrorCard error={this.state.error} onReset={this.handleReset} />
    }
    return this.props.children
  }
}

// ── Error card UI ─────────────────────────────────────────────────
function ErrorCard({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div
      className="flex items-center justify-center
                    min-h-[400px] p-6 bg-slate-50"
    >
      <div
        className="bg-white rounded-2xl border border-red-100
                      shadow-md shadow-red-50 p-8 max-w-md w-full
                      flex flex-col items-center gap-5 text-center
                      animate-scale-in"
      >
        {/* Icon */}
        <div
          className="h-14 w-14 rounded-2xl bg-red-50 border
                        border-red-100 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-7 h-7 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217
                 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874
                 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <h2 className="text-base font-bold text-slate-800">Something went wrong</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            An unexpected error occurred while rendering this page. You can try again or reload the
            app.
          </p>
          {error?.message && (
            <details className="mt-3 text-left">
              <summary
                className="text-xs text-slate-400 cursor-pointer
                                  hover:text-slate-600 transition-colors"
              >
                Technical details
              </summary>
              <pre
                className="mt-2 text-[10px] text-red-600 bg-red-50
                              rounded-lg p-3 overflow-auto max-h-32
                              whitespace-pre-wrap break-words"
              >
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm
                       font-medium border border-slate-200
                       text-slate-600 hover:bg-slate-50
                       transition-colors duration-150"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm
                       font-medium bg-red-600 text-white
                       hover:bg-red-700 transition-colors duration-150"
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Convenience HOC ───────────────────────────────────────────────
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
