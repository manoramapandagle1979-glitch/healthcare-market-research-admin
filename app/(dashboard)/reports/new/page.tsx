'use client';

import { ReportForm } from '@/components/reports/report-form';
import { useReport } from '@/hooks/use-report';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Report</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new market research report
        </p>
      </div>

      <ReportForm
        onSubmit={async data => {
          await saveReport(null, data);
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
