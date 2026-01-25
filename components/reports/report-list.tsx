'use client';

import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/skeletons/table-skeleton';
import type { Report } from '@/lib/types/reports';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/format';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface ReportListProps {
  reports: Report[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
}

export function ReportList({ reports, isLoading, onDelete }: ReportListProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} showHeader={true} showActions={true} />;
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map(report => (
            <TableRow key={report.id}>
              <TableCell className="font-medium max-w-xs truncate">{report.title}</TableCell>
              <TableCell>{report.category}</TableCell>
              <TableCell>
                <Badge variant={report.status === 'published' ? 'default' : 'secondary'}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(report.price)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatRelativeTime(report.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/reports/${report.id}/preview`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/reports/${report.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(report.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
