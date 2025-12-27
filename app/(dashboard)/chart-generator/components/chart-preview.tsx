'use client';

import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import type ReactEChartsCore from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useChartGenerator } from '@/hooks/use-chart-generator';
import { buildEChartsConfig } from '@/lib/utils/chart-builder';
import type { EChartsReactProps } from 'echarts-for-react';

const ReactECharts = dynamic<EChartsReactProps>(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export interface ChartPreviewRef {
  getChartInstance: () => ReactEChartsCore | null;
  getExportContainer: () => HTMLDivElement | null;
}

export const ChartPreview = forwardRef<ChartPreviewRef>((props, ref) => {
  const chartRef = useRef<ReactEChartsCore>(null);
  const exportContainerRef = useRef<HTMLDivElement>(null);
  const { chartConfig, metadata, dataSource, logo } = useChartGenerator();

  const chartOption: EChartsOption = useMemo(() => {
    return buildEChartsConfig({
      chartType: chartConfig.chartType,
      orientation: chartConfig.orientation,
      metadata,
      dataSource,
      logo,
    });
  }, [chartConfig, metadata, dataSource, logo]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getChartInstance: () => chartRef.current,
    getExportContainer: () => exportContainerRef.current,
  }));

  // Handle window resize to ensure chart resizes properly
  React.useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const instance = chartRef.current.getEchartsInstance();
        if (instance) {
          instance.resize();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full bg-white rounded-md p-4 border border-border">
      {/* Clean export container without padding/borders */}
      <div ref={exportContainerRef} className="w-full bg-white">
        <ReactECharts
          ref={chartRef}
          option={chartOption}
          style={{ height: '500px', width: '100%' }}
          opts={{ renderer: 'canvas', resize: true }}
        />
      </div>
    </div>
  );
});

ChartPreview.displayName = 'ChartPreview';
