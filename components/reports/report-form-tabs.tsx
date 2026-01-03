'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import type { ReportFormData, Report } from '@/lib/types/reports';
import { ReportDetailsTab } from './tabs/report-details-tab';
import { ContentTab } from './tabs/content-tab';
import { SettingsTab } from './tabs/settings-tab';
import { REPORT_CATEGORIES } from '@/lib/config/reports';

// Validation schema
const reportFormSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  summary: z.string().min(50, 'Summary must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  geography: z.array(z.string()).min(1, 'Select at least one geography'),
  publishDate: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  discountedPrice: z.number().min(0, 'Discounted price must be positive'),
  accessType: z.enum(['free', 'paid']),
  status: z.enum(['draft', 'published']),
  pageCount: z.number().min(1, 'Page count must be at least 1').optional(),
  formats: z.array(z.enum(['PDF', 'Excel', 'Word', 'PowerPoint'])).optional(),
  marketMetrics: z
    .object({
      currentRevenue: z.string().optional(),
      currentYear: z.number().optional(),
      forecastRevenue: z.string().optional(),
      forecastYear: z.number().optional(),
      cagr: z.string().optional(),
      cagrStartYear: z.number().optional(),
      cagrEndYear: z.number().optional(),
    })
    .optional(),
  authorIds: z.array(z.string()).optional(),
  keyPlayers: z
    .array(
      z.object({
        name: z.string().min(2, 'Company name must be at least 2 characters'),
        marketShare: z.string().optional(),
        rank: z.number().optional(),
      })
    )
    .optional(),
  sections: z.object({
    executiveSummary: z.string().min(100, 'Executive summary is required (min 100 chars)'),
    marketOverview: z.string().min(100, 'Market overview is required (min 100 chars)'),
    marketSize: z.string().min(100, 'Market size is required (min 100 chars)'),
    competitive: z.string().min(100, 'Competitive analysis is required (min 100 chars)'),
    keyPlayers: z.string(),
    regional: z.string(),
    trends: z.string(),
    conclusion: z.string().min(50, 'Conclusion is required (min 50 chars)'),
    marketDetails: z.string().min(100, 'Market details is required (min 100 chars)'),
    keyFindings: z.string().min(100, 'Key findings is required (min 100 chars)'),
    tableOfContents: z.string().min(50, 'Table of contents is required (min 50 chars)'),
  }),
  faqs: z
    .array(
      z.object({
        question: z.string().min(5, 'Question must be at least 5 characters'),
        answer: z.string().min(10, 'Answer must be at least 10 characters'),
      })
    )
    .optional(),
  metadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional().or(z.literal('')),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().url().optional().or(z.literal('')),
    ogType: z.string().optional(),
    twitterCard: z.string().optional(),
    schemaJson: z.string().optional(),
    robotsDirective: z.string().optional(),
  }),
});

interface ReportFormTabsProps {
  report?: Report;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  onAutoSave?: (data: Partial<ReportFormData>) => void;
  onPreview?: () => void;
  isSaving: boolean;
}

export function ReportFormTabs({
  report,
  onSubmit,
  onSaveTab,
  onAutoSave,
  onPreview,
  isSaving,
}: ReportFormTabsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const isInitialMount = useRef(true);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: report
      ? {
          title: report.title,
          summary: report.summary,
          category: report.category,
          geography: report.geography,
          publishDate: report.publishDate || '',
          price: report.price,
          discountedPrice: report.discountedPrice,
          accessType: report.accessType,
          status: report.status,
          pageCount: report.pageCount,
          formats: report.formats || [],
          marketMetrics: report.marketMetrics || {},
          authorIds: report.authorIds || [],
          keyPlayers: report.keyPlayers || [],
          sections: report.sections,
          faqs: report.faqs || [],
          metadata: report.metadata,
        }
      : {
          title: '',
          summary: '',
          category: REPORT_CATEGORIES[0],
          geography: ['Global'],
          publishDate: '',
          price: 3490,
          discountedPrice: 3090,
          accessType: 'free',
          status: 'draft',
          pageCount: undefined,
          formats: [],
          marketMetrics: {
            currentRevenue: '',
            currentYear: new Date().getFullYear(),
            forecastRevenue: '',
            forecastYear: new Date().getFullYear() + 7,
            cagr: '',
            cagrStartYear: new Date().getFullYear(),
            cagrEndYear: new Date().getFullYear() + 7,
          },
          authorIds: [],
          keyPlayers: [],
          sections: {
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
          faqs: [],
          metadata: {
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
        },
  });

  // Auto-save functionality
  useEffect(() => {
    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Watch for form changes and trigger auto-save
    if (onAutoSave) {
      const subscription = form.watch(value => {
        onAutoSave(value as Partial<ReportFormData>);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, onAutoSave]);

  return (
    <Form {...form}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="details">Report Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ReportDetailsTab form={form} onSaveTab={onSaveTab} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab form={form} onSaveTab={onSaveTab} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab form={form} onSubmit={onSubmit} onPreview={onPreview} isSaving={isSaving} />
        </TabsContent>
      </Tabs>
    </Form>
  );
}
