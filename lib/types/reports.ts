// User reference (reuse from existing auth)
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
  | 'conclusion';

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
  twitterCard?: 'summary' | 'summary_large_image';
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
  publishDate: string;
  price: number;
  accessType: AccessType;
  status: ReportStatus;
  sections: ReportSections;
  metadata: ReportMetadata;
  versions?: ReportVersion[];
  createdAt: string;
  updatedAt: string;
  author: UserReference;
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
  price: number;
  accessType: AccessType;
  status: ReportStatus;
  sections: ReportSections;
  metadata: ReportMetadata;
}
