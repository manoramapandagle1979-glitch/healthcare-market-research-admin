'use client';

import { useState, useCallback } from 'react';
import { Search, UploadCloud, Images as ImagesIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImageCard } from '@/components/images/image-card';
import { ImageDetailDrawer } from '@/components/images/image-detail-drawer';
import { ImageUploadZone } from '@/components/images/image-upload-zone';
import { useImages } from '@/hooks/use-images';
import type { Image } from '@/lib/api/images';

const POPULAR_TAGS = ['banner', 'chart', 'infographic', 'report', 'blog', 'press-release'];

export default function ImagesPage() {
  const { images, pagination, loading, params, setFilters, removeImage, refetch } = useImages();
  const [selected, setSelected] = useState<Image | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      setFilters({ search: value || undefined });
    },
    [setFilters]
  );

  const handleTagFilter = useCallback(
    (tag: string) => {
      const next = params.tag === tag ? undefined : tag;
      setFilters({ tag: next });
    },
    [params.tag, setFilters]
  );

  const handleSelect = useCallback((image: Image) => {
    setSelected(image);
    setDrawerOpen(true);
  }, []);

  const handleUpdated = useCallback(
    (updated: Image) => {
      refetch();
      setSelected(updated);
    },
    [refetch]
  );

  const handleUploaded = useCallback(
    (_image: Image) => {
      refetch();
    },
    [refetch]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ImagesIcon className="h-6 w-6" />
            Media Library
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination.total} image{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload images</DialogTitle>
            </DialogHeader>
            <ImageUploadZone
              onUploaded={img => {
                handleUploaded(img);
              }}
            />
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setUploadOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by title or alt text..."
            value={searchInput}
            onChange={e => handleSearch(e.target.value)}
          />
          {searchInput && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => handleSearch('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={params.tag === tag ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleTagFilter(tag)}
            >
              {tag}
            </Badge>
          ))}
          {params.tag && !POPULAR_TAGS.includes(params.tag) && (
            <Badge variant="default">{params.tag}</Badge>
          )}
          {params.tag && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs"
              onClick={() => setFilters({ tag: undefined })}
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <ImagesIcon className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">
            {params.search || params.tag
              ? 'No images match your filters.'
              : 'No images yet. Upload some!'}
          </p>
          {(params.search || params.tag) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({});
                setSearchInput('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map(image => (
            <ImageCard
              key={image.id}
              image={image}
              onSelect={handleSelect}
              onDelete={removeImage}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setFilters({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setFilters({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}

      <ImageDetailDrawer
        image={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdated={handleUpdated}
        onDeleted={id => {
          removeImage(id);
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
