import { apiClient } from './client';
import type {
  PressReleasesResponse,
  PressReleaseFilters,
  PressReleaseResponse,
  PressReleaseFormData,
  CreatePressReleaseData,
  UpdatePressReleaseData,
  PressReleaseTag,
  PressReleaseTagsResponse,
  PressReleaseCategoriesResponse,
  PressReleaseAuthorsResponse,
} from '@/lib/types/press-releases';

// Helper function to transform form data to API create/update format
function transformFormDataToApi(
  data: PressReleaseFormData
): CreatePressReleaseData | UpdatePressReleaseData {
  return {
    ...data,
    // categoryId and tags are already in the correct format
  };
}

// Press Release CRUD operations
export async function fetchPressReleases(
  filters?: PressReleaseFilters
): Promise<PressReleasesResponse> {
  return apiClient.get<PressReleasesResponse>('/v1/press-releases', {
    params: filters as Record<string, unknown>,
  });
}

export async function fetchPressReleaseById(id: number): Promise<PressReleaseResponse> {
  return apiClient.get<PressReleaseResponse>(`/v1/press-releases/${id}`);
}

export async function createPressRelease(
  data: PressReleaseFormData
): Promise<PressReleaseResponse> {
  const apiData = transformFormDataToApi(data) as CreatePressReleaseData;
  return apiClient.post<PressReleaseResponse>('/v1/press-releases', apiData);
}

export async function updatePressRelease(
  id: number,
  data: Partial<PressReleaseFormData>
): Promise<PressReleaseResponse> {
  const apiData: UpdatePressReleaseData = {
    ...data,
    // categoryId and tags are already in the correct format
  };
  return apiClient.put<PressReleaseResponse>(`/v1/press-releases/${id}`, apiData);
}

export async function deletePressRelease(id: number): Promise<void> {
  return apiClient.delete(`/v1/press-releases/${id}`);
}

// Tag operations
export async function fetchTags(): Promise<PressReleaseTagsResponse> {
  return apiClient.get<PressReleaseTagsResponse>('/press-releases/tags');
}

export async function createTag(name: string): Promise<{ tag: PressReleaseTag }> {
  return apiClient.post<{ tag: PressReleaseTag }>('/press-releases/tags', { name });
}

export async function deleteTag(id: string): Promise<void> {
  return apiClient.delete(`/press-releases/tags/${id}`);
}

// Category operations
export async function fetchCategories(): Promise<PressReleaseCategoriesResponse> {
  return apiClient.get<PressReleaseCategoriesResponse>('/press-releases/categories');
}

// Author operations
export async function fetchAuthors(): Promise<PressReleaseAuthorsResponse> {
  return apiClient.get<PressReleaseAuthorsResponse>('/press-releases/authors');
}

// Workflow operations
export async function submitForReview(id: number): Promise<PressReleaseResponse> {
  return apiClient.patch<PressReleaseResponse>(`/v1/press-releases/${id}/submit-review`);
}

export async function publishPressRelease(id: number): Promise<PressReleaseResponse> {
  return apiClient.patch<PressReleaseResponse>(`/v1/press-releases/${id}/publish`);
}

export async function unpublishPressRelease(id: number): Promise<PressReleaseResponse> {
  return apiClient.patch<PressReleaseResponse>(`/v1/press-releases/${id}/unpublish`);
}
