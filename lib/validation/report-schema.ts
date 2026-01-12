/**
 * Report Validation Schema
 *
 * This schema aligns with backend validation requirements from:
 * - internal/domain/report/report.go
 * - internal/handler/report_handler.go
 *
 * MANDATORY FIELDS (Required when adding a report):
 * 1. title (string) - Minimum 10 characters
 * 2. slug (string) - Unique identifier for URLs
 * 3. category_id (number) - Must reference a valid category ID
 * 4. summary (string) - Minimum 50 characters
 * 5. geography ([]string) - At least one geography required
 * 6. sections (ReportSections object) - All report content sections
 *
 * AUTO-MANAGED FIELDS (NOT allowed in form data):
 * - id - Auto-generated primary key
 * - created_by - Auto-set from authenticated user on creation
 * - updated_by - Auto-set from authenticated user on updates
 * - created_at - Auto-managed timestamp
 * - updated_at - Auto-managed timestamp
 * - view_count - Managed by view tracking
 * - download_count - Managed by download tracking
 * - publish_date - Auto-set when status changes to "published"
 */

import { z } from 'zod';

// Key Player validation
export const keyPlayerSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  marketShare: z.string().optional(),
  description: z.string().optional(),
});

// FAQ validation
export const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
});

// Chart validation
export const reportChartDataSeriesSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Series name is required'),
  color: z.string(),
  values: z.array(z.number()),
});

export const reportChartDataSchema = z.object({
  labels: z.array(z.string()).min(1, 'At least one label is required'),
  series: z.array(reportChartDataSeriesSchema).min(1, 'At least one series is required'),
});

export const reportChartSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Chart name is required'),
  chartType: z.enum(['bar', 'stacked-bar', 'pie', 'donut', 'world-map']),
  orientation: z.enum(['vertical', 'horizontal']).optional(),
  title: z.string().min(1, 'Chart title is required'),
  subtitle: z.string().optional(),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
  unitSuffix: z.string().optional(),
  decimalPrecision: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  showLegend: z.boolean(),
  showGridlines: z.boolean(),
  data: reportChartDataSchema,
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Table of Contents validation
export const tocSubsectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Subsection title is required'),
  pageNumber: z.string().optional(),
});

export const tocSectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  pageNumber: z.string().optional(),
  subsections: z.array(tocSubsectionSchema),
});

export const tocChapterSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Chapter title is required'),
  pageNumber: z.string().optional(),
  sections: z.array(tocSectionSchema),
});

export const tableOfContentsSchema = z.object({
  chapters: z.array(tocChapterSchema).min(1, 'At least one chapter is required'),
});

// Market Metrics validation (all optional)
export const marketMetricsSchema = z
  .object({
    currentRevenue: z.string().optional(),
    currentYear: z.number().optional(),
    forecastRevenue: z.string().optional(),
    forecastYear: z.number().optional(),
    cagr: z.string().optional(),
    cagrStartYear: z.number().optional(),
    cagrEndYear: z.number().optional(),
  })
  .optional();

// Report Metadata (SEO) validation (all optional)
export const reportMetadataSchema = z.object({
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
});

// Report Sections validation
// All sections are required as per backend validation
export const reportSectionsSchema = z.object({
  executiveSummary: z.string().min(100, 'Executive summary is required (min 100 chars)'),
  marketOverview: z.string().min(100, 'Market overview is required (min 100 chars)'),
  marketSize: z.string().min(100, 'Market size is required (min 100 chars)'),
  competitive: z.string().min(100, 'Competitive analysis is required (min 100 chars)'),
  keyPlayers: z.string().min(1, 'Key players section is required'),
  regional: z.string().min(1, 'Regional analysis is required'),
  trends: z.string().min(1, 'Trends section is required'),
  conclusion: z.string().min(50, 'Conclusion is required (min 50 chars)'),
  marketDetails: z.string().min(100, 'Market details is required (min 100 chars)'),
  keyFindings: z
    .array(z.string().min(10, 'Each key finding must be at least 10 characters'))
    .min(1, 'At least one key finding is required'),
  tableOfContents: tableOfContentsSchema, // Structured TOC validation
  marketDrivers: z.string().optional(), // Optional market drivers
  challenges: z.string().optional(), // Optional challenges
});

// Main Report Form Schema
export const reportFormSchema = z.object({
  // ============ MANDATORY FIELDS ============
  title: z.string().min(10, 'Title must be at least 10 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  summary: z.string().min(50, 'Summary must be at least 50 characters'),
  category_id: z.number().min(1, 'Category is required'),
  geography: z.array(z.string()).min(1, 'Select at least one geography'),
  sections: reportSectionsSchema,

  // ============ OPTIONAL FIELDS ============

  // Basic Info
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),

  // Pricing (defaults to 0 if not provided)
  price: z.number().min(0, 'Price must be positive').optional(),
  discountedPrice: z.number().min(0, 'Discounted price must be positive').optional(),
  currency: z.string().optional(),

  // Report Details
  pageCount: z.number().min(0, 'Page count must be positive').optional(),
  formats: z.array(z.enum(['PDF', 'Excel', 'Word', 'PowerPoint'])).optional(),

  // Status & Publishing (defaults to "draft")
  status: z.enum(['draft', 'published']).optional(),
  publishDate: z.string().optional(),
  isFeatured: z.boolean().optional(),

  // Authors & Contributors
  authorIds: z.array(z.string()).optional(),

  // Market Data
  marketMetrics: marketMetricsSchema,
  keyPlayers: z.array(keyPlayerSchema).optional(),

  // FAQs & Metadata
  faqs: z.array(faqSchema).optional(),
  metadata: reportMetadataSchema,

  // Charts
  charts: z.array(reportChartSchema).optional(),

  // Admin Notes
  internalNotes: z.string().optional(),
});

// Type inference from schema
export type ReportFormSchemaType = z.infer<typeof reportFormSchema>;
