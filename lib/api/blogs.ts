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
import {
  fetchBlogsMock,
  fetchBlogByIdMock,
  createBlogMock,
  updateBlogMock,
  deleteBlogMock,
  fetchTagsMock,
  fetchCategoriesMock,
  fetchAuthorsMock,
  createTagMock,
  deleteTagMock,
} from './blogs.mock';

// Blog CRUD operations
export async function fetchBlogs(filters?: BlogFilters): Promise<BlogsResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchBlogsMock(filters);
  }
  return apiClient.get<BlogsResponse>('/blogs', {
    params: filters as Record<string, unknown>,
  });
}

export async function fetchBlogById(id: string): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchBlogByIdMock(id);
  }
  return apiClient.get<BlogResponse>(`/blogs/${id}`);
}

export async function createBlog(data: BlogFormData): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return createBlogMock(data);
  }
  return apiClient.post<BlogResponse>('/blogs', data);
}

export async function updateBlog(id: string, data: Partial<BlogFormData>): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return updateBlogMock(id, data);
  }
  return apiClient.put<BlogResponse>(`/blogs/${id}`, data);
}

export async function deleteBlog(id: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return deleteBlogMock(id);
  }
  return apiClient.delete(`/blogs/${id}`);
}

// Tag operations
export async function fetchTags(): Promise<BlogTagsResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchTagsMock();
  }
  return apiClient.get<BlogTagsResponse>('/blogs/tags');
}

export async function createTag(name: string): Promise<{ tag: BlogTag }> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return createTagMock(name);
  }
  return apiClient.post<{ tag: BlogTag }>('/blogs/tags', { name });
}

export async function deleteTag(id: string): Promise<void> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return deleteTagMock(id);
  }
  return apiClient.delete(`/blogs/tags/${id}`);
}

// Category operations
export async function fetchCategories(): Promise<BlogCategoriesResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchCategoriesMock();
  }
  return apiClient.get<BlogCategoriesResponse>('/blogs/categories');
}

// Author operations
export async function fetchAuthors(): Promise<BlogAuthorsResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return fetchAuthorsMock();
  }
  return apiClient.get<BlogAuthorsResponse>('/blogs/authors');
}

// Workflow operations
export async function submitForReview(id: string): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return updateBlogMock(id, { status: 'review' });
  }
  return apiClient.patch<BlogResponse>(`/blogs/${id}/submit-review`);
}

export async function publishBlog(id: string): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return updateBlogMock(id, { status: 'published' });
  }
  return apiClient.patch<BlogResponse>(`/blogs/${id}/publish`);
}

export async function unpublishBlog(id: string): Promise<BlogResponse> {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return updateBlogMock(id, { status: 'draft' });
  }
  return apiClient.patch<BlogResponse>(`/blogs/${id}/unpublish`);
}
