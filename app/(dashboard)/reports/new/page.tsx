'use client';

import { ReportFormTabs } from '@/components/reports/report-form-tabs';
import { useReport } from '@/hooks/use-report';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReportFormData } from '@/lib/types/reports';

export default function CreateReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { saveReport, isSaving } = useReport();

  // Role check
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'editor') {
      router.push('/reports');
    }
  }, [user, router]);

  const handleSaveTab = async (tabKey: string, data: Partial<ReportFormData>) => {
    // Save individual tab data as draft
    console.log(`Saving tab ${tabKey}:`, data);
    // You can implement partial save to localStorage or API here
    // For now, this is a placeholder for tab-level save
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Report</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new market research report
        </p>
      </div>

      <ReportFormTabs
        onSubmit={async data => {
          await saveReport(null, data);
        }}
        onSaveTab={handleSaveTab}
        isSaving={isSaving}
      />
    </div>
  );
}
