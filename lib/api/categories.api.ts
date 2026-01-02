/**
 * Categories API Service
 * Aligned with swagger specification
 */

import { apiClient } from './client';
import type { ApiCategoriesListResponse, ApiCategoryDetailResponse } from '@/lib/types/api-types';

// ============ Categories Endpoints ============

/**
 * GET /api/v1/categories
 * Get all active categories with pagination
 */
export async function fetchCategories(options?: {
  page?: number;
  limit?: number;
}): Promise<ApiCategoriesListResponse> {
  return apiClient.get<ApiCategoriesListResponse>('/v1/categories', {
    params: options,
    requiresAuth: false, // Public endpoint
  });
}

/**
 * GET /api/v1/categories/{slug}
 * Get category by slug
 */
export async function fetchCategoryBySlug(slug: string): Promise<ApiCategoryDetailResponse> {
  return apiClient.get<ApiCategoryDetailResponse>(`/v1/categories/${slug}`, {
    requiresAuth: false, // Public endpoint
  });
}
