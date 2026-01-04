import { apiClient } from './client';
import type { DashboardStats, ActivityResponse } from '@/lib/types/dashboard';

/**
 * Fetches dashboard statistics including reports, blogs, users, traffic, and leads metrics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/dashboard/stats');
}

/**
 * Fetches recent activity feed
 * @param limit - Number of activities to fetch (default: 10)
 */
export async function fetchRecentActivity(limit: number = 10): Promise<ActivityResponse> {
  return apiClient.get<ActivityResponse>(`/dashboard/activity?limit=${limit}`);
}
