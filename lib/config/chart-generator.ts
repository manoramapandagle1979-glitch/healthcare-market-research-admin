import type {
  DataSource,
  ChartMetadata,
  LogoConfig,
  ChartConfig,
} from '@/lib/types/chart-generator';

// Professional color palette (muted, market-research grade)
export const DEFAULT_CHART_COLORS = [
  '#5B8EBC', // Muted blue
  '#7FC9A0', // Soft green
  '#F4A261', // Warm orange
  '#E76F51', // Terracotta
  '#8E7CC3', // Lavender
  '#6A9FB5', // Steel blue
  '#C9ADA7', // Dusty rose
  '#9A8C98', // Mauve
];

// Data constraints
export const CHART_CONSTRAINTS = {
  MAX_ROWS: 20,
  MAX_SERIES: 8,
  MIN_ROWS: 2,
  MIN_SERIES: 1,
  TITLE_MAX_LENGTH: 100,
  SUBTITLE_MAX_LENGTH: 150,
  LABEL_MAX_LENGTH: 50,
  UNIT_SUFFIX_MAX_LENGTH: 20,
};

// Export resolutions
export const EXPORT_RESOLUTIONS = {
  standard: { width: 1200, height: 700 },
  highres: { width: 2400, height: 1400 },
};

// Logo constraints
export const LOGO_CONSTRAINTS = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ACCEPTED_FORMATS: ['image/png', 'image/svg+xml'],
  ACCEPTED_MIME_TYPES: ['image/png', 'image/svg+xml'],
};

// Sample demo data (healthcare market research example)
export const SAMPLE_DATA: DataSource = {
  labels: ['2020', '2021', '2022', '2023', '2024'],
  series: [
    {
      id: 'hardware',
      name: 'Medical Hardware',
      color: DEFAULT_CHART_COLORS[0],
      values: [2.3, 2.6, 2.9, 3.2, 3.5],
    },
    {
      id: 'software',
      name: 'Healthcare Software',
      color: DEFAULT_CHART_COLORS[1],
      values: [1.1, 1.3, 1.6, 1.9, 2.3],
    },
    {
      id: 'services',
      name: 'Medical Services',
      color: DEFAULT_CHART_COLORS[2],
      values: [0.7, 0.8, 0.9, 1.1, 1.3],
    },
  ],
};

// Default metadata
export const DEFAULT_METADATA: ChartMetadata = {
  title: 'Global Medical Device Market (USD Billion)',
  subtitle: 'Market size by segment, 2020-2024',
  xAxisLabel: 'Year',
  yAxisLabel: 'Revenue',
  unitSuffix: 'B',
  decimalPrecision: 1,
  showLegend: true,
  showGridlines: true,
};

// Default chart configuration
export const DEFAULT_CHART_CONFIG: ChartConfig = {
  chartType: 'bar',
  orientation: 'vertical',
  colorTheme: 'default',
};

// Default logo configuration
export const DEFAULT_LOGO_CONFIG: LogoConfig = {
  file: null,
  previewUrl: null,
  position: 'top-right',
  opacity: 80,
};
