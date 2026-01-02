'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, TrendingUp } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface MarketMetricsTabProps {
  form: UseFormReturn<ReportFormData>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function MarketMetricsTab({ form, onSaveTab, isSaving }: MarketMetricsTabProps) {
  const handleSaveTab = async () => {
    const values = form.getValues();
    if (onSaveTab) {
      await onSaveTab('metrics', {
        marketMetrics: values.marketMetrics,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marketMetrics.currentRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Market Revenue</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $87.4 billion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketMetrics.currentYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2024"
                      {...field}
                      value={field.value || ''}
                      onChange={e =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marketMetrics.forecastRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forecasted Revenue</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $286.2 billion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketMetrics.forecastYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forecast Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2032"
                      {...field}
                      value={field.value || ''}
                      onChange={e =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="marketMetrics.cagr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAGR (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 16.8%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketMetrics.cagrStartYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAGR Start Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2025"
                      {...field}
                      value={field.value || ''}
                      onChange={e =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketMetrics.cagrEndYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CAGR End Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2032"
                      {...field}
                      value={field.value || ''}
                      onChange={e =>
                        field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {onSaveTab && (
        <div className="flex justify-end">
          <Button onClick={handleSaveTab} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      )}
    </div>
  );
}
