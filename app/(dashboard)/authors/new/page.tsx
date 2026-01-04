'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthorForm } from '@/components/authors/author-form';
import { createAuthor } from '@/lib/api/authors';
import type { AuthorFormData } from '@/lib/types/reports';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewAuthorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: AuthorFormData) => {
    try {
      setIsSaving(true);
      await createAuthor(data);
      router.push('/authors');
    } catch (error) {
      console.error('Failed to create author:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/authors')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Authors
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Author</h1>
        <p className="text-muted-foreground">Create a new research team member</p>
      </div>

      <AuthorForm onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}
