'use client';

import React, { useRef, useState } from 'react';
import { Download, RefreshCw, FileDown, FileUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useChartGenerator } from '@/hooks/use-chart-generator';
import { ChartPreview, type ChartPreviewRef } from './chart-preview';
import { exportChartAsImage } from '@/lib/utils/chart-export';
import { toast } from 'sonner';
import type { ExportOptions } from '@/lib/types/chart-generator';

export function PreviewExportPanel() {
  const chartRef = useRef<ChartPreviewRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    metadata,
    validationResult,
    validateConfiguration,
    resetConfiguration,
    exportConfiguration,
    importConfiguration,
  } = useChartGenerator();

  const [exportFormat, setExportFormat] = useState<'png' | 'webp'>('png');
  const [resolution, setResolution] = useState<'1200x700' | '2400x1400'>('1200x700');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    // Validate before export
    const validation = validateConfiguration();

    if (!validation.isValid) {
      toast.error('Please fix validation errors before exporting');
      return;
    }

    try {
      setIsExporting(true);

      // Get the clean export container without padding/borders
      const exportContainer = chartRef.current?.getExportContainer();
      const chartInstance = chartRef.current?.getChartInstance();

      if (!exportContainer || !chartInstance) {
        toast.error('Chart not ready for export');
        return;
      }

      const options: ExportOptions = {
        format: exportFormat,
        resolution,
      };

      await exportChartAsImage(exportContainer, chartInstance, options, metadata.title);
      toast.success(`Chart exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export chart. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all configuration? This cannot be undone.')) {
      resetConfiguration();
    }
  };

  const handleExportConfig = () => {
    try {
      const configJson = exportConfiguration();
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart-config-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Configuration exported successfully');
    } catch {
      toast.error('Failed to export configuration');
    }
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = e.target?.result as string;
        importConfiguration(json);
      } catch (error) {
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {validationResult.errors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <ChartPreview ref={chartRef} />
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="export-format">Format</Label>
            <Select
              value={exportFormat}
              onValueChange={(value: 'png' | 'webp') => setExportFormat(value)}
            >
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="export-resolution">Resolution</Label>
            <Select
              value={resolution}
              onValueChange={(value: '1200x700' | '2400x1400') => setResolution(value)}
            >
              <SelectTrigger id="export-resolution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1200x700">Standard (1200 × 700)</SelectItem>
                <SelectItem value="2400x1400">High-Res (2400 × 1400)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExport}
            disabled={!validationResult.isValid || isExporting}
            className="w-full"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            {isExporting ? 'Exporting...' : `Download ${exportFormat.toUpperCase()}`}
          </Button>
        </CardContent>
      </Card>

      {/* Configuration Management */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExportConfig} variant="outline" className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            Export Config (JSON)
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full"
          >
            <FileUp className="mr-2 h-4 w-4" />
            Import Config (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportConfig}
            className="hidden"
          />

          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
