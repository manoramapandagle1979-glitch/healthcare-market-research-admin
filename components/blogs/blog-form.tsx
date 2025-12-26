'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TiptapEditor } from '@/components/reports/tiptap-editor';
import { TagInput } from './tag-input';
import { AuthorSelector } from './author-selector';
import {
  BLOG_CATEGORIES,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  EXCERPT_MIN_LENGTH,
  EXCERPT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
} from '@/lib/config/blogs';
import type { BlogFormData, Blog } from '@/lib/types/blogs';
import { Save, Eye, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Validation schema
const blogFormSchema = z.object({
  title: z
    .string()
    .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
  excerpt: z
    .string()
    .min(EXCERPT_MIN_LENGTH, `Excerpt must be at least ${EXCERPT_MIN_LENGTH} characters`)
    .max(EXCERPT_MAX_LENGTH, `Excerpt must be at most ${EXCERPT_MAX_LENGTH} characters`),
  content: z
    .string()
    .min(CONTENT_MIN_LENGTH, `Content must be at least ${CONTENT_MIN_LENGTH} characters`),
  featuredImage: z.string().url().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
    })
  ),
  authorId: z.string().min(1, 'Author is required'),
  status: z.enum(['draft', 'review', 'published']),
  publishDate: z.string(),
  metadata: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional().or(z.literal('')),
    ogImage: z.string().url().optional().or(z.literal('')),
  }),
});

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onPreview?: () => void;
  isSaving: boolean;
}

export function BlogForm({ blog, onSubmit, onPreview, isSaving }: BlogFormProps) {
  const [keywordInput, setKeywordInput] = useState('');

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: blog
      ? {
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          featuredImage: blog.featuredImage || '',
          category: blog.category,
          tags: blog.tags,
          authorId: blog.author.id,
          status: blog.status,
          publishDate: blog.publishDate,
          metadata: {
            metaTitle: blog.metadata.metaTitle || '',
            metaDescription: blog.metadata.metaDescription || '',
            keywords: blog.metadata.keywords || [],
            canonicalUrl: blog.metadata.canonicalUrl || '',
            ogImage: blog.metadata.ogImage || '',
          },
        }
      : {
          title: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          category: BLOG_CATEGORIES[0],
          tags: [],
          authorId: '',
          status: 'draft',
          publishDate: new Date().toISOString(),
          metadata: {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
            canonicalUrl: '',
            ogImage: '',
          },
        },
  });

  const handleFormSubmit = async (data: BlogFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a compelling title for your blog post..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/{TITLE_MAX_LENGTH} characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a brief summary that appears in blog listings..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/{EXCERPT_MAX_LENGTH} characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BLOG_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <AuthorSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Add relevant tags..."
                    />
                  </FormControl>
                  <FormDescription>Add tags to help readers discover your content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Featured Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the URL of your featured image (recommended: 1200x630px)
                  </FormDescription>
                  <FormMessage />
                  {field.value && (
                    <div className="mt-2 border rounded-lg overflow-hidden relative h-48">
                      <Image
                        src={field.value}
                        alt="Featured preview"
                        fill
                        className="w-full h-48 object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Blog Content */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Content</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TiptapEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Start writing your blog post..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* SEO Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="metadata.metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO-friendly title (optional)" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty to use blog title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SEO description (120-160 characters)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metadata.keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      value={keywordInput}
                      onChange={e => setKeywordInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (keywordInput.trim()) {
                            field.onChange([...(field.value || []), keywordInput.trim()]);
                            setKeywordInput('');
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (keywordInput.trim()) {
                          field.onChange([...(field.value || []), keywordInput.trim()]);
                          setKeywordInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((keyword, i) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                        <button
                          type="button"
                          className="ml-2"
                          onClick={() => {
                            field.onChange(field.value?.filter((_, idx) => idx !== i));
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metadata.canonicalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadata.ogImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OG Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>For social media sharing</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Blog Post'}
                </Button>
                {onPreview && (
                  <Button type="button" variant="outline" onClick={onPreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
