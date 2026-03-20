// ── Types ─────────────────────────────────────────────────────────
export type PermissionResult = 'granted' | 'denied' | 'default'

export interface LocalNotificationOptions {
  icon?: string
  badge?: string
  tag?: string
  patientId?: string
  type?: 'alert' | 'info' | 'success' | 'warning'
  url?: string
}

// ── Mock push payloads for simulation ─────────────────────────────
const MOCK_NOTIFICATIONS = [
  {
    title: 'Critical Alert',
    body: 'Suresh Iyer — BP spike detected in CCU. Immediate review required.',
    type: 'alert' as const,
    patientId: 'p009',
    url: '/patients/p009',
  },
  {
    title: 'Lab Results Ready',
    body: 'Nandini Das — CBC panel results are now available.',
    type: 'info' as const,
    patientId: 'p014',
    url: '/patients/p014',
  },
  {
    title: 'Appointment Reminder',
    body: 'Priya Nair has an OB appointment in 15 minutes.',
    type: 'warning' as const,
    patientId: 'p002',
    url: '/patients/p002',
  },
  {
    title: 'Discharge Cleared',
    body: 'Amit Joshi has been cleared for discharge from General Surgery.',
    type: 'success' as const,
    patientId: 'p013',
    url: '/patients/p013',
  },
  {
    title: 'Vitals Warning',
    body: 'Gopal Pillai — oxygen saturation dropped to 91%. Check immediately.',
    type: 'alert' as const,
    patientId: 'p017',
    url: '/patients/p017',
  },
  {
    title: 'New Admission',
    body: 'Mohan Lal admitted to Oncology Ward 4B — paperwork pending.',
    type: 'info' as const,
    patientId: 'p025',
    url: '/patients/p025',
  },
  {
    title: 'Medication Due',
    body: 'Meena Krishnan — Metformin dose due in 30 minutes.',
    type: 'warning' as const,
    patientId: 'p006',
    url: '/patients/p006',
  },
  {
    title: 'INR Result',
    body: 'Rajendra Prasad — INR 2.4, within therapeutic range.',
    type: 'success' as const,
    patientId: 'p029',
    url: '/patients/p029',
  },
]

// ── State ─────────────────────────────────────────────────────────
let simulationInterval: ReturnType<typeof setInterval> | null = null

// ── requestPermission ─────────────────────────────────────────────
export async function requestPermission(): Promise<PermissionResult> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this environment')
    return 'denied'
  }
  if (Notification.permission === 'granted') return 'granted'
  const result = await Notification.requestPermission()
  return result
}

// ── showLocalNotification ─────────────────────────────────────────
export function showLocalNotification(
  title: string,
  body: string,
  options: LocalNotificationOptions = {}
): void {
  if (Notification.permission !== 'granted') {
    console.warn('showLocalNotification: permission not granted')
    return
  }

  const notif = new Notification(title, {
    body,
    icon: options.icon ?? '/icons/pwa-192x192.png',
    badge: options.badge ?? '/icons/pwa-192x192.png',
    tag: (options.tag ?? options.patientId) ? `patient-${options.patientId}` : 'healthos-general',
    data: {
      url: options.url ?? '/',
      patientId: options.patientId ?? null,
      type: options.type ?? 'info',
    },
  })

  notif.onclick = () => {
    window.focus()
    notif.close()
    if (options.url) window.history.pushState({}, '', options.url)
  }
}

// ── sendToServiceWorker ───────────────────────────────────────────
async function sendToServiceWorker(payload: object): Promise<void> {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready
  if (!registration.active) return

  // Simulate a push event by posting directly to the SW
  registration.active.postMessage({
    type: '__SIMULATE_PUSH__',
    payload,
  })
}

// ── simulatePush ──────────────────────────────────────────────────
export function simulatePush(intervalMs = 30_000): void {
  if (simulationInterval !== null) return // already running

  // Fire one immediately so you don't wait 30s on first load
  fireRandomNotification()

  simulationInterval = setInterval(fireRandomNotification, intervalMs)
  console.info(`[NotificationService] Push simulation started — every ${intervalMs / 1000}s`)
}

function fireRandomNotification(): void {
  const pick = MOCK_NOTIFICATIONS[Math.floor(Math.random() * MOCK_NOTIFICATIONS.length)]

  // Try SW first (shows as native push), fall back to local notification
  sendToServiceWorker(pick).catch(() => {
    showLocalNotification(pick.title, pick.body, {
      type: pick.type,
      patientId: pick.patientId,
      url: pick.url,
    })
  })

  // Also post to local notification as immediate fallback
  if (Notification.permission === 'granted') {
    showLocalNotification(pick.title, pick.body, {
      type: pick.type,
      patientId: pick.patientId,
      url: pick.url,
    })
  }
}

// ── stopSimulation ────────────────────────────────────────────────
export function stopSimulation(): void {
  if (simulationInterval === null) return
  clearInterval(simulationInterval)
  simulationInterval = null
  console.info('[NotificationService] Push simulation stopped')
}

// ── isSimulating ──────────────────────────────────────────────────
export function isSimulating(): boolean {
  return simulationInterval !== null
}
