// Re-use UserReference from reports
import type { UserReference } from './reports';

// Blog status enum with workflow states
export type BlogStatus = 'draft' | 'review' | 'published';

// Blog tag
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

// Blog author (extends UserReference with author-specific fields)
export interface BlogAuthor extends UserReference {
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

// SEO metadata for blog posts
export interface BlogMetadata {
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
export interface BlogVersion {
  id: string;
  versionNumber: number;
  summary: string;
  createdAt: string;
  author: UserReference;
  content: string;
  title: string;
  excerpt: string;
}

// Main Blog interface
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML from rich text editor
  featuredImage?: string;
  category: string;
  tags: BlogTag[];
  author: BlogAuthor;
  status: BlogStatus;
  publishDate: string;
  readingTime: number; // in minutes
  viewCount: number;
  metadata: BlogMetadata;
  versions?: BlogVersion[];
  createdAt: string;
  updatedAt: string;
  reviewedBy?: UserReference;
  reviewedAt?: string;
}

// List filters
export interface BlogFilters {
  status?: BlogStatus;
  category?: string;
  tag?: string;
  authorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// API response types
export interface BlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  blog: Blog;
}

// Form data (for create/update)
export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: BlogTag[];
  authorId: string;
  status: BlogStatus;
  publishDate: string;
  metadata: BlogMetadata;
}

// Category type
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

// Author list response
export interface BlogAuthorsResponse {
  authors: BlogAuthor[];
  total: number;
}

// Tag list response
export interface BlogTagsResponse {
  tags: BlogTag[];
  total: number;
}

// Category list response
export interface BlogCategoriesResponse {
  categories: BlogCategory[];
  total: number;
}
