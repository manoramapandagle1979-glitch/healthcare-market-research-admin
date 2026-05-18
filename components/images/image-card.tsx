'use client';

import { useState } from 'react';
import { Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Image } from '@/lib/api/images';

interface ImageCardProps {
  image: Image;
  onSelect?: (image: Image) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ImageCard({ image, onSelect, onDelete, className }: ImageCardProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    toast.success('URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-card overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary/40',
        className
      )}
      onClick={() => onSelect?.(image)}
    >
      <div className="aspect-square bg-muted/50 overflow-hidden">
        <img
          src={image.url}
          alt={image.altText || image.title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-2.5 space-y-1.5">
        <p className="text-sm font-medium truncate leading-tight" title={image.title}>
          {image.title}
        </p>

        {image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {image.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {tag}
              </Badge>
            ))}
            {image.tags.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                +{image.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">{formatBytes(image.size)}</p>
      </div>

      <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7 shadow-sm"
          onClick={copyUrl}
          title="Copy URL"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-7 w-7 shadow-sm"
          onClick={e => {
            e.stopPropagation();
            onSelect?.(image);
          }}
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        {onDelete && (
          <Button
            size="icon"
            variant="destructive"
            className="h-7 w-7 shadow-sm"
            onClick={e => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
