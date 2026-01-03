'use client';

import { ReportFormTabs } from '@/components/reports/report-form-tabs';
import { useReport } from '@/hooks/use-report';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { ReportFormData } from '@/lib/types/reports';
import { toast } from 'sonner';

export default function CreateReportPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { saveReport, isSaving } = useReport();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const formDataRef = useRef<Partial<ReportFormData>>({});

  // Role check
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'editor') {
      router.push('/reports');
    }
  }, [user, router]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const performSave = useCallback(
    async (data: Partial<ReportFormData>, showToast = false) => {
      try {
        // Merge with existing form data
        const mergedData = { ...formDataRef.current, ...data };

        // For new reports, we need to ensure we have minimum required fields
        // If this is the first save, create as draft with minimal data
        const saveData: ReportFormData = {
          title: mergedData.title || 'Untitled Report (Draft)',
          summary: mergedData.summary || 'Draft in progress',
          category: mergedData.category || 'Pharmaceuticals',
          geography: mergedData.geography || ['Global'],
          price: mergedData.price || 0,
          discountedPrice: mergedData.discountedPrice || 0,
          accessType: mergedData.accessType || 'free',
          status: 'draft', // Always save as draft
          pageCount: mergedData.pageCount,
          formats: mergedData.formats || [],
          marketMetrics: mergedData.marketMetrics,
          authorIds: mergedData.authorIds || [],
          keyPlayers: mergedData.keyPlayers || [],
          sections: mergedData.sections || {
            executiveSummary: '',
            marketOverview: '',
            marketSize: '',
            competitive: '',
            keyPlayers: '',
            regional: '',
            trends: '',
            conclusion: '',
            marketDetails: '',
            keyFindings: '',
            tableOfContents: '',
          },
          faqs: mergedData.faqs || [],
          metadata: mergedData.metadata || {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            canonicalUrl: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            ogType: 'article',
            twitterCard: 'summary_large_image',
            schemaJson: '',
            robotsDirective: 'index, follow',
          },
          publishDate: mergedData.publishDate,
        };

        const result = await saveReport(createdReportId, saveData);

        if (result) {
          // If this was the first save, store the report ID for subsequent saves
          if (!createdReportId) {
            setCreatedReportId(result.id);
          }

          setLastSaved(new Date());
          formDataRef.current = mergedData;

          if (showToast) {
            toast.success('Draft saved successfully');
          }
        }
      } catch (error) {
        console.error('Error saving draft:', error);
        if (showToast) {
          toast.error('Failed to save draft');
        }
      }
    },
    [saveReport, createdReportId]
  );

  const handleSaveTab = async (tabKey: string, data: Partial<ReportFormData>) => {
    // Manual save when user clicks "Save Draft" button
    await performSave(data, true);
  };

  const scheduleAutoSave = useCallback(
    (data: Partial<ReportFormData>) => {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Schedule auto-save after 3 seconds of inactivity
      autoSaveTimerRef.current = setTimeout(() => {
        performSave(data, false);
      }, 3000);
    },
    [performSave]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Report</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create a new market research report
          </p>
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

      <ReportFormTabs
        onSubmit={async data => {
          // Final submit - save as published or draft based on form data
          const finalData = { ...formDataRef.current, ...data };
          await saveReport(createdReportId, finalData as ReportFormData);
        }}
        onSaveTab={handleSaveTab}
        onAutoSave={scheduleAutoSave}
        isSaving={isSaving}
      />
    </div>
  );
}
