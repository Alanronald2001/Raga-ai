import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { signIn, signUp as firebaseSignUp, signOut, subscribeToAuthState, getIdToken } from '../services/auth'
import type { User, BridgeMessage } from '@raga/shared-types'

// ── Inline helper (needs React ref, so lives here not in shared-types) ──
function postToMFE(ref: React.RefObject<HTMLIFrameElement>, msg: BridgeMessage) {
  ref.current?.contentWindow?.postMessage(msg, '*')
}

// ── Types ────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// ── Context ──────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode
  mfeRefs?: React.RefObject<HTMLIFrameElement>[]
}

export function AuthProvider({ children, mfeRefs = [] }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mfeRefsRef = useRef(mfeRefs)
  useEffect(() => {
    mfeRefsRef.current = mfeRefs
  }, [mfeRefs])

  const broadcastAuth = useCallback(async (u: User | null) => {
    if (!u) {
      mfeRefsRef.current.forEach(ref => postToMFE(ref, { type: 'AUTH_SIGNED_OUT' }))
      return
    }
    const token = await getIdToken()
    if (!token) return
    mfeRefsRef.current.forEach(ref =>
      postToMFE(ref, {
        type: 'AUTH_TOKEN_READY',
        payload: { token, user: u },
      })
    )
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async u => {
      setUser(u)
      setLoading(false)
      setError(null)
      await broadcastAuth(u)
    })
    return unsubscribe
  }, [broadcastAuth])

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      if (event.data?.type === 'MFE_READY') {
        await broadcastAuth(user)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [user, broadcastAuth])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(friendlyError(msg))
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await firebaseSignUp(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed'
      setError(friendlyError(msg))
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await signOut()
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ── Helpers ──────────────────────────────────────────────────────
function friendlyError(msg: string): string {
  if (msg.includes('user-not-found')) return 'No account found with this email.'
  if (msg.includes('wrong-password')) return 'Incorrect password.'
  if (msg.includes('too-many-requests')) return 'Too many attempts. Try again later.'
  if (msg.includes('invalid-email')) return 'Invalid email address.'
  return 'Something went wrong. Please try again.'
}
