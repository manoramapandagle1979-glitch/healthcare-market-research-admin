'use client';

import { useState, useEffect } from 'react';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GEOGRAPHIES, REPORT_FORMATS } from '@/lib/config/reports';
import { fetchCategories, type Category } from '@/lib/api/categories';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface ReportDetailsTabProps {
  form: UseFormReturn<ReportFormData>;
  reportId?: string | number;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function ReportDetailsTab({
  form,
  reportId: _reportId,
  onSaveTab,
  isSaving,
}: ReportDetailsTabProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetchCategories({ limit: 100 }); // Fetch all categories
      setCategories(response.categories.filter(cat => cat.isActive));
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Optionally show a toast notification here
    } finally {
      setIsLoadingCategories(false);
    }
  };
  const handleSaveTab = async () => {
    // Trigger validation for the entire form
    const isValid = await form.trigger();

    if (!isValid) {
      // Validation failed - show error alert and scroll to top
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Hide validation error if it was showing
    setShowValidationError(false);

    const values = form.getValues();
    if (onSaveTab) {
      // Send all form values, not just fields from this tab
      await onSaveTab('details', values);
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Error Alert */}
      {showValidationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            Please fix the validation errors below before saving. Required fields are marked with an
            asterisk (*).
          </AlertDescription>
        </Alert>
      )}

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
                <FormLabel className="flex items-center gap-1">
                  Report Title
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Global Healthcare Market Analysis 2024"
                    {...field}
                    onChange={e => {
                      field.onChange(e);
                      // Auto-generate slug if slug is empty
                      const currentSlug = form.getValues('slug');
                      if (!currentSlug) {
                        const slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-')
                          .trim();
                        form.setValue('slug', slug);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Minimum 10 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  URL Slug
                  <span className="text-destructive">*</span>
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="e.g., global-healthcare-market-analysis-2024" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const title = form.getValues('title');
                      if (title) {
                        let slug = title
                          .toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-');

                        // Ensure slug always ends with '-market-size'
                        if (!slug.endsWith('-market-size')) {
                          slug = slug + '-market-size';
                        }

                        form.setValue('slug', slug);
                      }
                    }}
                  >
                    Generate
                  </Button>
                </div>
                <FormDescription>
                  Unique URL identifier (lowercase letters, numbers, and hyphens only)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Summary
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief overview of the report (minimum 50 characters)"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} / 50 minimum characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Category
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={value => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                    disabled={isLoadingCategories}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories ? 'Loading categories...' : 'Select category'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
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
                  <FormLabel className="flex items-center gap-1">
                    Geography
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {GEOGRAPHIES.map(geo => (
                      <div key={geo} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(geo)}
                          onCheckedChange={checked => {
                            const updated = checked
                              ? [...field.value, geo]
                              : field.value.filter((g: string) => g !== geo);
                            field.onChange(updated);
                          }}
                        />
                        <label className="text-sm">{geo}</label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>Select at least one geography</FormDescription>
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
                              : field.value?.filter((f: string) => f !== format) || [];
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
            {isSaving ? 'Saving...' : 'Save Report'}
          </Button>
        </div>
      )}
    </div>
  );
}
