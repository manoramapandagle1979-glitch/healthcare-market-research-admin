'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogFiltersComponent } from '@/components/blogs/blog-filters';
import { BlogList } from '@/components/blogs/blog-list';
import { Pagination } from '@/components/ui/pagination';
import { useBlogs } from '@/hooks/use-blogs';
import { useAuth } from '@/contexts/auth-context';
import { Plus, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { deleteBlog, fetchAuthors } from '@/lib/api/blogs';
import type { BlogAuthor } from '@/lib/types/blogs';

export default function BlogPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const {
    blogs,
    total,
    totalPages,
    currentPage,
    isLoading,
    refetch,
    setFilters: updateFilters,
  } = useBlogs(filters);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    blogId: string | null;
  }>({
    open: false,
    blogId: null,
  });

  const loadAuthors = async () => {
    try {
      const { authors } = await fetchAuthors();
      setAuthors(authors);
    } catch {
      // Error is logged by the API client
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.blogId) return;

    try {
      await deleteBlog(deleteDialog.blogId);
      toast.success('Blog post deleted successfully');
      refetch();
      setDeleteDialog({ open: false, blogId: null });
    } catch {
      toast.error('Failed to delete blog post');
    }
  };

  const canCreateEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">Manage blog content ({total} total)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {canCreateEdit && (
            <Button asChild>
              <Link href="/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <BlogFiltersComponent
        filters={filters}
        onFiltersChange={newFilters => {
          setFilters(newFilters);
          updateFilters(newFilters);
        }}
        authors={authors}
      />

      {/* Blog List */}
      <BlogList
        blogs={blogs}
        isLoading={isLoading}
        onDelete={canCreateEdit ? id => setDeleteDialog({ open: true, blogId: id }) : undefined}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => updateFilters({ ...filters, page })}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog({ open, blogId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, blogId: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
