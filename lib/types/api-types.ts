/**
 * API Types aligned with Swagger schema
 * These types match the backend API responses exactly
 */

// ============ API Response Wrappers ============
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: ApiMeta;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  cursor?: string;
}

// ============ User Types ============
export interface ApiUserReference {
  id: number;
  email: string;
  name: string;
}

export interface ApiUserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// ============ Authentication Types ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: ApiUserResponse;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number; // seconds
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LogoutRequest {
  refresh_token?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'editor' | 'viewer';
  is_active?: boolean;
}

// ============ Category Types ============
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============ Report Types ============
export interface ApiReportSections {
  executiveSummary?: string;
  marketOverview?: string;
  marketSize?: string;
  competitive?: string;
  keyPlayers?: string;
  regional?: string;
  trends?: string;
  conclusion?: string;
  marketDetails?: string;
  keyFindings?: string;
  tableOfContents?: string;
  marketDrivers?: string;
  challenges?: string;
}

export interface ApiMarketMetrics {
  currentRevenue?: string;
  currentYear?: number;
  forecastRevenue?: string;
  forecastYear?: number;
  cagr?: string;
  cagrStartYear?: number;
  cagrEndYear?: number;
}

export interface ApiKeyPlayer {
  name: string;
  marketShare?: string;
  description?: string;
}

export interface ApiFAQ {
  question: string;
  answer: string;
}

export interface ApiReportMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  schemaJson?: string;
  robotsDirective?: string;
}

export interface ApiChartMetadata {
  id: number;
  report_id: number;
  title: string;
  description?: string;
  chart_type: string;
  data_points?: number;
  order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  report?: ApiReport;
}

export interface ApiReport {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  category_id?: number;
  sub_category_id?: number;
  market_segment_id?: number;
  geography?: string[];
  publish_date?: string;
  price?: number;
  discounted_price?: number;
  currency?: string;
  status: 'draft' | 'published';
  page_count?: number;
  formats?: string[];
  market_metrics?: ApiMarketMetrics;
  author_ids?: number[];
  key_players?: ApiKeyPlayer[];
  sections?: ApiReportSections;
  faqs?: ApiFAQ[];
  metadata?: ApiReportMetadata;
  meta_title?: string; // Legacy
  meta_description?: string; // Legacy
  meta_keywords?: string; // Legacy
  thumbnail_url?: string;
  is_featured?: boolean;
  view_count?: number;
  download_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiReportWithRelations extends ApiReport {
  category_name?: string;
  sub_category_name?: string;
  market_segment_name?: string;
  author?: ApiUserReference;
  charts?: ApiChartMetadata[];
}

// ============ Request/Response Types ============
export interface ApiReportFilters {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published';
  category?: string;
  geography?: string;
  search?: string;
}

export interface ApiReportsListResponse extends ApiResponse<ApiReport[]> {
  data: ApiReport[];
  meta: ApiMeta;
}

export interface ApiReportDetailResponse extends ApiResponse<ApiReportWithRelations> {
  data: ApiReportWithRelations;
}

export interface ApiCategoriesListResponse extends ApiResponse<ApiCategory[]> {
  data: ApiCategory[];
  meta: ApiMeta;
}

export interface ApiCategoryDetailResponse extends ApiResponse<ApiCategory> {
  data: ApiCategory;
}

// ============ Type Guards ============
export function isApiError(response: unknown): response is ApiResponse<never> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response &&
    !!response.error
  );
}

export function hasApiData<T>(
  response: ApiResponse<T>
): response is Required<Pick<ApiResponse<T>, 'data'>> & ApiResponse<T> {
  return response && response.success === true && response.data !== undefined;
}
