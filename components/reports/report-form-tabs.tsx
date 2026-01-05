'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import type { ReportFormData, Report } from '@/lib/types/reports';
import { ReportDetailsTab } from './tabs/report-details-tab';
import { ContentTab } from './tabs/content-tab';
import { SettingsTab } from './tabs/settings-tab';

// Validation schema
const reportFormSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  summary: z.string().min(50, 'Summary must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  geography: z.array(z.string()).min(1, 'Select at least one geography'),
  publishDate: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  discountedPrice: z.number().min(0, 'Discounted price must be positive'),
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

export interface ReportFormTabsRef {
  fillWithSampleData: () => void;
}

interface ReportFormTabsProps {
  report?: Report;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  onPreview?: () => void;
  isSaving: boolean;
}

const getSampleData = (): ReportFormData => ({
  title: 'Global Telemedicine Market Research Report 2024-2031',
  slug: 'global-telemedicine-market-research-2024-2031',
  summary:
    'Comprehensive analysis of the global telemedicine market, covering market size, growth trends, key players, regional insights, and future opportunities. This report provides in-depth coverage of telemedicine adoption across healthcare sectors, technological advancements, regulatory landscape, and competitive dynamics shaping the industry through 2031.',
  category: 'Healthcare IT',
  geography: ['Global', 'North America', 'Europe', 'Asia Pacific'],
  publishDate: '',
  price: 3490,
  discountedPrice: 3090,
  status: 'draft',
  pageCount: 245,
  formats: ['PDF', 'Excel', 'Word'],
  marketMetrics: {
    currentRevenue: '87.4 Billion USD',
    currentYear: 2024,
    forecastRevenue: '286.2 Billion USD',
    forecastYear: 2031,
    cagr: '18.4%',
    cagrStartYear: 2024,
    cagrEndYear: 2031,
  },
  authorIds: [],
  keyPlayers: [
    { name: 'Teladoc Health', marketShare: '15.3%', rank: 1 },
    { name: 'American Well (Amwell)', marketShare: '12.7%', rank: 2 },
    { name: 'MDLive', marketShare: '9.2%', rank: 3 },
    { name: 'Doctor on Demand', marketShare: '7.8%', rank: 4 },
    { name: 'Grand Rounds', marketShare: '5.4%', rank: 5 },
  ],
  sections: {
    executiveSummary:
      '<h2>Executive Summary</h2><p>The global telemedicine market is experiencing unprecedented growth, driven by technological advancements, increasing healthcare costs, and the need for accessible remote healthcare services. Valued at $87.4 billion in 2024, the market is projected to reach $286.2 billion by 2031, growing at a CAGR of 18.4%.</p><p>Key factors driving this growth include widespread adoption of smartphones and high-speed internet, rising prevalence of chronic diseases, shortage of healthcare professionals in remote areas, and supportive government initiatives promoting digital health solutions.</p>',
    marketOverview:
      '<h2>Market Overview</h2><p>Telemedicine has evolved from a niche service to a mainstream healthcare delivery model, enabling patients to consult with healthcare providers remotely through video calls, phone consultations, and digital messaging platforms. The COVID-19 pandemic accelerated adoption rates by 5-7 years, normalizing virtual care across demographics.</p><p>The market encompasses various service types including teleconsultation, telemonitoring, teleradiology, telepathology, and telepsychiatry. Healthcare providers, payers, and patients increasingly recognize telemedicine as a cost-effective, convenient alternative to traditional in-person visits.</p>',
    marketSize:
      '<h2>Market Size and Growth</h2><p>The global telemedicine market was valued at $87.4 billion in 2024 and is projected to grow at a robust CAGR of 18.4% from 2024 to 2031, reaching $286.2 billion by 2031. North America currently dominates with a 42% market share, followed by Europe at 28% and Asia Pacific at 22%.</p><p>The teleconsultation segment represents the largest share at 38% of total market revenue, while telemonitoring is the fastest-growing segment with a projected CAGR of 21.3%. The enterprise/B2B segment accounts for 65% of revenue, while direct-to-consumer services comprise 35%.</p>',
    competitive:
      "<h2>Competitive Landscape</h2><p>The telemedicine market is highly competitive with presence of numerous global and regional players. Major companies are focusing on strategic partnerships, mergers and acquisitions, and technological innovations to strengthen their market position.</p><p>Teladoc Health leads the market with 15.3% share, followed by American Well at 12.7%. The market has seen significant M&A activity, including Teladoc's acquisition of Livongo for $18.5 billion and recent partnerships between tech giants like Amazon and traditional healthcare providers.</p>",
    keyPlayers:
      '<h2>Key Market Players</h2><ul><li><strong>Teladoc Health</strong> - Market leader with comprehensive virtual care platform serving 175+ countries</li><li><strong>American Well (Amwell)</strong> - Enterprise telehealth platform with strong hospital partnerships</li><li><strong>MDLive</strong> - Consumer-focused telemedicine services with insurance integration</li><li><strong>Doctor on Demand</strong> - On-demand video consultations with board-certified physicians</li><li><strong>Grand Rounds</strong> - Expert medical opinion and care navigation platform</li></ul>',
    regional:
      '<h2>Regional Analysis</h2><p><strong>North America</strong>: Leads global market with 42% share, driven by advanced healthcare infrastructure, high internet penetration, favorable reimbursement policies, and strong presence of major telemedicine providers.</p><p><strong>Europe</strong>: Second-largest market at 28% share, with UK, Germany, and France as key contributors. Growth driven by aging population and government support for digital health initiatives.</p><p><strong>Asia Pacific</strong>: Fastest-growing region with CAGR of 22.1%, led by China, India, and Japan. Rising smartphone adoption and government digital health programs driving expansion.</p>',
    trends:
      '<h2>Market Trends and Opportunities</h2><p><strong>AI and Machine Learning Integration</strong>: Advanced diagnostic tools and predictive analytics enhancing consultation quality and efficiency.</p><p><strong>Wearable Device Integration</strong>: Real-time patient monitoring through connected devices enabling proactive care management.</p><p><strong>Mental Health Focus</strong>: Telepsychiatry and virtual behavioral health services seeing explosive growth, particularly post-pandemic.</p><p><strong>Regulatory Evolution</strong>: Governments worldwide updating reimbursement policies and licensing requirements to support telemedicine expansion.</p>',
    conclusion:
      '<h2>Conclusion</h2><p>The global telemedicine market is poised for significant growth over the next decade, transforming healthcare delivery worldwide. While challenges around data privacy, regulatory harmonization, and digital literacy remain, the overall trajectory is overwhelmingly positive. Organizations that invest in user-friendly platforms, ensure data security, and build trust with patients and providers will be well-positioned to capture market share in this rapidly evolving landscape.</p>',
    marketDetails:
      '<h2>Market Segmentation Details</h2><p><strong>By Service Type:</strong></p><ul><li>Teleconsultation (38%)</li><li>Telemonitoring (26%)</li><li>Teleradiology (14%)</li><li>Telepathology (9%)</li><li>Others (13%)</li></ul><p><strong>By Delivery Mode:</strong></p><ul><li>Web/Mobile (72%)</li><li>Call Centers (28%)</li></ul><p><strong>By End User:</strong></p><ul><li>Patients (42%)</li><li>Healthcare Providers (38%)</li><li>Payers (20%)</li></ul>',
    keyFindings:
      '<h2>Key Research Findings</h2><ul><li>Market expected to grow from $87.4B (2024) to $286.2B (2031) at 18.4% CAGR</li><li>Teleconsultation dominates with 38% market share; telemonitoring fastest growing at 21.3% CAGR</li><li>North America leads with 42% share; Asia Pacific fastest-growing at 22.1% CAGR</li><li>COVID-19 accelerated adoption by 5-7 years across all demographics</li><li>Mental health services showing highest growth with 28% year-over-year increase</li><li>B2B segment comprises 65% of revenue vs. 35% B2C</li><li>Regulatory barriers decreasing with 37 US states achieving interstate licensure</li></ul>',
    tableOfContents:
      '<h2>Table of Contents</h2><ol><li>Executive Summary</li><li>Research Methodology</li><li>Market Overview<ul><li>Market Definition</li><li>Market Evolution</li><li>Value Chain Analysis</li></ul></li><li>Market Dynamics<ul><li>Drivers</li><li>Restraints</li><li>Opportunities</li><li>Challenges</li></ul></li><li>Market Segmentation<ul><li>By Service Type</li><li>By Delivery Mode</li><li>By End User</li><li>By Geography</li></ul></li><li>Competitive Landscape<ul><li>Market Share Analysis</li><li>Company Profiles</li><li>Strategic Developments</li></ul></li><li>Regional Analysis</li><li>Future Outlook and Opportunities</li><li>Appendix</li></ol>',
  },
  faqs: [
    {
      question: 'What is the projected market size for telemedicine by 2031?',
      answer:
        'The global telemedicine market is projected to reach $286.2 billion by 2031, growing from $87.4 billion in 2024 at a CAGR of 18.4%.',
    },
    {
      question: 'Which region dominates the telemedicine market?',
      answer:
        'North America currently dominates the telemedicine market with a 42% market share, driven by advanced infrastructure, favorable policies, and high adoption rates.',
    },
    {
      question: 'What are the main types of telemedicine services?',
      answer:
        'The main types include teleconsultation, telemonitoring, teleradiology, telepathology, and telepsychiatry, with teleconsultation being the largest segment.',
    },
    {
      question: 'Who are the leading players in the telemedicine market?',
      answer:
        'Leading players include Teladoc Health (15.3% market share), American Well/Amwell (12.7%), MDLive (9.2%), Doctor on Demand (7.8%), and Grand Rounds (5.4%).',
    },
  ],
  metadata: {
    metaTitle: 'Global Telemedicine Market Report 2024-2031 | $286.2B by 2031',
    metaDescription:
      'Comprehensive telemedicine market research covering size, growth, trends, and forecasts. Market projected to reach $286.2B by 2031 at 18.4% CAGR. Analysis of key players, regional insights, and opportunities.',
    keywords: [
      'telemedicine market',
      'telehealth',
      'virtual healthcare',
      'remote patient monitoring',
      'teleconsultation',
      'digital health',
      'healthcare IT',
    ],
    canonicalUrl: '',
    ogTitle: 'Global Telemedicine Market Research Report 2024-2031',
    ogDescription:
      'In-depth analysis of the $87.4B telemedicine market growing to $286.2B by 2031. Coverage of market trends, key players, regional analysis, and growth opportunities.',
    ogImage: '',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    schemaJson: '',
    robotsDirective: 'index, follow',
  },
});

export const ReportFormTabs = forwardRef<ReportFormTabsRef, ReportFormTabsProps>(
  function ReportFormTabs({ report, onSubmit, onSaveTab, onPreview, isSaving }, ref) {
    const [activeTab, setActiveTab] = useState('details');

    const form = useForm<ReportFormData>({
      resolver: zodResolver(reportFormSchema),
      defaultValues: report
        ? {
            title: report.title,
            slug: report.slug,
            summary: report.summary,
            category: report.category,
            geography: report.geography,
            publishDate: report.publishDate || '',
            price: report.price,
            discountedPrice: report.discountedPrice,
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
            slug: '',
            summary: '',
            category: '', // Will be set when categories are loaded
            geography: ['Global'],
            publishDate: '',
            price: 3490,
            discountedPrice: 3090,
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

    useImperativeHandle(ref, () => ({
      fillWithSampleData: () => {
        form.reset(getSampleData());
      },
    }));

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
            <SettingsTab
              form={form}
              onSubmit={onSubmit}
              onPreview={onPreview}
              isSaving={isSaving}
            />
          </TabsContent>
        </Tabs>
      </Form>
    );
  }
);
