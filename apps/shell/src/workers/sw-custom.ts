/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope & { __WB_MANIFEST: any }

// Precache manifest injection point
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const manifest = self.__WB_MANIFEST

// ── Constants ─────────────────────────────────────────────────────
const CACHE_NAME = 'healthos-shell-v2'
const OFFLINE_URL = '/offline.html'
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
]

// ── Install: precache shell assets ────────────────────────────────
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Add each asset individually so one missing file doesn't abort the install
      await Promise.allSettled(SHELL_ASSETS.map(url => cache.add(url).catch(() => {})))
      await sw.skipWaiting()
    })
  )
})

// ── Activate: clean up old caches ─────────────────────────────────
sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
      )
      .then(() => sw.clients.claim()) // take control of all tabs
  )
})

// ── Fetch: network-first with offline fallback ────────────────────
sw.addEventListener('fetch', (event: FetchEvent) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Skip cross-origin requests (Firebase, CDNs — handled by Workbox)
  if (url.origin !== sw.location.origin) return

  // Skip Vite internal HMR / dev-server requests so they're never intercepted
  if (url.pathname.startsWith('/@vite/') || url.pathname.startsWith('/@fs/') || url.pathname.startsWith('/__vite')) return

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache successful responses
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(async () => {
        // Network failed — try cache
        const cached = await caches.match(event.request)
        if (cached) return cached

        // For navigate requests show offline page
        if (event.request.mode === 'navigate') {
          const offline = await caches.match(OFFLINE_URL)
          if (offline) return offline
        }

        // Last resort: empty 503
        return new Response('Service unavailable', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        })
      })
  )
})

// ── Push: show notification ───────────────────────────────────────
interface PushPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  patientId?: string
  type?: 'alert' | 'info' | 'success' | 'warning'
  url?: string
}

sw.addEventListener('push', (event: PushEvent) => {
  let payload: PushPayload = {
    title: 'HealthOS',
    body: 'You have a new notification.',
  }

  if (event.data) {
    try {
      payload = event.data.json() as PushPayload
    } catch {
      payload.body = event.data.text()
    }
  }

  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon ?? '/icons/pwa-192x192.png',
    badge: payload.badge ?? '/icons/pwa-192x192.png',
    tag: payload.patientId ? `patient-${payload.patientId}` : 'healthos-general',
    renotify: true,
    data: {
      url: payload.url ?? '/',
      patientId: payload.patientId,
      type: payload.type ?? 'info',
    },
    actions: buildActions(payload),
  }

  event.waitUntil(sw.registration.showNotification(payload.title, options))
})

function buildActions(payload: PushPayload): NotificationAction[] {
  if (payload.type === 'alert' && payload.patientId) {
    return [
      { action: 'view-patient', title: '👤 View Patient' },
      { action: 'dismiss', title: '✕ Dismiss' },
    ]
  }
  if (payload.type === 'warning') {
    return [
      { action: 'view', title: '👁 View' },
      { action: 'dismiss', title: '✕ Dismiss' },
    ]
  }
  return [
    { action: 'open', title: '↗ Open' },
    { action: 'dismiss', title: '✕ Dismiss' },
  ]
}

// ── Notification click ────────────────────────────────────────────
sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  const { action } = event
  const { url, patientId } = event.notification.data as {
    url: string
    patientId?: string
  }

  if (action === 'dismiss') return

  // Resolve target URL based on action + data
  let targetUrl = url
  if ((action === 'view-patient' || action === 'view') && patientId) {
    targetUrl = `/patients/${patientId}`
  }

  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If a shell window is already open, focus and navigate it
      for (const client of clientList) {
        if (client.url.includes(sw.location.origin) && 'focus' in client) {
          client.focus()
          client.postMessage({
            type: 'NAVIGATE',
            payload: { path: targetUrl },
          })
          return
        }
      }
      // No window open — open a new one
      return sw.clients.openWindow(targetUrl)
    })
  )
})

// Add inside the existing fetch listener, or as a new message listener
sw.addEventListener('message', (event: ExtendableMessageEvent) => {
  console.log('[SW] Received message:', event.data?.type);
  if (event.data?.type !== '__SIMULATE_PUSH__') return

  const payload = event.data.payload
  console.log('[SW] Simulating push for:', payload.title);
  const options: NotificationOptions = {
    body: payload.body,
    icon: '/icons/pwa-192x192.png',
  }

  event.waitUntil(sw.registration.showNotification(payload.title, options))
})
