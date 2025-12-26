'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReportVersion } from '@/lib/types/reports';
import { formatRelativeTime } from '@/lib/utils/date';
import { RotateCcw, Clock } from 'lucide-react';

interface VersionHistoryProps {
  versions: ReportVersion[];
  onRestore?: (version: ReportVersion) => void;
}

export function VersionHistory({ versions, onRestore }: VersionHistoryProps) {
  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No version history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions
            .sort((a, b) => b.versionNumber - a.versionNumber)
            .map(version => (
              <div
                key={version.id}
                className="flex items-start justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">v{version.versionNumber}</Badge>
                    <span className="text-sm font-medium">{version.summary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatRelativeTime(version.createdAt)}</span>
                    <span>•</span>
                    <span>{version.author.name || version.author.email}</span>
                  </div>
                </div>
                {onRestore && (
                  <Button variant="ghost" size="sm" onClick={() => onRestore(version)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
