/**
 * Reports API Wrapper
 * Provides backward compatibility with existing components
 * while using the new swagger-aligned API
 */

import type {
  ReportsResponse,
  ReportFilters,
  ReportResponse,
  ReportFormData,
  Report,
  ReportFormat,
} from '@/lib/types/reports';
import {
  fetchReportsMock,
  fetchReportByIdMock,
  createReportMock,
  updateReportMock,
  deleteReportMock,
} from './reports.mock';
import * as reportsApi from './reports.api';
import type { ApiReport, ApiReportFilters } from '@/lib/types/api-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// ============ Helper: Convert API types to Legacy types ============
function convertApiReportToLegacy(apiReport: ApiReport): Report {
  return {
    id: String(apiReport.id),
    title: apiReport.title,
    slug: apiReport.slug,
    summary: apiReport.summary || '',
    category: String(apiReport.category_id || ''),
    geography: apiReport.geography || [],
    publishDate: apiReport.publish_date,
    price: apiReport.price || 0,
    discountedPrice: apiReport.discounted_price || 0,
    accessType: apiReport.access_type || 'paid',
    status: apiReport.status,
    pageCount: apiReport.page_count,
    formats: apiReport.formats as ReportFormat[],
    marketMetrics: apiReport.market_metrics,
    authorIds: apiReport.author_ids?.map(String),
    keyPlayers: apiReport.key_players,
    sections: {
      executiveSummary: apiReport.sections?.executiveSummary || '',
      marketOverview: apiReport.sections?.marketOverview || '',
      marketSize: apiReport.sections?.marketSize || '',
      competitive: apiReport.sections?.competitive || '',
      keyPlayers: apiReport.sections?.keyPlayers || '',
      regional: apiReport.sections?.regional || '',
      trends: apiReport.sections?.trends || '',
      conclusion: apiReport.sections?.conclusion || '',
      marketDetails: apiReport.sections?.marketDetails || '',
      keyFindings: apiReport.sections?.keyFindings || '',
      tableOfContents: apiReport.sections?.tableOfContents || '',
    },
    faqs: apiReport.faqs,
    metadata: apiReport.metadata || {},
    versions: [],
    createdAt: apiReport.created_at,
    updatedAt: apiReport.updated_at,
    author: { id: '', email: '', name: '' },
  };
}

function convertLegacyFiltersToApi(filters?: ReportFilters): ApiReportFilters {
  if (!filters) return {};

  return {
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
    category: filters.category,
    geography: filters.geography,
    accessType: filters.accessType,
    search: filters.search,
  };
}

// ============ Public API Functions (Legacy Compatible) ============

export async function fetchReports(filters?: ReportFilters): Promise<ReportsResponse> {
  if (USE_MOCK_DATA) {
    return fetchReportsMock(filters);
  }

  const apiFilters = convertLegacyFiltersToApi(filters);
  const response = await reportsApi.fetchReports(apiFilters);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch reports');
  }

  return {
    reports: response.data.map(convertApiReportToLegacy),
    total: response.meta?.total || 0,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || 10,
    totalPages: response.meta?.total_pages || 0,
  };
}

export async function fetchReportById(id: string): Promise<ReportResponse> {
  if (USE_MOCK_DATA) {
    return fetchReportByIdMock(id);
  }

  // Treat id as slug for now (API uses slugs)
  const response = await reportsApi.fetchReportBySlug(id);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch report');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function createReport(data: ReportFormData): Promise<ReportResponse> {
  if (USE_MOCK_DATA) {
    return createReportMock(data);
  }

  // Convert form data to API format
  const apiData: Partial<ApiReport> = {
    title: data.title,
    summary: data.summary,
    category_id: Number(data.category),
    geography: data.geography,
    publish_date: data.publishDate,
    price: data.price,
    discounted_price: data.discountedPrice,
    access_type: data.accessType,
    status: data.status,
    page_count: data.pageCount,
    formats: data.formats,
    market_metrics: data.marketMetrics,
    author_ids: data.authorIds?.map(Number),
    key_players: data.keyPlayers,
    sections: data.sections,
    faqs: data.faqs,
    metadata: data.metadata,
  };

  const response = await reportsApi.createReport(apiData);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to create report');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function updateReport(
  id: string,
  data: Partial<ReportFormData>
): Promise<ReportResponse> {
  if (USE_MOCK_DATA) {
    return updateReportMock(id, data);
  }

  // Convert form data to API format
  const apiData: Partial<ApiReport> = {};
  if (data.title) apiData.title = data.title;
  if (data.summary) apiData.summary = data.summary;
  if (data.category) apiData.category_id = Number(data.category);
  if (data.geography) apiData.geography = data.geography;
  if (data.publishDate !== undefined) apiData.publish_date = data.publishDate;
  if (data.price !== undefined) apiData.price = data.price;
  if (data.discountedPrice !== undefined) apiData.discounted_price = data.discountedPrice;
  if (data.accessType) apiData.access_type = data.accessType;
  if (data.status) apiData.status = data.status;
  if (data.pageCount !== undefined) apiData.page_count = data.pageCount;
  if (data.formats) apiData.formats = data.formats;
  if (data.marketMetrics) apiData.market_metrics = data.marketMetrics;
  if (data.authorIds) apiData.author_ids = data.authorIds.map(Number);
  if (data.keyPlayers) apiData.key_players = data.keyPlayers;
  if (data.sections) apiData.sections = data.sections;
  if (data.faqs) apiData.faqs = data.faqs;
  if (data.metadata) apiData.metadata = data.metadata;

  const response = await reportsApi.updateReport(Number(id), apiData);

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to update report');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function deleteReport(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    return deleteReportMock(id);
  }

  const response = await reportsApi.deleteReport(Number(id));

  if (!response.success) {
    throw new Error(response.error || 'Failed to delete report');
  }
}
