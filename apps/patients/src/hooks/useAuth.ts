import { useState, useEffect } from 'react'
import { onBridgeMessage } from '@raga/shared-types'
import type { User } from '@raga/shared-types'

interface BridgeAuthState {
  user: User | null
  token: string | null
  isAuthed: boolean
}

export function useAuth(): BridgeAuthState {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onBridgeMessage(msg => {
      if (msg.type === 'AUTH_TOKEN_READY') {
        setUser(msg.payload.user)
        setToken(msg.payload.token)
      }
      if (msg.type === 'AUTH_SIGNED_OUT') {
        setUser(null)
        setToken(null)
      }
    })

    // Signal shell that this MFE is ready
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'MFE_READY' }, '*')
    }

    return unsubscribe
  }, [])

  return { user, token, isAuthed: !!user }
}
