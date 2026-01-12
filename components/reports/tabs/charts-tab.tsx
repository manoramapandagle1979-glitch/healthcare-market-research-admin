'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleChartBuilder } from '../charts/simple-chart-builder';
import { ChartList } from '../charts/chart-list';
import type { ReportFormData, ReportChart } from '@/lib/types/reports';
import { Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ChartsTabProps {
  form: UseFormReturn<ReportFormData>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function ChartsTab({ form, onSaveTab, isSaving: _isSaving }: ChartsTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingChart, setEditingChart] = useState<ReportChart | null>(null);

  const charts = form.watch('charts') || [];

  const handleCreateClick = () => {
    setEditingChart(null);
    setIsCreating(true);
  };

  const handleEditClick = (chart: ReportChart) => {
    setEditingChart(chart);
    setIsCreating(true);
  };

  const handleSaveChart = async (chart: ReportChart) => {
    const existingCharts = form.getValues('charts') || [];
    let updatedCharts: ReportChart[];

    if (editingChart) {
      // Update existing chart
      updatedCharts = existingCharts.map(c => (c.id === chart.id ? chart : c));
    } else {
      // Add new chart
      updatedCharts = [...existingCharts, chart];
    }

    form.setValue('charts', updatedCharts, { shouldDirty: true });

    // Auto-save if handler provided
    if (onSaveTab) {
      try {
        await onSaveTab('charts', { charts: updatedCharts });
      } catch (error) {
        console.error('Failed to auto-save charts:', error);
      }
    }

    setIsCreating(false);
    setEditingChart(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingChart(null);
  };

  const handleDeleteChart = async (chartId: string) => {
    const existingCharts = form.getValues('charts') || [];
    const updatedCharts = existingCharts.filter(c => c.id !== chartId);

    form.setValue('charts', updatedCharts, { shouldDirty: true });

    // Auto-save if handler provided
    if (onSaveTab) {
      try {
        await onSaveTab('charts', { charts: updatedCharts });
      } catch (error) {
        console.error('Failed to auto-save charts:', error);
      }
    }

    toast.success('Chart deleted successfully');
  };

  if (isCreating) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>{editingChart ? 'Edit Chart' : 'Create New Chart'}</CardTitle>
              <CardDescription>
                {editingChart
                  ? 'Update the chart configuration and data'
                  : 'Configure and generate a chart for this report'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SimpleChartBuilder
            chart={editingChart || undefined}
            onSave={handleSaveChart}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Charts</CardTitle>
              <CardDescription>
                Create and manage charts for this report. Generated charts can be referenced in the
                report content.
              </CardDescription>
            </div>
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Chart
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartList charts={charts} onDelete={handleDeleteChart} onEdit={handleEditClick} />
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">How to use charts in your report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Create charts with your market research data</p>
          <p>2. Charts will be automatically saved when the report is saved</p>
          <p>3. Reference chart images in the rich text editor when editing report sections</p>
          <p className="text-xs italic pt-2">
            Note: Chart images will be uploaded to the server when you publish or save the report.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
