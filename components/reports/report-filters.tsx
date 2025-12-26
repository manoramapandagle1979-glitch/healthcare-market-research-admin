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
import { REPORT_CATEGORIES, GEOGRAPHIES } from '@/lib/config/reports';
import type { ReportFilters, ReportStatus, AccessType } from '@/lib/types/reports';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface ReportFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
}

export function ReportFiltersComponent({ filters, onFiltersChange }: ReportFiltersProps) {
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
    filters.status || filters.category || filters.geography || filters.accessType || filters.search;

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports by title or summary..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filter dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={filters.status || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : (value as ReportStatus),
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
            {REPORT_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.geography || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              geography: value === 'all' ? undefined : value,
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Geography" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Geographies</SelectItem>
            {GEOGRAPHIES.map(geo => (
              <SelectItem key={geo} value={geo}>
                {geo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.accessType || 'all'}
          onValueChange={value =>
            onFiltersChange({
              ...filters,
              accessType: value === 'all' ? undefined : (value as AccessType),
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Access Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
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
