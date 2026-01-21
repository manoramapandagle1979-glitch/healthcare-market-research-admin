'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, List, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TOCViewer } from '../toc-viewer';
import { TOCGeneratorDialog } from '../toc-generator-dialog';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFormData } from '@/lib/types/reports';

interface TOCTabProps {
  form: UseFormReturn<any>;
  onSaveTab?: (tabKey: string, data: Partial<ReportFormData>) => Promise<void>;
  isSaving: boolean;
}

export function TOCTab({ form, onSaveTab, isSaving }: TOCTabProps) {
  const [tocDialogOpen, setTocDialogOpen] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const handleSaveTab = async () => {
    if (onSaveTab) {
      const isValid = await form.trigger();

      if (!isValid) {
        setShowValidationError(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setShowValidationError(false);
      const values = form.getValues();
      await onSaveTab('toc', values);
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
            Please fix the validation errors before saving. Required fields are marked with an asterisk (*) in the Report Details tab.
          </AlertDescription>
        </Alert>
      )}

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Table of Contents
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTocDialogOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate from Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="sections.tableOfContents"
            render={({ field }) => (
              <FormItem>
                <FormDescription>
                  View your hierarchical table of contents with chapters, sections, and subsections.
                  Use &ldquo;Generate from Template&rdquo; to create or modify the structure.
                </FormDescription>
                <FormControl>
                  <TOCViewer value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <TOCGeneratorDialog
            open={tocDialogOpen}
            onOpenChange={setTocDialogOpen}
            reportTitle={form.watch('title')}
            currentTOC={form.watch('sections.tableOfContents')}
            onImport={(toc) => {
              form.setValue('sections.tableOfContents', toc);
              setTocDialogOpen(false);
            }}
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
