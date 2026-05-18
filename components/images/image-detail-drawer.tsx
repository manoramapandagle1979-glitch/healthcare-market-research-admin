'use client';

import { useEffect, useState } from 'react';
import { X, Copy, Check, Trash2, Tag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { updateImage, type Image } from '@/lib/api/images';

interface ImageDetailDrawerProps {
  image: Image | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (image: Image) => void;
  onDeleted: (id: number) => void;
}

export function ImageDetailDrawer({
  image,
  open,
  onClose,
  onUpdated,
  onDeleted,
}: ImageDetailDrawerProps) {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setAltText(image.altText);
      setTags(image.tags);
      setTagInput('');
    }
  }, [image]);

  if (!image) return null;

  const isDirty =
    title !== image.title ||
    altText !== image.altText ||
    JSON.stringify(tags) !== JSON.stringify(image.tags);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateImage(image.id, { title, altText, tags });
      onUpdated(updated);
      toast.success('Image updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    toast.success('URL copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{image.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg overflow-hidden border bg-muted/30">
            <img
              src={image.url}
              alt={image.altText || image.title}
              className="w-full object-contain max-h-64"
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Size: {formatBytes(image.size)}</p>
            <p>Type: {image.mimeType || 'image/webp'}</p>
            <p>Uploaded: {formatDate(image.createdAt)}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">URL</Label>
            <div className="flex gap-2">
              <Input readOnly value={image.url} className="text-xs font-mono" />
              <Button size="icon" variant="outline" onClick={copyUrl} title="Copy URL">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="img-title">Title</Label>
            <Input
              id="img-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Image title"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="img-alt">Alt text</Label>
            <Input
              id="img-alt"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete image?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the image from storage and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDeleted(image.id);
                      onClose();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={save} disabled={!isDirty || saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
