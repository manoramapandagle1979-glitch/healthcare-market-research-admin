'use client';

import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type ReactEChartsCore from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReportChart } from '@/lib/types/reports';
import { buildEChartsConfig } from '@/lib/utils/chart-builder';
import worldMapData from '@/lib/data/world-map.json';
import type { DataSource } from '@/lib/types/chart-generator';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
}) as typeof ReactEChartsCore;

// Register world map
if (typeof window !== 'undefined') {
  try {
    echarts.registerMap('world', worldMapData as Parameters<typeof echarts.registerMap>[1]);
  } catch (error) {
    console.error('Failed to register world map:', error);
  }
}

export interface SimpleChartPreviewRef {
  getChartInstance: () => ReactEChartsCore | null;
  getExportContainer: () => HTMLDivElement | null;
}

interface SimpleChartPreviewProps {
  chart: ReportChart;
  width?: number;
  height?: number;
}

export const SimpleChartPreview = forwardRef<SimpleChartPreviewRef, SimpleChartPreviewProps>(
  ({ chart, width = 800, height = 400 }, ref) => {
    const chartRef = useRef<ReactEChartsCore>(null);
    const exportContainerRef = useRef<HTMLDivElement>(null);

    const chartOption: EChartsOption = useMemo(() => {
      const dataSource: DataSource = {
        labels: chart.data.labels,
        series: chart.data.series,
      };

      return buildEChartsConfig({
        chartType: chart.chartType,
        orientation: chart.orientation || 'vertical',
        metadata: {
          title: chart.title,
          subtitle: chart.subtitle,
          xAxisLabel: chart.xAxisLabel,
          yAxisLabel: chart.yAxisLabel,
          unitSuffix: chart.unitSuffix,
          decimalPrecision: chart.decimalPrecision,
          showLegend: chart.showLegend,
          showGridlines: chart.showGridlines,
        },
        dataSource,
        logo: {
          file: null,
          previewUrl: null,
          position: 'top-right',
          opacity: 80,
        },
      });
    }, [chart]);

    useImperativeHandle(ref, () => ({
      getChartInstance: () => chartRef.current,
      getExportContainer: () => exportContainerRef.current,
    }));

    return (
      <div className="w-full bg-white rounded-md border border-border overflow-auto">
        <div
          ref={exportContainerRef}
          className="bg-white mx-auto"
          style={{ width: `${width}px`, maxWidth: '100%' }}
        >
          <ReactECharts
            ref={chartRef}
            option={chartOption}
            notMerge={true}
            style={{ height: `${height}px`, width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    );
  }
);

SimpleChartPreview.displayName = 'SimpleChartPreview';
