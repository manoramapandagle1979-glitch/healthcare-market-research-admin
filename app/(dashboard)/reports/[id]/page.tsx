'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ReportFormTabs } from '@/components/reports/report-form-tabs';
import { VersionHistory } from '@/components/reports/version-history';
import { useReport } from '@/hooks/use-report';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReportFormData } from '@/lib/types/reports';

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { report, isLoading, error, fetchReport, saveReport, isSaving } = useReport();
  const reportId = params.id as string;

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

  const handleSaveTab = async (tabKey: string, data: Partial<ReportFormData>) => {
    // Save individual tab data as draft
    console.log(`Saving tab ${tabKey} for report ${reportId}:`, data);
    // You can implement partial save to API here
    // For now, this is a placeholder for tab-level save
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Report</h1>
        <p className="text-muted-foreground mt-2">{report.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportFormTabs
            report={report}
            onSubmit={async data => {
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
