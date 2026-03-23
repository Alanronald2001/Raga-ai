import { useEffect, useRef, useCallback, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import { getIdToken } from '../services/auth'
import type { BridgeMessage } from '@raga/shared-types'

// ── Env origins ───────────────────────────────────────────────────
import { MFE_ORIGINS, ALLOWED_MFE_ORIGINS } from '../config/mfe'

const PATIENTS_ORIGIN = MFE_ORIGINS.PATIENTS
const ANALYTICS_ORIGIN = MFE_ORIGINS.ANALYTICS

const ALLOWED_ORIGINS = ALLOWED_MFE_ORIGINS

// ── Helper ────────────────────────────────────────────────────────
function postTo(ref: RefObject<HTMLIFrameElement | null>, msg: BridgeMessage, origin: string) {
  ref.current?.contentWindow?.postMessage(msg, origin)
}

// ── Hook ──────────────────────────────────────────────────────────
export interface UseMFEBridgeOptions {
  patientsRef: RefObject<HTMLIFrameElement | null>
  analyticsRef: RefObject<HTMLIFrameElement | null>
}

export interface UseMFEBridgeReturn {
  postToPatients: (msg: BridgeMessage) => void
  postToAnalytics: (msg: BridgeMessage) => void
  broadcastAuth: () => Promise<void>
  broadcastSignOut: () => void
}

export function useMFEBridge({
  patientsRef,
  analyticsRef,
}: UseMFEBridgeOptions): UseMFEBridgeReturn {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const { user } = useAuth()

  // Keep latest user in ref so handler closure is always fresh
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  // ── Typed post helpers ─────────────────────────────────────────
  const postToPatients = useCallback(
    (msg: BridgeMessage) => {
      postTo(patientsRef, msg, PATIENTS_ORIGIN)
    },
    [patientsRef]
  )

  const postToAnalytics = useCallback(
    (msg: BridgeMessage) => {
      postTo(analyticsRef, msg, ANALYTICS_ORIGIN)
    },
    [analyticsRef]
  )

  // ── Build and send AUTH_TOKEN_READY ────────────────────────────
  const broadcastAuth = useCallback(async () => {
    const u = userRef.current
    if (!u) return
    try {
      const token = await getIdToken()
      if (!token) return
      const msg: BridgeMessage = {
        type: 'AUTH_TOKEN_READY',
        payload: { token, user: u },
      }
      postTo(patientsRef, msg, PATIENTS_ORIGIN)
      postTo(analyticsRef, msg, ANALYTICS_ORIGIN)
    } catch (err) {
      console.error('[useMFEBridge] broadcastAuth failed:', err)
    }
  }, [patientsRef, analyticsRef])

  // ── Broadcast signed out ───────────────────────────────────────
  const broadcastSignOut = useCallback(() => {
    const msg: BridgeMessage = { type: 'AUTH_SIGNED_OUT' }
    postTo(patientsRef, msg, PATIENTS_ORIGIN)
    postTo(analyticsRef, msg, ANALYTICS_ORIGIN)
  }, [patientsRef, analyticsRef])

  // ── Central message handler ────────────────────────────────────
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      // ① Origin gate — only trust known MFE origins
      if (!ALLOWED_ORIGINS.has(event.origin)) return

      const msg = event.data as BridgeMessage
      if (!msg?.type) return

      const isMFEPatients = event.origin === PATIENTS_ORIGIN
      const isMFEAnalytics = event.origin === ANALYTICS_ORIGIN

      switch (msg.type) {
        // MFE finished loading — send auth immediately
        case 'MFE_READY': {
          console.debug(`[MFEBridge] MFE_READY from ${isMFEPatients ? 'patients' : 'analytics'}`)
          await broadcastAuth()
          break
        }

        // MFE requesting top-level navigation
        case 'NAVIGATE': {
          const { path } = msg.payload
          console.debug(`[MFEBridge] NAVIGATE → ${path}`)
          navigate(path)
          break
        }

        // MFE pushing a notification
        case 'NOTIFICATION_PUSH': {
          const n = msg.payload
          console.debug(`[MFEBridge] NOTIFICATION_PUSH — ${n.title}`)
          addNotification({
            type: n.type,
            title: n.title,
            message: n.message,
            patientId: n.patientId,
          })
          break
        }

        default:
          break
      }

      // Suppress unused-variable warnings in strict TS
      void isMFEAnalytics
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [broadcastAuth, navigate, addNotification])

  // ── Re-broadcast whenever auth state changes ───────────────────
  useEffect(() => {
    if (user) {
      broadcastAuth()
    } else {
      broadcastSignOut()
    }
  }, [user, broadcastAuth, broadcastSignOut])

  return {
    postToPatients,
    postToAnalytics,
    broadcastAuth,
    broadcastSignOut,
  }
}
