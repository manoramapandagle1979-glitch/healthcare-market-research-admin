'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ReportFiltersComponent } from '@/components/reports/report-filters';
import { ReportList } from '@/components/reports/report-list';
import { PaginationWrapper as Pagination } from '@/components/ui/pagination-wrapper';
import { useReports } from '@/hooks/use-reports';
import { useAuth } from '@/contexts/auth-context';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ReportsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  const {
    reports,
    total,
    totalPages,
    currentPage,
    isLoading,
    refetch,
    setFilters: updateFilters,
    softDelete,
  } = useReports(filters);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reportId: string | null;
  }>({
    open: false,
    reportId: null,
  });

  const handleDelete = async () => {
    if (!deleteDialog.reportId) return;

    try {
      await softDelete(deleteDialog.reportId);
      toast.success('Report moved to trash');
      setDeleteDialog({ open: false, reportId: null });
    } catch {
      toast.error('Failed to move report to trash');
    }
  };

  const canCreateEdit = user?.role === 'admin' || user?.role === 'editor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Manage market research reports ({total} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {canCreateEdit && (
            <Button variant="outline" size="sm" onClick={() => router.push('/reports/trash')}>
              <Trash2 className="mr-2 h-4 w-4" />
              View Trash
            </Button>
          )}
          {canCreateEdit && (
            <Button asChild>
              <Link href="/reports/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <ReportFiltersComponent
        filters={filters}
        onFiltersChange={newFilters => {
          setFilters(newFilters);
          updateFilters(newFilters);
        }}
      />

      {/* Reports List */}
      <ReportList
        reports={reports}
        isLoading={isLoading}
        viewMode="active"
        onSoftDelete={
          canCreateEdit ? id => setDeleteDialog({ open: true, reportId: id }) : undefined
        }
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
        onOpenChange={open => setDeleteDialog({ open, reportId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Report to Trash</DialogTitle>
            <DialogDescription>
              This report will be moved to trash. You can restore it later from the trash page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, reportId: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
