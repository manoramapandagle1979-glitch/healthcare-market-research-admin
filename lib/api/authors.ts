import { apiClient } from './client';
import type { AuthorFormData, AuthorsResponse, AuthorResponse } from '@/lib/types/reports';

/**
 * Fetches all authors
 */
export async function fetchAuthors(): Promise<AuthorsResponse> {
  return apiClient.get<AuthorsResponse>('/authors');
}

/**
 * Fetches a single author by ID
 */
export async function fetchAuthorById(id: string): Promise<AuthorResponse> {
  return apiClient.get<AuthorResponse>(`/authors/${id}`);
}

/**
 * Creates a new author
 */
export async function createAuthor(data: AuthorFormData): Promise<AuthorResponse> {
  return apiClient.post<AuthorResponse>('/authors', data);
}

/**
 * Updates an existing author
 */
export async function updateAuthor(
  id: string,
  data: Partial<AuthorFormData>
): Promise<AuthorResponse> {
  return apiClient.put<AuthorResponse>(`/authors/${id}`, data);
}

/**
 * Deletes an author
 */
export async function deleteAuthor(id: string): Promise<void> {
  return apiClient.delete(`/authors/${id}`);
}
