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
export type AccessType = 'free' | 'paid';

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
  | 'tableOfContents';

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
  keyFindings: string;
  tableOfContents: string;
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

// Report Author (Legacy - kept as string for backward compatibility)
export interface ReportAuthor {
  id: string;
  name: string;
  role?: string;
  credentials?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Key Player (company in market)
export interface KeyPlayer {
  name: string;
  marketShare?: string;
  rank?: number;
  description?: string;
}

// Report Format
export type ReportFormat = 'PDF' | 'Excel' | 'Word' | 'PowerPoint';

// FAQ item
export interface FAQ {
  question: string;
  answer: string;
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

// Version history item
export interface ReportVersion {
  id: string;
  versionNumber: number;
  summary: string;
  createdAt: string;
  author: UserReference;
  sections: ReportSections;
  metadata: ReportMetadata;
}

// Main Report interface
export interface Report {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  geography: string[];
  publishDate?: string; // Custom publish date
  price: number;
  discountedPrice: number;
  accessType: AccessType;
  status: ReportStatus;
  pageCount?: number;
  formats?: ReportFormat[];
  marketMetrics?: MarketMetrics;
  authorIds?: string[]; // References to authors
  keyPlayers?: KeyPlayer[]; // Structured key players with market share
  sections: ReportSections;
  faqs?: FAQ[];
  metadata: ReportMetadata;
  versions?: ReportVersion[];
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
  accessType?: AccessType;
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
  title: string;
  summary: string;
  category: string;
  geography: string[];
  publishDate?: string;
  price: number;
  discountedPrice: number;
  accessType: AccessType;
  status: ReportStatus;
  pageCount?: number;
  formats?: ReportFormat[];
  marketMetrics?: MarketMetrics;
  authorIds?: string[];
  keyPlayers?: KeyPlayer[];
  sections: ReportSections;
  faqs?: FAQ[];
  metadata: ReportMetadata;
}

// Author Form Data
export interface AuthorFormData {
  name: string;
  role?: string;
  credentials?: string;
  bio?: string;
}

// Authors API Response
export interface AuthorsResponse {
  authors: ReportAuthor[];
  total: number;
}

export interface AuthorResponse {
  author: ReportAuthor;
}
