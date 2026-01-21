// Re-use UserReference from reports
import type { UserReference } from './reports';

// Press Release status enum with workflow states
export type PressReleaseStatus = 'draft' | 'review' | 'published';

// Press Release tag
export interface PressReleaseTag {
  id: string;
  name: string;
  slug: string;
}

// Press Release author (extends UserReference with author-specific fields)
export interface PressReleaseAuthor extends UserReference {
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

// SEO metadata for press releases (matches API spec)
export interface PressReleaseMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// Version history item
export interface PressReleaseVersion {
  id: string;
  versionNumber: number;
  summary: string;
  createdAt: string;
  author: UserReference;
  content: string;
  title: string;
  excerpt: string;
}

// Main Press Release interface (matches API response)
export interface PressRelease {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from rich text editor
  authorId: number;
  categoryId: number; // Single category ID from API
  tags: string; // Comma-separated tags from API
  status: PressReleaseStatus;
  publishDate: string;
  location?: string;
  metadata: PressReleaseMetadata;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: number;
  reviewedAt?: string;
}

// List filters (matches API query parameters)
export interface PressReleaseFilters {
  status?: PressReleaseStatus;
  categoryId?: number; // Single category ID for filtering
  tags?: string; // Comma-separated tags
  authorId?: number;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// API response types
export interface PressReleasesResponse {
  pressReleases: PressRelease[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PressReleaseResponse {
  pressRelease: PressRelease;
}

// Form data for create (matches API CreatePressReleaseRequest)
export interface CreatePressReleaseData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: number; // Single category ID for API
  tags: string; // Comma-separated tag string for API
  authorId: number;
  status: PressReleaseStatus;
  publishDate: string;
  location?: string;
  metadata?: PressReleaseMetadata;
}

// Form data for update (matches API UpdatePressReleaseRequest)
export interface UpdatePressReleaseData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  categoryId?: number; // Single category ID for API
  tags?: string; // Comma-separated tag string for API
  authorId?: number;
  status?: PressReleaseStatus;
  publishDate?: string;
  location?: string;
  metadata?: PressReleaseMetadata;
}

// UI Form data (what the form uses before sending to API)
export interface PressReleaseFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: number; // Single category ID
  tags: string; // Comma-separated tags
  authorId: number;
  status: PressReleaseStatus;
  publishDate: string;
  location?: string;
  metadata: PressReleaseMetadata;
}

// Category type
export interface PressReleaseCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

// Author list response
export interface PressReleaseAuthorsResponse {
  authors: PressReleaseAuthor[];
  total: number;
}

// Tag list response
export interface PressReleaseTagsResponse {
  tags: PressReleaseTag[];
  total: number;
}

// Category list response
export interface PressReleaseCategoriesResponse {
  categories: PressReleaseCategory[];
  total: number;
}
