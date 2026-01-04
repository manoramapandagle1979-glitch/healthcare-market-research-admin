'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReportFormTabs } from '@/components/reports/report-form-tabs';
import { VersionHistory } from '@/components/reports/version-history';
import { useReport } from '@/hooks/use-report';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReportFormData } from '@/lib/types/reports';
import { toast } from 'sonner';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { report, isLoading, error, fetchReport, saveReport, isSaving } = useReport();
  const reportId = params.id as string;
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (reportId) {
      fetchReport(reportId);
    }
  }, [reportId, fetchReport]);

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'editor') {
      router.push('/reports');
    }
  }, [user, router]);

  const handleSaveTab = useCallback(
    async (tabKey: string, data: Partial<ReportFormData>) => {
      try {
        // For existing reports, we can do partial updates
        // The API should handle merging the partial data with the existing report
        await saveReport(reportId, data as ReportFormData);

        setLastSaved(new Date());
        toast.success('Draft saved successfully');
      } catch (error) {
        console.error('Error saving draft:', error);
        toast.error('Failed to save draft');
      }
    },
    [saveReport, reportId]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border rounded-lg">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Failed to load report</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchReport(reportId)}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Report</h1>
          <p className="text-muted-foreground mt-2">{report.title}</p>
        </div>
        <div className="text-sm">
          {isSaving ? (
            <span className="text-muted-foreground">Saving...</span>
          ) : lastSaved ? (
            <span className="text-green-600">
              All changes saved at {lastSaved.toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportFormTabs
            report={report}
            onSubmit={async data => {
              // Final submit - save with form data
              await saveReport(reportId, data);
            }}
            onSaveTab={handleSaveTab}
            onPreview={() => router.push(`/reports/${reportId}/preview`)}
            isSaving={isSaving}
          />
        </div>

        <div>
          <VersionHistory versions={report.versions || []} />
        </div>
      </div>
    </div>
  );
}
