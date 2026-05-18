'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchImages, deleteImage, type Image, type ImageListParams } from '@/lib/api/images';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseImagesState {
  images: Image[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const DEFAULT_PAGINATION: Pagination = { page: 1, limit: 20, total: 0, totalPages: 0 };

export function useImages(initialParams: ImageListParams = {}) {
  const [params, setParams] = useState<ImageListParams>({ page: 1, limit: 20, ...initialParams });
  const [state, setState] = useState<UseImagesState>({
    images: [],
    pagination: DEFAULT_PAGINATION,
    loading: true,
    error: null,
  });

  const load = useCallback(
    async (overrideParams?: ImageListParams) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const result = await fetchImages(overrideParams ?? params);
        setState({
          images: result.images,
          pagination: result.pagination,
          loading: false,
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch images';
        setState(prev => ({ ...prev, loading: false, error: message }));
      }
    },
    [params]
  );

  useEffect(() => {
    load();
  }, [load]);

  const setFilters = useCallback((updates: Partial<ImageListParams>) => {
    setParams(prev => {
      const next = { ...prev, ...updates, page: updates.page ?? 1 };
      return next;
    });
  }, []);

  const removeImage = useCallback(async (id: number) => {
    try {
      await deleteImage(id);
      setState(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== id),
        pagination: { ...prev.pagination, total: prev.pagination.total - 1 },
      }));
      toast.success('Image deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete image');
    }
  }, []);

  const refetch = useCallback(() => load(), [load]);

  return {
    ...state,
    params,
    setFilters,
    removeImage,
    refetch,
  };
}
