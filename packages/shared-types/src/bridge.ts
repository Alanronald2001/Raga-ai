import React from 'react'
import type { User, Notification } from './index'

// ── Event Types ─────────────────────────────────────────────────
export type BridgeEventType =
  | 'AUTH_TOKEN_READY'
  | 'AUTH_SIGNED_OUT'
  | 'NAVIGATE'
  | 'NOTIFICATION_PUSH'
  | 'MFE_READY'

// ── Typed Payloads ──────────────────────────────────────────────
interface AuthTokenReadyMessage {
  type: 'AUTH_TOKEN_READY'
  payload: { token: string; user: User }
}

interface AuthSignedOutMessage {
  type: 'AUTH_SIGNED_OUT'
  payload?: never
}

interface NavigateMessage {
  type: 'NAVIGATE'
  payload: { path: string }
}

interface NotificationPushMessage {
  type: 'NOTIFICATION_PUSH'
  payload: Notification
}

interface MFEReadyMessage {
  type: 'MFE_READY'
  payload?: never
}

// ── Discriminated Union ─────────────────────────────────────────
export type BridgeMessage =
  | AuthTokenReadyMessage
  | AuthSignedOutMessage
  | NavigateMessage
  | NotificationPushMessage
  | MFEReadyMessage

// ── Helper: MFE → Shell ─────────────────────────────────────────
export function postToShell(msg: BridgeMessage): void {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(msg, '*')
  }
}

// ── Helper: Shell → MFE ─────────────────────────────────────────
export function postToMFE(iframeRef: React.RefObject<HTMLIFrameElement>, msg: BridgeMessage): void {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage(msg, '*')
  }
}

// ── Helper: Listen for bridge messages ──────────────────────────
export function onBridgeMessage(handler: (msg: BridgeMessage) => void): () => void {
  const listener = (event: MessageEvent) => {
    if (event.data && typeof event.data.type === 'string') {
      handler(event.data as BridgeMessage)
    }
  }
  window.addEventListener('message', listener)
  return () => window.removeEventListener('message', listener)
}
