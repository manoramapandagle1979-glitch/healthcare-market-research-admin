'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, TrendingUp } from 'lucide-react';
import { REPORT_CATEGORIES, GEOGRAPHIES, REPORT_FORMATS } from '@/lib/config/reports';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface ReportDetailsTabProps {
  form: UseFormReturn<ReportFormData>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function ReportDetailsTab({ form, onSaveTab, isSaving }: ReportDetailsTabProps) {
  const handleSaveTab = async () => {
    const values = form.getValues();
    if (onSaveTab) {
      await onSaveTab('details', {
        title: values.title,
        summary: values.summary,
        category: values.category,
        geography: values.geography,
        publishDate: values.publishDate,
        price: values.price,
        discountedPrice: values.discountedPrice,
        pageCount: values.pageCount,
        formats: values.formats,
        marketMetrics: values.marketMetrics,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Global Healthcare Market Analysis 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief overview of the report (50-200 characters)"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REPORT_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geography</FormLabel>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {GEOGRAPHIES.map(geo => (
                      <div key={geo} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(geo)}
                          onCheckedChange={checked => {
                            const updated = checked
                              ? [...field.value, geo]
                              : field.value.filter(g => g !== geo);
                            field.onChange(updated);
                          }}
                        />
                        <label className="text-sm">{geo}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="publishDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pageCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="145"
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
              name="formats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Formats</FormLabel>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {REPORT_FORMATS.map(format => (
                      <div key={format} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(format)}
                          onCheckedChange={checked => {
                            const updated = checked
                              ? [...(field.value || []), format]
                              : field.value?.filter(f => f !== format) || [];
                            field.onChange(updated);
                          }}
                        />
                        <label className="text-sm">{format}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3490"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3090"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Market Metrics */}
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
