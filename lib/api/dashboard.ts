import { apiClient } from './client';
import type { DashboardStats, ActivityResponse } from '@/lib/types/dashboard';
import { fetchDashboardStatsMock, fetchRecentActivityMock } from './dashboard.mock';

/**
 * Fetches dashboard statistics including reports, blogs, users, traffic, and leads metrics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // Use mock data if the flag is enabled
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchDashboardStatsMock();
  }

  // Otherwise, call the real API
  return apiClient.get<DashboardStats>('/dashboard/stats');
}

/**
 * Fetches recent activity feed
 * @param limit - Number of activities to fetch (default: 10)
 */
export async function fetchRecentActivity(limit: number = 10): Promise<ActivityResponse> {
  // Use mock data if the flag is enabled
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchRecentActivityMock(limit);
  }

  // Otherwise, call the real API
  return apiClient.get<ActivityResponse>(`/dashboard/activity?limit=${limit}`);
}
