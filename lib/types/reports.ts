// ============ API Response Wrappers (from swagger) ============
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

// User reference (Legacy - kept as string for backward compatibility)
export interface UserReference {
  id: string;
  email: string;
  name?: string;
}

// Report status enum
export type ReportStatus = 'draft' | 'published';

// Predefined section keys
export type ReportSectionKey =
  | 'executiveSummary'
  | 'marketOverview'
  | 'marketSize'
  | 'competitive'
  | 'keyPlayers'
  | 'regional'
  | 'trends'
  | 'conclusion'
  | 'marketDetails'
  | 'keyFindings'
  | 'tableOfContents'
  | 'marketDrivers'
  | 'challenges';

// Section metadata for UI rendering
export interface ReportSectionMeta {
  key: ReportSectionKey;
  label: string;
  placeholder: string;
  required: boolean;
}

// Report sections (HTML content)
export interface ReportSections {
  executiveSummary: string;
  marketOverview: string;
  marketSize: string;
  competitive: string;
  keyPlayers: string;
  regional: string;
  trends: string;
  conclusion: string;
  marketDetails: string;
  keyFindings: string[]; // Array of key finding entries
  tableOfContents: TableOfContentsStructure; // Structured TOC
  marketDrivers?: string; // Optional market drivers
  challenges?: string; // Optional challenges
}

// Market Metrics
export interface MarketMetrics {
  currentRevenue?: string;
  currentYear?: number;
  forecastRevenue?: string;
  forecastYear?: number;
  cagr?: string;
  cagrStartYear?: number;
  cagrEndYear?: number;
}

// Report Author
export interface ReportAuthor {
  id: number;
  name: string;
  role?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Key Player (company in market)
export interface KeyPlayer {
  name: string;
  marketShare?: string;
  description?: string;
}

// Report Format
export type ReportFormat = 'PDF' | 'Excel' | 'Word' | 'PowerPoint';

// FAQ item
export interface FAQ {
  question: string;
  answer: string;
}

// Chart types for reports (simplified from chart-generator)
export type ReportChartType = 'bar' | 'stacked-bar' | 'pie' | 'donut' | 'world-map';

export interface ReportChartData {
  labels: string[];
  series: Array<{
    id: string;
    name: string;
    color: string;
    values: number[];
  }>;
}

export interface ReportChart {
  id: string; // Temporary ID (UUID for new charts, server ID for existing)
  name: string; // User-friendly name for the chart
  chartType: ReportChartType;
  orientation?: 'vertical' | 'horizontal';
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unitSuffix?: string;
  decimalPrecision: 0 | 1 | 2;
  showLegend: boolean;
  showGridlines: boolean;
  data: ReportChartData;
  imageUrl?: string; // URL of generated image (after upload to server)
  imageData?: string; // Base64 image data (temporary, before upload)
  createdAt?: string;
  updatedAt?: string;
}

// Table of Contents structure
export interface TOCSubsection {
  id: string;
  title: string;
  pageNumber?: string;
}

export interface TOCSection {
  id: string;
  title: string;
  pageNumber?: string;
  subsections: TOCSubsection[];
}

export interface TOCChapter {
  id: string;
  title: string;
  pageNumber?: string;
  sections: TOCSection[];
}

export interface TableOfContentsStructure {
  chapters: TOCChapter[];
}

// SEO metadata
export interface ReportMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string; // Changed to string for API compatibility
  schemaJson?: string;
  robotsDirective?: string;
}

// Main Report interface
export interface Report {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string; // Optional description
  category: string; // Category name (for display)
  categoryId?: number; // Category ID (for editing/API)
  geography: string[];
  publishDate?: string; // Auto-set when status changes to published
  price: number;
  discountedPrice: number;
  currency?: string; // Defaults to "USD"
  status: ReportStatus;
  pageCount?: number;
  formats?: ReportFormat[];
  marketMetrics?: MarketMetrics;
  authorIds?: string[]; // References to authors
  keyPlayers?: KeyPlayer[]; // Structured key players with market share
  sections: ReportSections;
  faqs?: FAQ[];
  metadata: ReportMetadata;
  thumbnailUrl?: string; // Optional thumbnail
  isFeatured?: boolean; // Defaults to false
  internalNotes?: string; // Admin-only notes
  createdAt: string;
  updatedAt: string;
  author: UserReference; // System author (who created in admin)
}

// List filters
export interface ReportFilters {
  status?: ReportStatus;
  category?: string;
  geography?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// API response types
export interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportResponse {
  report: Report;
}

// Form data (for create/update)
export interface ReportFormData {
  // Mandatory fields
  title: string; // Min 10 characters
  slug: string; // Required, unique
  summary: string; // Min 50 characters
  category_id: number; // Required - Category ID for API
  geography: string[]; // At least one required
  sections: ReportSections; // Required

  // Optional fields
  description?: string;
  thumbnailUrl?: string;
  price?: number; // Defaults to 0
  discountedPrice?: number; // Defaults to 0
  currency?: string; // Defaults to "USD"
  status?: ReportStatus; // Defaults to "draft"
  publishDate?: string; // Optional - can be manually set or auto-set when status changes to "published"
  pageCount?: number;
  formats?: ReportFormat[];
  marketMetrics?: MarketMetrics;
  authorIds?: string[];
  keyPlayers?: KeyPlayer[];
  faqs?: FAQ[];
  metadata: ReportMetadata;
  isFeatured?: boolean;
  internalNotes?: string;
  charts?: ReportChart[]; // Charts associated with this report

  // Note: These fields are auto-managed and should NOT be in form data:
  // - id (auto-generated)
  // - created_by (auto-set from authenticated user)
  // - updated_by (auto-set from authenticated user)
  // - created_at (auto-managed)
  // - updated_at (auto-managed)
  // - view_count (managed by view tracking)
  // - download_count (managed by download tracking)
}

// Author Form Data
export interface AuthorFormData {
  name: string;
  role?: string;
  bio?: string;
}

// Authors API Response
export interface AuthorsResponse extends ApiResponse<ReportAuthor[]> {
  data: ReportAuthor[];
  meta: ApiMeta;
}

export interface AuthorResponse extends ApiResponse<ReportAuthor> {
  data: ReportAuthor;
}
