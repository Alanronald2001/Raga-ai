// ── Enums / Unions ──────────────────────────────────────────────
export type ViewMode = 'list' | 'grid'

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending'

export type PatientStatus = 'active' | 'discharged' | 'critical' | 'stable'

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist'

// ── Core Entities ───────────────────────────────────────────────
export interface User {
  uid: string
  email: string
  displayName: string
  role: UserRole
  avatar?: string
}

export interface Vitals {
  bloodPressure: string
  heartRate: number
  temperature: number
  oxygenSaturation: number
  weight: number
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  status: PatientStatus
  department: string
  bloodGroup: string
  phone: string
  email: string
  address: string
  lastVisit: string // ISO date string
  nextAppointment?: string // ISO date string
  vitals: Vitals
  notes?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string // ISO date string
  time: string // "HH:mm"
  status: AppointmentStatus
  type: 'in-person' | 'virtual' | 'follow-up' | 'emergency'
}

// ── Analytics ───────────────────────────────────────────────────
export interface AdmissionPoint {
  month: string
  admissions: number
  discharges: number
}

export interface DepartmentBreakdown {
  department: string
  count: number
  percentage: number
}

export interface DiagnosisCategory {
  category: string
  count: number
}

export interface RevenuePoint {
  month: string
  revenue: number
  expenses: number
}

export interface AnalyticsData {
  admissionsTrend: AdmissionPoint[]
  departmentBreakdown: DepartmentBreakdown[]
  diagnosisCategories: DiagnosisCategory[]
  revenueData: RevenuePoint[]
}

// ── UI ──────────────────────────────────────────────────────────
export interface KPICard {
  title: string
  value: string | number
  delta: number
  deltaType: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: string
}

export type NotificationType = 'alert' | 'info' | 'success' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  timestamp: string // ISO date string
  patientId?: string
}

// ── Bridge (re-exported from bridge.ts) ─────────────────────────
export type { BridgeMessage, BridgeEventType } from './bridge'
