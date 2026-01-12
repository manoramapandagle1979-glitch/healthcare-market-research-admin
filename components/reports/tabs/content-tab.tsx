'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, FileText, Building2, HelpCircle, Lightbulb, List } from 'lucide-react';
import { SectionEditor } from '../section-editor';
import { TOCEditor } from '../toc-editor';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface ContentTabProps {
  form: UseFormReturn<ReportFormData>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function ContentTab({ form, onSaveTab, isSaving }: ContentTabProps) {
  const handleSaveTab = async () => {
    if (onSaveTab) {
      // Wait for React to complete any pending state updates from the TiptapEditor
      // This ensures we capture the latest editor content before saving
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      const values = form.getValues();
      // Send all form values, not just fields from this tab
      await onSaveTab('content', values);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Content Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Content Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="sections"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SectionEditor sections={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="sections.tableOfContents"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Build a hierarchical table of contents with chapters, sections, and subsections
                </FormDescription>
                <FormControl>
                  <TOCEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Key Findings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="sections.keyFindings"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Add key research findings and insights (one per entry)
                </FormDescription>
                <div className="space-y-3">
                  {field.value?.map((finding, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder={`Key finding #${index + 1}...`}
                          rows={2}
                          value={finding}
                          onChange={e => {
                            const updated = [...(field.value || [])];
                            updated[index] = e.target.value;
                            field.onChange(updated);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = field.value?.filter((_, i) => i !== index);
                          field.onChange(updated);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const updated = [...(field.value || []), ''];
                    field.onChange(updated);
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Finding
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Key Market Players */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Key Market Players
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="keyPlayers"
            render={({ field }) => (
              <FormItem>
                <FormDescription>Add key companies and their market share data</FormDescription>
                <div className="space-y-4">
                  {field.value?.map((player, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Player #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = field.value?.filter((_, i) => i !== index);
                              field.onChange(updated);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <Input
                              placeholder="Company Name"
                              value={player.name}
                              onChange={e => {
                                const updated = [...(field.value || [])];
                                updated[index] = { ...updated[index], name: e.target.value };
                                field.onChange(updated);
                              }}
                            />
                          </div>
                          <Input
                            placeholder="Market Share (e.g., 14.2%)"
                            value={player.marketShare || ''}
                            onChange={e => {
                              const updated = [...(field.value || [])];
                              updated[index] = { ...updated[index], marketShare: e.target.value };
                              field.onChange(updated);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const updated = [
                      ...(field.value || []),
                      { name: '', marketShare: '', rank: undefined },
                    ];
                    field.onChange(updated);
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Player
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="faqs"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  Add questions and answers to help users understand this report better
                </FormDescription>
                <div className="space-y-4">
                  {field.value?.map((faq, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            FAQ #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updated = field.value?.filter((_, i) => i !== index);
                              field.onChange(updated);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter your question..."
                            value={faq.question}
                            onChange={e => {
                              const updated = [...(field.value || [])];
                              updated[index] = { ...updated[index], question: e.target.value };
                              field.onChange(updated);
                            }}
                          />
                          <Textarea
                            placeholder="Enter the answer..."
                            rows={3}
                            value={faq.answer}
                            onChange={e => {
                              const updated = [...(field.value || [])];
                              updated[index] = { ...updated[index], answer: e.target.value };
                              field.onChange(updated);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const updated = [...(field.value || []), { question: '', answer: '' }];
                    field.onChange(updated);
                  }}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
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
