import type {
  ChartMetadata,
  DataSource,
  ValidationResult,
  ValidationError,
} from '@/lib/types/chart-generator';
import { CHART_CONSTRAINTS } from '@/lib/config/chart-generator';

export function validateChartConfiguration(
  metadata: ChartMetadata,
  dataSource: DataSource
): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!metadata.title || !metadata.title.trim()) {
    errors.push({
      field: 'title',
      message: 'Chart title is required',
    });
  } else if (metadata.title.length > CHART_CONSTRAINTS.TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title must be at most ${CHART_CONSTRAINTS.TITLE_MAX_LENGTH} characters`,
    });
  }

  // Subtitle validation
  if (metadata.subtitle && metadata.subtitle.length > CHART_CONSTRAINTS.SUBTITLE_MAX_LENGTH) {
    errors.push({
      field: 'subtitle',
      message: `Subtitle must be at most ${CHART_CONSTRAINTS.SUBTITLE_MAX_LENGTH} characters`,
    });
  }

  // Data source validation - minimum rows
  if (!dataSource.labels || dataSource.labels.length < CHART_CONSTRAINTS.MIN_ROWS) {
    errors.push({
      field: 'dataSource',
      message: `At least ${CHART_CONSTRAINTS.MIN_ROWS} data rows are required`,
    });
  }

  // Data source validation - maximum rows
  if (dataSource.labels && dataSource.labels.length > CHART_CONSTRAINTS.MAX_ROWS) {
    errors.push({
      field: 'dataSource',
      message: `Maximum ${CHART_CONSTRAINTS.MAX_ROWS} data rows allowed`,
    });
  }

  // Data source validation - minimum series
  if (!dataSource.series || dataSource.series.length < CHART_CONSTRAINTS.MIN_SERIES) {
    errors.push({
      field: 'dataSource',
      message: `At least ${CHART_CONSTRAINTS.MIN_SERIES} data series is required`,
    });
  }

  // Data source validation - maximum series
  if (dataSource.series && dataSource.series.length > CHART_CONSTRAINTS.MAX_SERIES) {
    errors.push({
      field: 'dataSource',
      message: `Maximum ${CHART_CONSTRAINTS.MAX_SERIES} data series allowed`,
    });
  }

  // Data source validation - labels match series values length
  if (dataSource.labels && dataSource.series) {
    const labelsLength = dataSource.labels.length;
    dataSource.series.forEach(series => {
      if (series.values.length !== labelsLength) {
        errors.push({
          field: 'dataSource',
          message: `Series "${series.name}" has ${series.values.length} values, but ${labelsLength} labels exist. They must match.`,
        });
      }
    });
  }

  // Data source validation - all values must be valid numbers
  if (dataSource.series) {
    dataSource.series.forEach(series => {
      const hasInvalidValues = series.values.some(val => typeof val !== 'number' || isNaN(val));
      if (hasInvalidValues) {
        errors.push({
          field: 'dataSource',
          message: `Series "${series.name}" contains invalid numeric values`,
        });
      }
    });
  }

  // Data source validation - empty labels
  if (dataSource.labels) {
    const hasEmptyLabels = dataSource.labels.some(label => !label || !label.trim());
    if (hasEmptyLabels) {
      errors.push({
        field: 'dataSource',
        message: 'All category labels must be non-empty',
      });
    }
  }

  // Data source validation - empty series names
  if (dataSource.series) {
    const hasEmptySeriesNames = dataSource.series.some(
      series => !series.name || !series.name.trim()
    );
    if (hasEmptySeriesNames) {
      errors.push({
        field: 'dataSource',
        message: 'All series must have a name',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLogoFile(file: File): { isValid: boolean; error?: string } {
  // File size validation
  if (file.size > 2 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'Logo file size must not exceed 2MB',
    };
  }

  // File type validation
  const validTypes = ['image/png', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only PNG and SVG formats are supported',
    };
  }

  return { isValid: true };
}
