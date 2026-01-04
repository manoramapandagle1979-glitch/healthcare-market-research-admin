import { apiClient } from './client';
import type {
  BlogsResponse,
  BlogFilters,
  BlogResponse,
  BlogFormData,
  BlogTag,
  BlogTagsResponse,
  BlogCategoriesResponse,
  BlogAuthorsResponse,
} from '@/lib/types/blogs';

// Blog CRUD operations
export async function fetchBlogs(filters?: BlogFilters): Promise<BlogsResponse> {
  return apiClient.get<BlogsResponse>('/blogs', {
    params: filters as Record<string, unknown>,
  });
}

export async function fetchBlogById(id: string): Promise<BlogResponse> {
  return apiClient.get<BlogResponse>(`/blogs/${id}`);
}

export async function createBlog(data: BlogFormData): Promise<BlogResponse> {
  return apiClient.post<BlogResponse>('/blogs', data);
}

export async function updateBlog(id: string, data: Partial<BlogFormData>): Promise<BlogResponse> {
  return apiClient.put<BlogResponse>(`/blogs/${id}`, data);
}

export async function deleteBlog(id: string): Promise<void> {
  return apiClient.delete(`/blogs/${id}`);
}

// Tag operations
export async function fetchTags(): Promise<BlogTagsResponse> {
  return apiClient.get<BlogTagsResponse>('/blogs/tags');
}

export async function createTag(name: string): Promise<{ tag: BlogTag }> {
  return apiClient.post<{ tag: BlogTag }>('/blogs/tags', { name });
}

export async function deleteTag(id: string): Promise<void> {
  return apiClient.delete(`/blogs/tags/${id}`);
}

// Category operations
export async function fetchCategories(): Promise<BlogCategoriesResponse> {
  return apiClient.get<BlogCategoriesResponse>('/blogs/categories');
}

// Author operations
export async function fetchAuthors(): Promise<BlogAuthorsResponse> {
  return apiClient.get<BlogAuthorsResponse>('/blogs/authors');
}

// Workflow operations
export async function submitForReview(id: string): Promise<BlogResponse> {
  return apiClient.patch<BlogResponse>(`/blogs/${id}/submit-review`);
}

export async function publishBlog(id: string): Promise<BlogResponse> {
  return apiClient.patch<BlogResponse>(`/blogs/${id}/publish`);
}

export async function unpublishBlog(id: string): Promise<BlogResponse> {
  return apiClient.patch<BlogResponse>(`/blogs/${id}/unpublish`);
}
