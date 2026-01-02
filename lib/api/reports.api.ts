/**
 * Reports API Service
 * Aligned with swagger specification
 */

import { apiClient } from './client';
import type {
  ApiReport,
  ApiReportFilters,
  ApiReportsListResponse,
  ApiReportDetailResponse,
  ApiResponse,
  ApiMeta,
} from '@/lib/types/api-types';

// ============ Reports Endpoints ============

/**
 * GET /api/v1/reports
 * Get all reports with optional filters
 */
export async function fetchReports(filters?: ApiReportFilters): Promise<ApiReportsListResponse> {
  return apiClient.get<ApiReportsListResponse>('/v1/reports', {
    params: filters as Record<string, unknown>,
    requiresAuth: false, // Public endpoint according to swagger
  });
}

/**
 * GET /api/v1/reports/{slug}
 * Get report by slug with relations
 */
export async function fetchReportBySlug(slug: string): Promise<ApiReportDetailResponse> {
  return apiClient.get<ApiReportDetailResponse>(`/v1/reports/${slug}`, {
    requiresAuth: false, // Public endpoint
  });
}

/**
 * POST /api/v1/reports
 * Create a new report (requires authentication)
 */
export async function createReport(data: Partial<ApiReport>): Promise<ApiReportDetailResponse> {
  return apiClient.post<ApiReportDetailResponse>('/v1/reports', data, {
    requiresAuth: true,
  });
}

/**
 * PUT /api/v1/reports/{id}
 * Update an existing report (requires authentication)
 */
export async function updateReport(
  id: number,
  data: Partial<ApiReport>
): Promise<ApiReportDetailResponse> {
  return apiClient.put<ApiReportDetailResponse>(`/v1/reports/${id}`, data, {
    requiresAuth: true,
  });
}

/**
 * DELETE /api/v1/reports/{id}
 * Delete a report (requires authentication)
 */
export async function deleteReport(id: number): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<ApiResponse<{ message: string }>>(`/v1/reports/${id}`, {
    requiresAuth: true,
  });
}

// ============ Search Endpoint ============

/**
 * GET /api/v1/search
 * Search for reports by query text
 */
export async function searchReports(
  query: string,
  options?: { page?: number; limit?: number }
): Promise<ApiReportsListResponse> {
  return apiClient.get<ApiReportsListResponse>('/v1/search', {
    params: {
      q: query,
      page: options?.page,
      limit: options?.limit,
    },
    requiresAuth: false,
  });
}

// ============ Category-specific Reports ============

/**
 * GET /api/v1/categories/{slug}/reports
 * Get reports by category slug
 */
export async function fetchReportsByCategory(
  categorySlug: string,
  options?: { page?: number; limit?: number }
): Promise<ApiReportsListResponse> {
  return apiClient.get<ApiReportsListResponse>(`/v1/categories/${categorySlug}/reports`, {
    params: options,
    requiresAuth: false,
  });
}

// ============ Helper Functions ============

/**
 * Extract data from API response or throw error
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (!response.success || !response.data) {
    throw new Error(response.error || 'API request failed');
  }
  return response.data;
}

/**
 * Extract list data with metadata
 */
export function extractListData<T>(response: ApiResponse<T[]> & { meta?: ApiMeta }): {
  data: T[];
  meta: ApiMeta;
} {
  if (!response.success || !response.data) {
    throw new Error(response.error || 'API request failed');
  }
  return {
    data: response.data,
    meta: response.meta || {},
  };
}
