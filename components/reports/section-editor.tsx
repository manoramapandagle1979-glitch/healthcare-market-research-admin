'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TiptapEditor } from './tiptap-editor';
import { REPORT_SECTIONS } from '@/lib/config/reports';
import type { ReportSections, ReportSectionKey } from '@/lib/types/reports';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectionEditorProps {
  sections: ReportSections;
  onChange: (sections: ReportSections) => void;
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<ReportSectionKey>>(
    new Set(REPORT_SECTIONS.map(section => section.key))
  );

  const toggleSection = (key: ReportSectionKey) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSectionChange = (key: ReportSectionKey, content: string) => {
    onChange({
      ...sections,
      [key]: content,
    });
  };

  return (
    <div className="space-y-4">
      {REPORT_SECTIONS.map(section => {
        const isExpanded = expandedSections.has(section.key);
        const hasContent = sections[section.key]?.trim().length > 0;

        return (
          <Card key={section.key}>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection(section.key)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                  {section.required && <Badge variant="destructive">Required</Badge>}
                  {hasContent && <Badge variant="outline">✓</Badge>}
                </div>
                <Button variant="ghost" size="sm" type="button">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent>
                <TiptapEditor
                  content={sections[section.key] || ''}
                  onChange={content => handleSectionChange(section.key, content)}
                  placeholder={section.placeholder}
                />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
