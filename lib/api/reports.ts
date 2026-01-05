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
import * as reportsApi from './reports.api';
import type { ApiReport, ApiReportFilters } from '@/lib/types/api-types';

// ============ Helper Functions ============

/**
 * Converts a date string from "YYYY-MM-DD" format to RFC3339 format expected by the backend
 * @param dateString Date string in "YYYY-MM-DD" format
 * @returns Date string in RFC3339 format "YYYY-MM-DDTHH:MM:SSZ" or undefined if input is invalid
 */
function convertDateToRFC3339(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined;

  // If already in RFC3339 format, return as is
  if (dateString.includes('T')) return dateString;

  // Convert "YYYY-MM-DD" to "YYYY-MM-DDT00:00:00Z"
  return `${dateString}T00:00:00Z`;
}

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
    search: filters.search,
  };
}

// ============ Public API Functions (Legacy Compatible) ============

export async function fetchReports(filters?: ReportFilters): Promise<ReportsResponse> {
  const apiFilters = convertLegacyFiltersToApi(filters);
  const response = await reportsApi.fetchReports(apiFilters);

  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch reports');
  }

  // Handle null data as empty array
  const reports = response.data ? response.data.map(convertApiReportToLegacy) : [];

  return {
    reports,
    total: response.meta?.total || 0,
    page: response.meta?.page || 1,
    limit: response.meta?.limit || 10,
    totalPages: response.meta?.total_pages || 0,
  };
}

export async function fetchReportBySlug(slug: string): Promise<ReportResponse> {
  const response = await reportsApi.fetchReportBySlug(slug);

  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch report');
  }

  if (!response.data) {
    throw new Error('Report not found');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function createReport(data: ReportFormData): Promise<ReportResponse> {
  // Convert form data to API format
  const apiData: Partial<ApiReport> = {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    category_id: Number(data.category),
    geography: data.geography,
    publish_date: convertDateToRFC3339(data.publishDate),
    price: data.price,
    discounted_price: data.discountedPrice,
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

  if (!response.success) {
    throw new Error(response.error || 'Failed to create report');
  }

  if (!response.data) {
    throw new Error('No report data returned from server');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function updateReport(
  id: string,
  data: Partial<ReportFormData>
): Promise<ReportResponse> {
  // Convert form data to API format
  const apiData: Partial<ApiReport> = {};
  if (data.title) apiData.title = data.title;
  if (data.slug) apiData.slug = data.slug;
  if (data.summary) apiData.summary = data.summary;
  if (data.category) apiData.category_id = Number(data.category);
  if (data.geography) apiData.geography = data.geography;
  if (data.publishDate !== undefined) apiData.publish_date = convertDateToRFC3339(data.publishDate);
  if (data.price !== undefined) apiData.price = data.price;
  if (data.discountedPrice !== undefined) apiData.discounted_price = data.discountedPrice;
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

  if (!response.success) {
    throw new Error(response.error || 'Failed to update report');
  }

  if (!response.data) {
    throw new Error('No report data returned from server');
  }

  return {
    report: convertApiReportToLegacy(response.data),
  };
}

export async function deleteReport(id: string): Promise<void> {
  const response = await reportsApi.deleteReport(Number(id));

  if (!response.success) {
    throw new Error(response.error || 'Failed to delete report');
  }
}
