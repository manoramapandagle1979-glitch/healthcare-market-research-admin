'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Eye, Search, User } from 'lucide-react';
import { fetchAuthors } from '@/lib/api/authors';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData, ReportAuthor } from '@/lib/types/reports';

interface SettingsTabProps {
  form: UseFormReturn<ReportFormData>;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onPreview?: () => void;
  isSaving: boolean;
}

export function SettingsTab({ form, onSubmit, onPreview, isSaving }: SettingsTabProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [authors, setAuthors] = useState<ReportAuthor[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setIsLoadingAuthors(true);
      const response = await fetchAuthors();
      setAuthors(response.data || []);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setIsLoadingAuthors(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Research Team Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Research Team Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Authors</FormLabel>
                <FormDescription>
                  Choose the researchers and analysts who contributed to this report
                </FormDescription>
                {isLoadingAuthors ? (
                  <div className="text-sm text-muted-foreground py-4">Loading authors...</div>
                ) : authors.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-4">
                    No authors available. Please add authors first.
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {authors.map(author => (
                      <div
                        key={author.id}
                        className="flex items-start space-x-3 border rounded-lg p-3"
                      >
                        <Checkbox
                          checked={field.value?.includes(String(author.id))}
                          onCheckedChange={checked => {
                            const updated = checked
                              ? [...(field.value || []), String(author.id)]
                              : field.value?.filter(id => id !== String(author.id)) || [];
                            field.onChange(updated);
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{author.name}</div>
                          {author.role && (
                            <div className="text-sm text-muted-foreground">{author.role}</div>
                          )}
                          {author.bio && (
                            <div className="text-xs text-muted-foreground mt-1">{author.bio}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* SEO Metadata */}
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
          </div>
        </CardContent>
      </Card>

      {/* Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel>Status</FormLabel>
                  <FormDescription>
                    {field.value === 'published'
                      ? 'Report is visible to users'
                      : 'Report is hidden (draft mode)'}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'published'}
                    onCheckedChange={checked => field.onChange(checked ? 'published' : 'draft')}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator />

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Report'}
              </Button>
              {onPreview && (
                <Button type="button" variant="outline" onClick={onPreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
