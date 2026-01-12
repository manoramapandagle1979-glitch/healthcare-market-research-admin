'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SimpleDataEditor } from './simple-data-editor';
import { SimpleChartPreview, type SimpleChartPreviewRef } from './simple-chart-preview';
import type { ReportChart, ReportChartType } from '@/lib/types/reports';
import { DEFAULT_CHART_COLORS } from '@/lib/config/chart-generator';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SimpleChartBuilderProps {
  chart?: ReportChart;
  onSave: (chart: ReportChart) => void;
  onCancel: () => void;
}

export function SimpleChartBuilder({ chart, onSave, onCancel }: SimpleChartBuilderProps) {
  const [chartData, setChartData] = useState<ReportChart>(
    chart || {
      id: `temp-${Date.now()}`,
      name: '',
      chartType: 'bar',
      orientation: 'vertical',
      title: '',
      subtitle: '',
      xAxisLabel: '',
      yAxisLabel: '',
      unitSuffix: '',
      decimalPrecision: 1,
      showLegend: true,
      showGridlines: true,
      data: {
        labels: ['2020', '2021', '2022', '2023'],
        series: [
          {
            id: 'series-1',
            name: 'Series 1',
            color: DEFAULT_CHART_COLORS[0],
            values: [10, 20, 30, 40],
          },
        ],
      },
    }
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<SimpleChartPreviewRef>(null);

  const handleSave = async () => {
    if (!chartData.name.trim()) {
      toast.error('Please enter a chart name');
      return;
    }
    if (!chartData.title.trim()) {
      toast.error('Please enter a chart title');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate chart image
      const exportContainer = previewRef.current?.getExportContainer();
      if (!exportContainer) {
        throw new Error('Chart preview not ready');
      }

      const dataUrl = await toPng(exportContainer, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      // Save with image data (will be uploaded when form is submitted)
      onSave({
        ...chartData,
        imageData: dataUrl,
      });

      toast.success('Chart saved successfully');
    } catch (error) {
      console.error('Failed to generate chart image:', error);
      toast.error('Failed to generate chart image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chart-name">Chart Name *</Label>
          <Input
            id="chart-name"
            value={chartData.name}
            onChange={e => setChartData({ ...chartData, name: e.target.value })}
            placeholder="e.g., Market Size by Region"
          />
          <p className="text-xs text-muted-foreground">Internal name to identify this chart</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chart-type">Chart Type</Label>
          <Select
            value={chartData.chartType}
            onValueChange={(value: ReportChartType) =>
              setChartData({ ...chartData, chartType: value })
            }
          >
            <SelectTrigger id="chart-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="stacked-bar">Stacked Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="donut">Donut Chart</SelectItem>
              <SelectItem value="world-map">World Map</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(chartData.chartType === 'bar' || chartData.chartType === 'stacked-bar') && (
        <div className="space-y-2">
          <Label htmlFor="orientation">Orientation</Label>
          <Select
            value={chartData.orientation}
            onValueChange={(value: 'vertical' | 'horizontal') =>
              setChartData({ ...chartData, orientation: value })
            }
          >
            <SelectTrigger id="orientation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chart-title">Chart Title *</Label>
          <Input
            id="chart-title"
            value={chartData.title}
            onChange={e => setChartData({ ...chartData, title: e.target.value })}
            placeholder="e.g., Global Market Size (USD Billion)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chart-subtitle">Subtitle</Label>
          <Input
            id="chart-subtitle"
            value={chartData.subtitle || ''}
            onChange={e => setChartData({ ...chartData, subtitle: e.target.value })}
            placeholder="e.g., 2020-2024"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="x-axis-label">X-Axis Label</Label>
          <Input
            id="x-axis-label"
            value={chartData.xAxisLabel || ''}
            onChange={e => setChartData({ ...chartData, xAxisLabel: e.target.value })}
            placeholder="e.g., Year"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="y-axis-label">Y-Axis Label</Label>
          <Input
            id="y-axis-label"
            value={chartData.yAxisLabel || ''}
            onChange={e => setChartData({ ...chartData, yAxisLabel: e.target.value })}
            placeholder="e.g., Revenue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-suffix">Unit Suffix</Label>
          <Input
            id="unit-suffix"
            value={chartData.unitSuffix || ''}
            onChange={e => setChartData({ ...chartData, unitSuffix: e.target.value })}
            placeholder="e.g., B, M, %"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="show-legend"
            checked={chartData.showLegend}
            onCheckedChange={checked => setChartData({ ...chartData, showLegend: checked })}
          />
          <Label htmlFor="show-legend" className="cursor-pointer">
            Show Legend
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-gridlines"
            checked={chartData.showGridlines}
            onCheckedChange={checked => setChartData({ ...chartData, showGridlines: checked })}
          />
          <Label htmlFor="show-gridlines" className="cursor-pointer">
            Show Gridlines
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="decimal-precision">Decimal Precision</Label>
          <Select
            value={chartData.decimalPrecision.toString()}
            onValueChange={value =>
              setChartData({ ...chartData, decimalPrecision: parseInt(value) as 0 | 1 | 2 })
            }
          >
            <SelectTrigger id="decimal-precision" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SimpleDataEditor
        data={chartData.data}
        onChange={data => setChartData({ ...chartData, data })}
      />

      <div>
        <Label className="mb-2 block">Preview</Label>
        <SimpleChartPreview ref={previewRef} chart={chartData} width={800} height={400} />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isGenerating}>
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? 'Generating...' : 'Save Chart'}
        </Button>
      </div>
    </div>
  );
}
