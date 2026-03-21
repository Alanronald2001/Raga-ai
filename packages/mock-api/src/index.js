import delay from './delay';
import { patients } from "./data/patient";
import { analyticsData } from './data/analytics';
import { kpiCards, recentAppointments, activityFeed } from './data/dashboard';
export async function getPatients() {
    await delay();
    return patients;
}
export async function getPatientById(id) {
    await delay(200);
    return patients.find(p => p.id === id);
}
export async function getAnalytics() {
    await delay(600);
    return analyticsData;
}
export async function getDashboardKPIs() {
    await delay(300);
    return kpiCards;
}
export async function getAppointments() {
    await delay(400);
    return recentAppointments;
}
export async function getActivityFeed() {
    await delay(250);
    return activityFeed;
}
