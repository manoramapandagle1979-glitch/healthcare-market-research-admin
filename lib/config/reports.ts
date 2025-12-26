import type { ReportSectionMeta } from '@/lib/types/reports';

// Section metadata for rendering
export const REPORT_SECTIONS: ReportSectionMeta[] = [
  {
    key: 'executiveSummary',
    label: 'Executive Summary',
    placeholder: 'Provide a high-level overview of the report findings...',
    required: true,
  },
  {
    key: 'marketOverview',
    label: 'Market Overview',
    placeholder: 'Describe the overall market landscape...',
    required: true,
  },
  {
    key: 'marketSize',
    label: 'Market Size & Forecast',
    placeholder: 'Detail market size, growth rates, and forecasts...',
    required: true,
  },
  {
    key: 'competitive',
    label: 'Competitive Landscape',
    placeholder: 'Analyze competitive dynamics and market structure...',
    required: true,
  },
  {
    key: 'keyPlayers',
    label: 'Key Players',
    placeholder: 'Profile major companies and market participants...',
    required: false,
  },
  {
    key: 'regional',
    label: 'Regional Analysis',
    placeholder: 'Break down market by geographic regions...',
    required: false,
  },
  {
    key: 'trends',
    label: 'Trends & Opportunities',
    placeholder: 'Identify emerging trends and growth opportunities...',
    required: false,
  },
  {
    key: 'conclusion',
    label: 'Conclusion',
    placeholder: 'Summarize key findings and recommendations...',
    required: true,
  },
];

// Categories (expand as needed)
export const REPORT_CATEGORIES = [
  'Pharmaceuticals',
  'Medical Devices',
  'Healthcare IT',
  'Biotechnology',
  'Diagnostics',
  'Telemedicine',
  'Digital Health',
  'Clinical Research',
  'Other',
] as const;

// Geographies
export const GEOGRAPHIES = [
  'North America',
  'Europe',
  'Asia Pacific',
  'Latin America',
  'Middle East & Africa',
  'Global',
] as const;

// Pagination defaults
export const REPORTS_PER_PAGE = 10;
export const MAX_REPORTS_PER_PAGE = 50;
