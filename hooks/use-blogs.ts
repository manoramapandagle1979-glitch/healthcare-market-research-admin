'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Blog, BlogFilters } from '@/lib/types/blogs';
import { fetchBlogs } from '@/lib/api/blogs';

interface UseBlogsReturn {
  blogs: Blog[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setFilters: (filters: BlogFilters) => void;
}

export function useBlogs(initialFilters?: BlogFilters): UseBlogsReturn {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialFilters?.page || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<BlogFilters>(initialFilters || {});

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchBlogs(filters);

      setBlogs(data.blogs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blog posts';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setFilters = useCallback((newFilters: BlogFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    blogs,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchData,
    setFilters,
  };
}
