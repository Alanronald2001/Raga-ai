import delay from './delay'
import { patients } from "./data/patient"
import { analyticsData } from './data/analytics'
import { kpiCards, recentAppointments, activityFeed } from './data/dashboard'
import type { Patient, Appointment, KPICard, AnalyticsData } from '@raga/shared-types'
import type { ActivityItem } from './data/dashboard'

export async function getPatients(): Promise<Patient[]> {
  await delay()
  return patients
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  await delay(200)
  return patients.find(p => p.id === id)
}

export async function getAnalytics(): Promise<AnalyticsData> {
  await delay(600)
  return analyticsData
}

export async function getDashboardKPIs(): Promise<KPICard[]> {
  await delay(300)
  return kpiCards
}

export async function getAppointments(): Promise<Appointment[]> {
  await delay(400)
  return recentAppointments
}

export async function getActivityFeed(): Promise<ActivityItem[]> {
  await delay(250)
  return activityFeed
}

// re-export types consumers might need
export type { ActivityItem }
