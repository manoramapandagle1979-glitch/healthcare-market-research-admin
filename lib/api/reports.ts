import { apiClient } from './client';
import type {
  ReportsResponse,
  ReportFilters,
  ReportResponse,
  ReportFormData,
} from '@/lib/types/reports';
import {
  fetchReportsMock,
  fetchReportByIdMock,
  createReportMock,
  updateReportMock,
  deleteReportMock,
} from './reports.mock';

export async function fetchReports(filters?: ReportFilters): Promise<ReportsResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchReportsMock(filters);
  }
  return apiClient.get<ReportsResponse>('/reports', {
    params: filters as Record<string, unknown>,
  });
}

export async function fetchReportById(id: string): Promise<ReportResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchReportByIdMock(id);
  }
  return apiClient.get<ReportResponse>(`/reports/${id}`);
}

export async function createReport(data: ReportFormData): Promise<ReportResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return createReportMock(data);
  }
  return apiClient.post<ReportResponse>('/reports', data);
}

export async function updateReport(
  id: string,
  data: Partial<ReportFormData>
): Promise<ReportResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return updateReportMock(id, data);
  }
  return apiClient.put<ReportResponse>(`/reports/${id}`, data);
}

export async function deleteReport(id: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return deleteReportMock(id);
  }
  return apiClient.delete(`/reports/${id}`);
}
