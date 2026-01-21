'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePressRelease } from '@/hooks/use-press-release';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Edit, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils/date';
import { PRESS_RELEASE_STATUS_CONFIG } from '@/lib/config/press-releases';

export default function PreviewPressReleasePage() {
  const params = useParams();
  const { pressRelease, isLoading, error, fetchPressRelease } = usePressRelease();
  const pressReleaseId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (pressReleaseId && !isNaN(pressReleaseId)) {
      fetchPressRelease(pressReleaseId);
    }
  }, [pressReleaseId, fetchPressRelease]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !pressRelease) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading press release</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/press-releases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Press Releases
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/press-releases/${pressReleaseId}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Press Release
          </Link>
        </Button>
      </div>

      {/* Press Release Preview */}
      <Card>
        <CardHeader className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={
                pressRelease.status === 'published'
                  ? 'default'
                  : pressRelease.status === 'review'
                    ? 'outline'
                    : 'secondary'
              }
            >
              {PRESS_RELEASE_STATUS_CONFIG[pressRelease.status].label}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold">{pressRelease.title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground">{pressRelease.excerpt}</p>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(pressRelease.publishDate)}</span>
            </div>

            {pressRelease.location && (
              <>
                <span>•</span>
                {/* Location */}
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{pressRelease.location}</span>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {pressRelease.tags && (
            <div className="flex flex-wrap gap-2">
              {pressRelease.tags.split(',').map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Content */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: pressRelease.content }}
          />
        </CardContent>
      </Card>

      {/* SEO Preview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">SEO Preview</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-blue-600 dark:text-blue-400 text-lg">
              {pressRelease.metadata.metaTitle || pressRelease.title}
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm">
              https://yoursite.com/press-releases/{pressRelease.slug}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {pressRelease.metadata.metaDescription || pressRelease.excerpt}
            </p>
          </div>

          {pressRelease.metadata.keywords && pressRelease.metadata.keywords.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {pressRelease.metadata.keywords.map((keyword, i) => (
                  <Badge key={i} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
