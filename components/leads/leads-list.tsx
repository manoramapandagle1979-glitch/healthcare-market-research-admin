'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Trash2, CheckCircle2 } from 'lucide-react';
import type {
  ApiFormSubmission,
  ContactFormData,
  RequestSampleFormData,
} from '@/lib/types/api-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LeadsListProps {
  submissions: ApiFormSubmission[];
  onDelete: (id: string) => Promise<boolean>;
  onStatusUpdate: (
    id: string,
    status: 'pending' | 'processed' | 'archived',
    notes?: string
  ) => Promise<boolean>;
}

export function LeadsList({ submissions, onDelete, onStatusUpdate }: LeadsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewSubmission, setViewSubmission] = useState<ApiFormSubmission | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    const success = await onDelete(deleteId);
    if (success) {
      setDeleteId(null);
    }
  };

  const handleMarkAsProcessed = async (id: string) => {
    await onStatusUpdate(id, 'processed');
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'contact':
        return 'default';
      case 'request-sample':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'processed':
        return 'default';
      case 'archived':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubmissionName = (submission: ApiFormSubmission) => {
    return (submission.data as ContactFormData | RequestSampleFormData).fullName;
  };

  const getSubmissionEmail = (submission: ApiFormSubmission) => {
    return (submission.data as ContactFormData | RequestSampleFormData).email;
  };

  const getSubmissionCompany = (submission: ApiFormSubmission) => {
    return (submission.data as ContactFormData | RequestSampleFormData).company;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map(submission => (
            <TableRow key={submission.id}>
              <TableCell className="text-muted-foreground">{submission.id}</TableCell>
              <TableCell className="font-medium">{getSubmissionName(submission)}</TableCell>
              <TableCell>{getSubmissionEmail(submission)}</TableCell>
              <TableCell>{getSubmissionCompany(submission)}</TableCell>
              <TableCell>
                <Badge variant={getCategoryBadgeVariant(submission.category)}>
                  {submission.category === 'contact' ? 'Contact' : 'Request Sample'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(submission.status)}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(submission.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewSubmission(submission)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {submission.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsProcessed(submission.id)}
                      title="Mark as processed"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(submission.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!viewSubmission} onOpenChange={() => setViewSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              {viewSubmission?.category === 'contact' ? 'Contact Form' : 'Request Sample Form'}
            </DialogDescription>
          </DialogHeader>
          {viewSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-sm">{getSubmissionName(viewSubmission)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{getSubmissionEmail(viewSubmission)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{getSubmissionCompany(viewSubmission)}</p>
                </div>
                {viewSubmission.category === 'request-sample' && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Job Title</p>
                    <p className="text-sm">
                      {(viewSubmission.data as RequestSampleFormData).jobTitle}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">
                    {(viewSubmission.data as ContactFormData | RequestSampleFormData).phone || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(viewSubmission.status)}>
                    {viewSubmission.status.charAt(0).toUpperCase() + viewSubmission.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {viewSubmission.category === 'contact' && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject</p>
                    <p className="text-sm">{(viewSubmission.data as ContactFormData).subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Message</p>
                    <p className="text-sm whitespace-pre-wrap">
                      {(viewSubmission.data as ContactFormData).message}
                    </p>
                  </div>
                </>
              )}

              {viewSubmission.category === 'request-sample' && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Report Title</p>
                    <p className="text-sm">
                      {(viewSubmission.data as RequestSampleFormData).reportTitle}
                    </p>
                  </div>
                  {(viewSubmission.data as RequestSampleFormData).additionalInfo && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Additional Info</p>
                      <p className="text-sm whitespace-pre-wrap">
                        {(viewSubmission.data as RequestSampleFormData).additionalInfo}
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>{' '}
                    {formatDate(viewSubmission.metadata.submittedAt)}
                  </div>
                  {viewSubmission.metadata.ipAddress && (
                    <div>
                      <span className="text-muted-foreground">IP:</span>{' '}
                      {viewSubmission.metadata.ipAddress}
                    </div>
                  )}
                  {viewSubmission.metadata.referrer && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Referrer:</span>{' '}
                      {viewSubmission.metadata.referrer}
                    </div>
                  )}
                </div>
              </div>

              {viewSubmission.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{viewSubmission.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
