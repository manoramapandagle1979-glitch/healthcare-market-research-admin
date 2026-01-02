'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Search } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface SEOMetadataTabProps {
  form: UseFormReturn<ReportFormData>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function SEOMetadataTab({ form, onSaveTab, isSaving }: SEOMetadataTabProps) {
  const [keywordInput, setKeywordInput] = useState('');

  const handleSaveTab = async () => {
    const values = form.getValues();
    if (onSaveTab) {
      await onSaveTab('seo', {
        metadata: values.metadata,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic SEO</h3>
            <FormField
              control={form.control}
              name="metadata.metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO-friendly title (optional)" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty to use report title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SEO description (120-160 characters)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (keywordInput.trim()) {
                            field.onChange([...(field.value || []), keywordInput.trim()]);
                            setKeywordInput('');
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (keywordInput.trim()) {
                          field.onChange([...(field.value || []), keywordInput.trim()]);
                          setKeywordInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((keyword, i) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                        <button
                          type="button"
                          className="ml-2"
                          onClick={() => {
                            field.onChange(field.value?.filter((_, idx) => idx !== i));
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.canonicalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/reports/..." {...field} />
                  </FormControl>
                  <FormDescription>Preferred URL for this page</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.robotsDirective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Robots Directive</FormLabel>
                  <FormControl>
                    <Input placeholder="index, follow" {...field} />
                  </FormControl>
                  <FormDescription>
                    e.g., &quot;index, follow&quot; or &quot;noindex, nofollow&quot;
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Open Graph (Facebook, LinkedIn)</h3>
            <FormField
              control={form.control}
              name="metadata.ogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Social media title" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty to use meta title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.ogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Social media description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/images/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Image shown when shared on social media (1200x630px recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.ogType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Type</FormLabel>
                  <FormControl>
                    <Input placeholder="article" {...field} />
                  </FormControl>
                  <FormDescription>e.g., &quot;article&quot;, &quot;website&quot;</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Twitter Card</h3>
            <FormField
              control={form.control}
              name="metadata.twitterCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter Card Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Schema.org JSON-LD</h3>
            <FormField
              control={form.control}
              name="metadata.schemaJson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema JSON-LD</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"@context": "https://schema.org", "@type": "Report", ...}'
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Structured data in JSON-LD format (optional)</FormDescription>
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
