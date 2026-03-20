import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Spinner } from '@raga/shared-ui'
import clsx from 'clsx'

// ── Types ─────────────────────────────────────────────────────────
interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

// ── Validation ────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!fields.email) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(fields.email)) errors.email = 'Enter a valid email address.'
  if (!fields.password) errors.password = 'Password is required.'
  else if (fields.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}

// ── Demo credentials ──────────────────────────────────────────────
const DEMO = { email: 'demo@healthos.com', password: 'demo1234' }

// ── Component ─────────────────────────────────────────────────────
export default function LoginPage() {
  const { user, loading: authLoading, error: authError, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  // Redirect if already authed
  useEffect(() => {
    if (user && !authLoading) navigate(from, { replace: true })
  }, [user, authLoading, navigate, from])

  const [form, setForm] = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPwd, setShowPwd] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Validate on blur only
  const handleBlur = useCallback(
    (field: keyof FormState) => {
      setTouched(t => ({ ...t, [field]: true }))
      setErrors(validate(form))
    },
    [form]
  )

  const handleChange = useCallback(
    (field: keyof FormState, value: string) => {
      setForm(f => ({ ...f, [field]: value }))
      // Clear error once user starts fixing a touched field
      if (touched[field]) {
        setErrors(e => ({ ...e, [field]: undefined }))
      }
    },
    [touched]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      // Touch all fields
      setTouched({ email: true, password: true })
      const errs = validate(form)
      setErrors(errs)
      if (Object.keys(errs).length) return

      setSubmitting(true)
      try {
        await login(form.email, form.password)
        navigate(from, { replace: true })
      } finally {
        setSubmitting(false)
      }
    },
    [form, login, navigate, from]
  )

  const fillDemo = useCallback(() => {
    setForm(DEMO)
    setErrors({})
    setTouched({})
  }, [])

  const isLoading = submitting || authLoading

  // Don't flash login page if already authed
  if (user) return null

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50
                    via-indigo-50/30 to-slate-100
                    flex items-center justify-center p-4"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                        bg-indigo-100/40 blur-3xl"
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full
                        bg-sky-100/40 blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* ── Card ─────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/60
                        border border-slate-100 overflow-hidden"
        >
          {/* Top accent bar */}
          <div
            className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500
                          to-sky-500"
          />

          <div className="px-8 pt-8 pb-10">
            {/* ── Logo ─────────────────────────────────────── */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="h-12 w-12 rounded-xl bg-indigo-600
                              flex items-center justify-center
                              shadow-lg shadow-indigo-200 mb-4"
              >
                <HeartIcon />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">HealthOS</h1>
              <p className="text-sm text-slate-400 mt-1">Clinical Management Platform</p>
            </div>

            {/* ── Form ─────────────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <Input
                label="Email address"
                type="email"
                placeholder="you@hospital.com"
                autoComplete="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                fullWidth
                disabled={isLoading}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password ? errors.password : undefined}
                  fullWidth
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[34px] text-slate-400
                             hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Firebase error banner */}
              {authError && (
                <div
                  className={clsx(
                    'flex items-start gap-2.5 px-4 py-3 rounded-lg',
                    'bg-red-50 border border-red-100 text-red-700 text-sm'
                  )}
                >
                  <ErrorIcon className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            {/* ── Divider ──────────────────────────────────── */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* ── Demo credentials ──────────────────────────── */}
            <button
              type="button"
              onClick={fillDemo}
              disabled={isLoading}
              className={clsx(
                'w-full flex items-center justify-center gap-2',
                'px-4 py-2.5 rounded-xl border border-dashed border-slate-200',
                'text-sm text-slate-500 font-medium',
                'hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <DemoIcon />
              Use demo credentials
            </button>

            {/* Demo hint */}
            <p className="text-center text-xs text-slate-300 mt-3">
              {DEMO.email} · {DEMO.password}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} HealthOS · Clinical Platform
        </p>
      </div>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────
const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="white" className="w-6 h-6">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4
         4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0
         010-5.656z"
    />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943
         9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732
         14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75
         0 101.06-1.06l-1.745-1.745a10.029 10.029 0
         003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004
         0 009.999 3a9.956 9.956 0 00-4.744
         1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5
         0 013.374 3.373l1.091 1.092a4 4 0
         00-5.557-5.557z"
    />
    <path
      d="M10.748 13.93l2.523 2.523a10.003 10.003 0
             01-8.29-4.84 1.651 1.651 0
             010-1.185A10.003 10.003 0 0110 4.5a9.958
             9.958 0 012.122.228l-4.122 4.122A4 4 0
             0010 13.5c.26 0 .514-.025.748-.07z"
    />
  </svg>
)

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.25a.75.75
         0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6.25a.875.875
         0 110-1.75.875.875 0 010 1.75z"
    />
  </svg>
)

const DemoIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5
         0v-1.5A.75.75 0 018 1zm0 11a.75.75 0 01.75.75v1.5a.75.75
         0 01-1.5 0v-1.5A.75.75 0 018 12zm4.95-8.536a.75.75
         0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75
         0 011.061 0zm-9.9 9.9a.75.75 0 010 1.06l-1.06
         1.061a.75.75 0 01-1.061-1.06l1.06-1.061a.75.75
         0 011.061 0zM15 8a.75.75 0 01-.75.75h-1.5a.75.75
         0 010-1.5h1.5A.75.75 0 0115 8zM4 8a.75.75 0
         01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 014
         8zm9.536 4.95a.75.75 0 01-1.061 0l-1.06-1.06a.75.75
         0 111.06-1.061l1.061 1.06a.75.75 0 010 1.061zm-9.9-9.9a.75.75
         0 01-1.061 0L1.514 2.05A.75.75 0 012.575.99l1.06
         1.06a.75.75 0 010 1.061z"
    />
  </svg>
)
