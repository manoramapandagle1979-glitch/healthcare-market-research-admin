'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import type { ReportFormData, Report } from '@/lib/types/reports';
import { ReportDetailsTab } from './tabs/report-details-tab';
import { ContentTab } from './tabs/content-tab';
import { SettingsTab } from './tabs/settings-tab';
import { ChartsTab } from './tabs/charts-tab';
import { reportFormSchema, type ReportFormSchemaType } from '@/lib/validation/report-schema';

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
  description:
    'This comprehensive market research report analyzes the global telemedicine industry, providing detailed insights into market dynamics, competitive landscape, technological trends, and regional opportunities from 2024 to 2031.',
  category_id: 1, // Will need to be set based on available categories
  geography: ['Global', 'North America', 'Europe', 'Asia Pacific'],
  price: 3490,
  discountedPrice: 3090,
  currency: 'USD',
  status: 'draft',
  pageCount: 245,
  formats: ['PDF', 'Excel', 'Word'],
  thumbnailUrl: '',
  isFeatured: false,
  internalNotes: '',
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
    { name: 'Teladoc Health', marketShare: '15.3%' },
    { name: 'American Well (Amwell)', marketShare: '12.7%' },
    { name: 'MDLive', marketShare: '9.2%' },
    { name: 'Doctor on Demand', marketShare: '7.8%' },
    { name: 'Grand Rounds', marketShare: '5.4%' },
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
      '<p><strong>By Service Type:</strong></p><ul><li>Teleconsultation (38%)</li><li>Telemonitoring (26%)</li><li>Teleradiology (14%)</li><li>Telepathology (9%)</li><li>Others (13%)</li></ul><p><strong>By Delivery Mode:</strong></p><ul><li>Web/Mobile (72%)</li><li>Call Centers (28%)</li></ul><p><strong>By End User:</strong></p><ul><li>Patients (42%)</li><li>Healthcare Providers (38%)</li><li>Payers (20%)</li></ul>',
    keyFindings: [
      'Market expected to grow from $87.4B (2024) to $286.2B (2031) at 18.4% CAGR',
      'Teleconsultation dominates with 38% market share; telemonitoring fastest growing at 21.3% CAGR',
      'North America leads with 42% share; Asia Pacific fastest-growing at 22.1% CAGR',
      'COVID-19 accelerated adoption by 5-7 years across all demographics',
      'Mental health services showing highest growth with 28% year-over-year increase',
      'B2B segment comprises 65% of revenue vs. 35% B2C',
      'Regulatory barriers decreasing with 37 US states achieving interstate licensure',
    ],
    tableOfContents: {
      chapters: [
        {
          id: 'chapter-1',
          title: 'Preface',
          sections: [
            { id: 'section-1-1', title: 'Report Description and Scope', subsections: [] },
            { id: 'section-1-2', title: 'Research Scope', subsections: [] },
            {
              id: 'section-1-3',
              title: 'Research Methodology',
              subsections: [
                { id: 'subsection-1-3-1', title: 'Market Research Type' },
                { id: 'subsection-1-3-2', title: 'Market Research Methodology' },
              ],
            },
          ],
        },
        {
          id: 'chapter-2',
          title: 'Executive Summary',
          sections: [],
        },
        {
          id: 'chapter-3',
          title: 'Market Overview',
          sections: [
            { id: 'section-3-1', title: 'Market Definition', subsections: [] },
            { id: 'section-3-2', title: 'Market Evolution', subsections: [] },
            { id: 'section-3-3', title: 'Value Chain Analysis', subsections: [] },
          ],
        },
        {
          id: 'chapter-4',
          title: 'Market Dynamics',
          sections: [
            { id: 'section-4-1', title: 'Drivers', subsections: [] },
            { id: 'section-4-2', title: 'Restraints', subsections: [] },
            { id: 'section-4-3', title: 'Opportunities', subsections: [] },
            { id: 'section-4-4', title: 'Challenges', subsections: [] },
          ],
        },
        {
          id: 'chapter-5',
          title: 'Market Segmentation',
          sections: [
            { id: 'section-5-1', title: 'By Service Type', subsections: [] },
            { id: 'section-5-2', title: 'By Delivery Mode', subsections: [] },
            { id: 'section-5-3', title: 'By End User', subsections: [] },
            { id: 'section-5-4', title: 'By Geography', subsections: [] },
          ],
        },
        {
          id: 'chapter-6',
          title: 'Competitive Landscape',
          sections: [
            { id: 'section-6-1', title: 'Market Share Analysis', subsections: [] },
            { id: 'section-6-2', title: 'Company Profiles', subsections: [] },
            { id: 'section-6-3', title: 'Strategic Developments', subsections: [] },
          ],
        },
        {
          id: 'chapter-7',
          title: 'Regional Analysis',
          sections: [],
        },
        {
          id: 'chapter-8',
          title: 'Future Outlook and Opportunities',
          sections: [],
        },
        {
          id: 'chapter-9',
          title: 'Appendix',
          sections: [],
        },
      ],
    },
    marketDrivers:
      '<h2>Market Drivers</h2><ul><li><strong>Technological Advancements</strong>: High-speed internet, 5G networks, and advanced video conferencing capabilities enabling seamless virtual consultations</li><li><strong>Healthcare Access</strong>: Addressing shortage of healthcare professionals in rural and underserved areas through remote care delivery</li><li><strong>Cost Reduction</strong>: Lower consultation costs, reduced hospital readmissions, and decreased travel expenses for patients</li><li><strong>Chronic Disease Management</strong>: Rising prevalence of chronic conditions requiring continuous monitoring and follow-up care</li><li><strong>Regulatory Support</strong>: Government initiatives, favorable reimbursement policies, and relaxed licensing requirements</li></ul>',
    challenges:
      '<h2>Market Challenges</h2><ul><li><strong>Data Privacy and Security</strong>: Concerns over patient data protection, HIPAA compliance, and cybersecurity threats</li><li><strong>Regulatory Complexity</strong>: Varying regulations across states and countries creating barriers to cross-border telemedicine</li><li><strong>Digital Divide</strong>: Limited internet access and digital literacy in certain demographics and regions</li><li><strong>Reimbursement Issues</strong>: Inconsistent insurance coverage and reimbursement policies across providers and regions</li><li><strong>Technology Adoption</strong>: Resistance from traditional healthcare providers and patients accustomed to in-person care</li></ul>',
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

    const form = useForm<ReportFormSchemaType>({
      resolver: zodResolver(reportFormSchema),
      defaultValues: report
        ? {
            title: report.title,
            slug: report.slug,
            summary: report.summary,
            description: report.description,
            category_id: report.categoryId || 0,
            geography: report.geography,
            publishDate: report.publishDate ? report.publishDate.split('T')[0] : '',
            price: report.price,
            discountedPrice: report.discountedPrice,
            currency: report.currency,
            status: report.status,
            pageCount: report.pageCount,
            formats: report.formats || [],
            marketMetrics: report.marketMetrics || {},
            authorIds: report.authorIds || [],
            keyPlayers: report.keyPlayers || [],
            sections: report.sections,
            faqs: report.faqs || [],
            metadata: report.metadata,
            thumbnailUrl: report.thumbnailUrl,
            isFeatured: report.isFeatured,
            internalNotes: report.internalNotes,
            charts: [],
          }
        : {
            title: '',
            slug: '',
            summary: '',
            description: '',
            category_id: 0, // Will be set when categories are loaded
            geography: ['Global'],
            publishDate: new Date().toISOString().split('T')[0],
            price: 3490,
            discountedPrice: 3090,
            currency: 'USD',
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
              keyFindings: [],
              tableOfContents: { chapters: [] },
              marketDrivers: '',
              challenges: '',
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
            thumbnailUrl: '',
            isFeatured: false,
            internalNotes: '',
            charts: [],
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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="details">Report Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ReportDetailsTab form={form} onSaveTab={onSaveTab} isSaving={isSaving} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab form={form} onSaveTab={onSaveTab} isSaving={isSaving} />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab form={form} onSaveTab={onSaveTab} isSaving={isSaving} />
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
