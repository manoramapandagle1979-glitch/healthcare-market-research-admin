'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthorForm } from '@/components/authors/author-form';
import { fetchAuthorByIdMock, updateAuthorMock } from '@/lib/api/authors.mock';
import type { ReportAuthor, AuthorFormData } from '@/lib/types/reports';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditAuthorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [author, setAuthor] = useState<ReportAuthor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthor = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchAuthorByIdMock(params.id);
      setAuthor(response.author);
    } catch (error) {
      console.error('Failed to load author:', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadAuthor();
  }, [loadAuthor]);

  const handleSubmit = async (data: AuthorFormData) => {
    try {
      setIsSaving(true);
      await updateAuthorMock(params.id, data);
      router.push('/authors');
    } catch (error) {
      console.error('Failed to update author:', error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading author...</div>;
  }

  if (!author) {
    return <div className="text-center py-8">Author not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/authors')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Authors
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Author</h1>
        <p className="text-muted-foreground">Update {author.name}&apos;s information</p>
      </div>

      <AuthorForm author={author} onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
