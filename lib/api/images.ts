import { apiClient } from './client';
import type { ApiResponse } from '@/lib/types/reports';

export interface Image {
  id: number;
  title: string;
  altText: string;
  url: string;
  objectKey: string;
  size: number;
  mimeType: string;
  tags: string[];
  uploadedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageListResponse {
  images: Image[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiImage {
  id: number;
  title: string;
  alt_text: string;
  url: string;
  object_key: string;
  size: number;
  mime_type: string;
  tags: string[];
  uploaded_by?: number;
  created_at: string;
  updated_at: string;
}

interface ApiImageListData {
  images: ApiImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

function transformImage(api: ApiImage): Image {
  return {
    id: api.id,
    title: api.title,
    altText: api.alt_text,
    url: api.url,
    objectKey: api.object_key,
    size: api.size,
    mimeType: api.mime_type,
    tags: api.tags ?? [],
    uploadedBy: api.uploaded_by,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export interface ImageListParams {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export async function fetchImages(params: ImageListParams = {}): Promise<ImageListResponse> {
  const query: Record<string, unknown> = {};
  if (params.search) query.search = params.search;
  if (params.tag) query.tag = params.tag;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;

  const response = await apiClient.get<ApiResponse<ApiImageListData>>('/v1/images', {
    params: query,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to fetch images');
  }

  const data = response.data as unknown as ApiImageListData;
  return {
    images: (data.images ?? []).map(transformImage),
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.total_pages,
    },
  };
}

export async function uploadImage(
  file: File,
  title?: string,
  altText?: string,
  tags?: string[]
): Promise<Image> {
  const formData = new FormData();
  formData.append('image', file);
  if (title) formData.append('title', title);
  if (altText) formData.append('alt_text', altText);
  if (tags && tags.length > 0) formData.append('tags', tags.join(','));

  const response = await apiClient.upload<ApiResponse<ApiImage>>('/v1/images', formData);

  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to upload image');
  }

  return transformImage(response.data as unknown as ApiImage);
}

export async function fetchImage(id: number | string): Promise<Image> {
  const response = await apiClient.get<ApiResponse<ApiImage>>(`/v1/images/${id}`);

  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to fetch image');
  }

  return transformImage(response.data as unknown as ApiImage);
}

export async function updateImage(
  id: number | string,
  updates: { title?: string; altText?: string; tags?: string[] }
): Promise<Image> {
  const body: Record<string, unknown> = {};
  if (updates.title !== undefined) body.title = updates.title;
  if (updates.altText !== undefined) body.alt_text = updates.altText;
  if (updates.tags !== undefined) body.tags = updates.tags;

  const response = await apiClient.patch<ApiResponse<ApiImage>>(`/v1/images/${id}`, body);

  if (!response.success || !response.data) {
    throw new Error(response.error ?? 'Failed to update image');
  }

  return transformImage(response.data as unknown as ApiImage);
}

export async function deleteImage(id: number | string): Promise<void> {
  const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/v1/images/${id}`);

  if (!response.success) {
    throw new Error(response.error ?? 'Failed to delete image');
  }
}
