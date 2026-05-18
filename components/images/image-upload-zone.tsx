'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { uploadImage, type Image } from '@/lib/api/images';

interface UploadingFile {
  id: string;
  name: string;
  progress: 'uploading' | 'done' | 'error';
}

interface ImageUploadZoneProps {
  onUploaded: (image: Image) => void;
  className?: string;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024;

export function ImageUploadZone({ onUploaded, className }: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<UploadingFile[]>([]);

  const processFiles = useCallback(
    async (files: File[]) => {
      const valid = files.filter(f => {
        if (!ACCEPTED.includes(f.type)) {
          toast.error(`${f.name}: unsupported format`);
          return false;
        }
        if (f.size > MAX_SIZE) {
          toast.error(`${f.name}: exceeds 10 MB limit`);
          return false;
        }
        return true;
      });

      if (!valid.length) return;

      const entries: UploadingFile[] = valid.map(f => ({
        id: crypto.randomUUID(),
        name: f.name,
        progress: 'uploading',
      }));
      setQueue(prev => [...prev, ...entries]);

      await Promise.all(
        valid.map(async (file, i) => {
          const entry = entries[i];
          try {
            const image = await uploadImage(file);
            setQueue(prev => prev.map(q => (q.id === entry.id ? { ...q, progress: 'done' } : q)));
            onUploaded(image);
          } catch {
            setQueue(prev => prev.map(q => (q.id === entry.id ? { ...q, progress: 'error' } : q)));
            toast.error(`Failed to upload ${file.name}`);
          } finally {
            setTimeout(() => {
              setQueue(prev => prev.filter(q => q.id !== entry.id));
            }, 1500);
          }
        })
      );
    },
    [onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) processFiles(Array.from(e.target.files));
      e.target.value = '';
    },
    [processFiles]
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        onDragOver={e => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors select-none',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">Drop images here or click to browse</p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, GIF · max 10 MB · multiple allowed
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-1 pointer-events-none">
          Choose files
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      {queue.length > 0 && (
        <ul className="space-y-1">
          {queue.map(item => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
            >
              {item.progress === 'uploading' && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              )}
              {item.progress === 'done' && (
                <span className="h-4 w-4 shrink-0 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
              {item.progress === 'error' && <X className="h-4 w-4 shrink-0 text-destructive" />}
              <span className="min-w-0 truncate">{item.name}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground capitalize">
                {item.progress}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
