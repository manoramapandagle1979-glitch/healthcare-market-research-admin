import type { EChartsOption } from 'echarts';
import type {
  ChartType,
  ChartOrientation,
  ChartMetadata,
  DataSource,
  LogoConfig,
} from '@/lib/types/chart-generator';

interface ChartBuilderConfig {
  chartType: ChartType;
  orientation: ChartOrientation;
  metadata: ChartMetadata;
  dataSource: DataSource;
  logo: LogoConfig;
}

export function buildEChartsConfig(config: ChartBuilderConfig): EChartsOption {
  const { chartType, orientation, metadata, dataSource, logo } = config;

  // Base configuration
  const baseConfig: EChartsOption = {
    backgroundColor: '#ffffff',
    title: {
      text: metadata.title,
      subtext: metadata.subtitle,
      left: 40,
      top: 20,
      textStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      subtextStyle: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    },
    tooltip: {
      trigger: chartType === 'pie' ? 'item' : 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#1a1a1a',
        fontSize: 13,
      },
      formatter:
        chartType === 'pie' ? '{b}: {c}' + (metadata.unitSuffix || '') + ' ({d}%)' : undefined,
    },
    legend: metadata.showLegend
      ? {
          show: true,
          bottom: 10,
          left: 'center',
          itemGap: 20,
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            fontSize: 12,
            color: '#4b5563',
          },
        }
      : { show: false },
  };

  // Add grid configuration for bar charts
  if (chartType !== 'pie') {
    baseConfig.grid = {
      left: '10%',
      right: '10%',
      bottom: metadata.showLegend ? '12%' : '8%',
      top: metadata.subtitle ? '20%' : '15%',
      containLabel: true,
    };

    // X-axis configuration
    if (orientation === 'vertical') {
      baseConfig.xAxis = {
        type: 'category',
        data: dataSource.labels,
        name: metadata.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500,
        },
        axisLine: {
          lineStyle: {
            color: '#d1d5db',
          },
        },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
        },
        splitLine: {
          show: false,
        },
      };

      baseConfig.yAxis = {
        type: 'value',
        name: metadata.yAxisLabel,
        nameTextStyle: {
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500,
        },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
          formatter: (value: number) => {
            const formatted = Number(value.toFixed(metadata.decimalPrecision));
            return formatted + (metadata.unitSuffix || '');
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db',
          },
        },
        splitLine: {
          show: metadata.showGridlines,
          lineStyle: {
            color: '#e5e7eb',
            type: 'dashed',
          },
        },
      };
    } else {
      // Horizontal orientation
      baseConfig.xAxis = {
        type: 'value',
        name: metadata.xAxisLabel,
        nameTextStyle: {
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500,
        },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
          formatter: (value: number) => {
            const formatted = Number(value.toFixed(metadata.decimalPrecision));
            return formatted + (metadata.unitSuffix || '');
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db',
          },
        },
        splitLine: {
          show: metadata.showGridlines,
          lineStyle: {
            color: '#e5e7eb',
            type: 'dashed',
          },
        },
      };

      baseConfig.yAxis = {
        type: 'category',
        data: dataSource.labels,
        name: metadata.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 80,
        nameTextStyle: {
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500,
        },
        axisLine: {
          lineStyle: {
            color: '#d1d5db',
          },
        },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
        },
        splitLine: {
          show: false,
        },
      };
    }
  } else {
    // Explicitly clear axis and grid for pie charts to prevent collision
    baseConfig.grid = undefined;
    baseConfig.xAxis = undefined;
    baseConfig.yAxis = undefined;
  }

  // Build series configuration
  baseConfig.series = buildSeriesConfig(chartType, orientation, dataSource, metadata);

  // Add logo graphic if logo exists
  if (logo.previewUrl) {
    baseConfig.graphic = buildLogoGraphic(logo);
  }

  return baseConfig;
}

function buildSeriesConfig(
  chartType: ChartType,
  orientation: ChartOrientation,
  dataSource: DataSource,
  metadata: ChartMetadata
): EChartsOption['series'] {
  if (chartType === 'pie') {
    // Pie chart series
    const pieData =
      dataSource.series.length > 0
        ? dataSource.series[0].values.map((val, idx) => ({
            value: Number(val.toFixed(metadata.decimalPrecision)),
            name: dataSource.labels[idx],
            itemStyle: {
              color: dataSource.series[0]?.color || '#5B8EBC',
            },
          }))
        : [];

    // If multiple series for pie chart, use first series data with all series colors
    if (dataSource.series.length > 1) {
      // Aggregate all series for pie chart
      const aggregatedData = dataSource.labels.map((label, labelIdx) => {
        const totalValue = dataSource.series.reduce(
          (sum, series) => sum + (series.values[labelIdx] || 0),
          0
        );
        return {
          value: Number(totalValue.toFixed(metadata.decimalPrecision)),
          name: label,
        };
      });

      return [
        {
          type: 'pie',
          radius: ['0%', '65%'],
          center: ['50%', '55%'],
          data: aggregatedData,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c}' + (metadata.unitSuffix || '') + ' ({d}%)',
            fontSize: 12,
            color: '#4b5563',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
      ];
    }

    return [
      {
        type: 'pie',
        radius: ['0%', '65%'],
        center: ['50%', '55%'],
        data: pieData,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {c}' + (metadata.unitSuffix || '') + ' ({d}%)',
          fontSize: 12,
          color: '#4b5563',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
      },
    ];
  }

  // Bar chart series (stacked or regular)
  return dataSource.series.map(series => ({
    name: series.name,
    type: 'bar',
    data: series.values.map(val => Number(val.toFixed(metadata.decimalPrecision))),
    stack: chartType === 'stacked-bar' ? 'total' : undefined,
    itemStyle: {
      color: series.color,
      borderRadius: orientation === 'vertical' ? [5, 5, 0, 0] : [0, 5, 5, 0],
    },
    label: {
      show: false,
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
    barMaxWidth: 60,
  }));
}

function buildLogoGraphic(logo: LogoConfig): EChartsOption['graphic'] {
  const positions = {
    'top-left': { left: 20, top: 20 },
    'top-right': { right: 20, top: 20 },
    'bottom-right': { right: 20, bottom: 20 },
  };

  return {
    type: 'image',
    ...positions[logo.position],
    style: {
      image: logo.previewUrl || '',
      width: 100,
      height: 40,
      opacity: logo.opacity / 100,
    },
    z: 100,
  };
}
