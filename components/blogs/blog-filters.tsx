'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BLOG_CATEGORIES } from '@/lib/config/blogs';
import type { BlogFilters, BlogAuthor } from '@/lib/types/blogs';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface BlogFiltersProps {
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
  authors?: BlogAuthor[];
}

export function BlogFiltersComponent({ filters, onFiltersChange, authors = [] }: BlogFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({ page: 1 });
  };

  const hasActiveFilters =
    filters.status || filters.category || filters.authorId || filters.tag || filters.search;

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blog posts by title, excerpt, or tags..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.status || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as BlogFilters['status']),
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {BLOG_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.authorId || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              authorId: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            {authors.map(author => (
              <SelectItem key={author.id} value={author.id}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
