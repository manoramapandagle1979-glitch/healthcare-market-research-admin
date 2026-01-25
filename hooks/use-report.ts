'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Report, ReportFormData } from '@/lib/types/reports';
import { fetchReportById, createReport, updateReport, deleteReport } from '@/lib/api/reports';

interface UseReportReturn {
  report: Report | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchReport: (id: number) => Promise<void>;
  saveReport: (id: string | null, data: ReportFormData) => Promise<Report | null>;
  removeReport: (id: string) => Promise<void>;
}

export function useReport(): UseReportReturn {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReport = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const { report } = await fetchReportById(id);
      setReport(report);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load report';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveReport = useCallback(
    async (id: string | null, data: ReportFormData): Promise<Report | null> => {
      try {
        setIsSaving(true);
        setError(null);

        const response = id ? await updateReport(id, data) : await createReport(data);

        setReport(response.report);
        toast.success(id ? 'Report updated successfully' : 'Report created successfully');

        // Navigate to edit page for new reports
        if (!id) {
          router.push(`/reports/${response.report.id}`);
        }

        return response.report;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save report';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [router]
  );

  const removeReport = useCallback(
    async (id: string) => {
      try {
        setIsSaving(true);
        await deleteReport(id);
        toast.success('Report deleted successfully');
        router.push('/reports');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete report';
        toast.error(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [router]
  );

  return {
    report,
    isLoading,
    isSaving,
    error,
    fetchReport,
    saveReport,
    removeReport,
  };
}
