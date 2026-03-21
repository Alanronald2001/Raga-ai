import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input } from '@raga/shared-ui'
import clsx from 'clsx'

// ── Types ─────────────────────────────────────────────────────────
interface FormState {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

// ── Validation ────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!fields.email) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(fields.email)) errors.email = 'Enter a valid email address.'
  
  if (!fields.password) errors.password = 'Password is required.'
  else if (fields.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  
  if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }
  
  return errors
}

// ── Component ─────────────────────────────────────────────────────
export default function SignupPage() {
  const { user, loading: authLoading, error: authError, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/'

  // Redirect if already authed
  useEffect(() => {
    if (user && !authLoading) navigate(from, { replace: true })
  }, [user, authLoading, navigate, from])

  const [form, setForm] = useState<FormState>({ email: '', password: '', confirmPassword: '' })
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
      if (touched[field]) {
        setErrors(e => ({ ...e, [field]: undefined }))
      }
    },
    [touched]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setTouched({ email: true, password: true, confirmPassword: true })
      const errs = validate(form)
      setErrors(errs)
      if (Object.keys(errs).length) return

      setSubmitting(true)
      try {
        await signUp(form.email, form.password)
        navigate(from, { replace: true })
      } finally {
        setSubmitting(false)
      }
    },
    [form, signUp, navigate, from]
  )

  const isLoading = submitting || authLoading

  if (user) return null

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50
                    via-indigo-50/30 to-slate-100
                    flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />

          <div className="px-8 pt-8 pb-10">
            <div className="flex flex-col items-center mb-10">
              <div
                className="h-14 w-14 rounded-2xl bg-indigo-600
                               flex items-center justify-center
                               shadow-xl shadow-indigo-200/50 mb-5
                               hover:scale-105 transition-transform duration-200"
              >
                <HeartIcon />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create Account</h1>
              <p className="text-sm text-slate-400 font-medium mt-1">Join HealthOS Clinical Platform</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@hospital.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                fullWidth
                disabled={isLoading}
                rightSection={
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="p-1 px-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
                fullWidth
                disabled={isLoading}
              />

              {authError && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                  <ErrorIcon className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="white" className="w-6 h-6">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" />
    <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 01-8.29-4.84 1.651 1.651 0 010-1.185A10.003 10.003 0 0110 4.5a9.958 9.958 0 012.122.228l-4.122 4.122A4 4 0 0010 13.5c.26 0 .514-.025.748-.07z" />
  </svg>
)

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.25a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zm.75 6.25a.875.875 0 110-1.75.875.875 0 010 1.75z" />
  </svg>
)
