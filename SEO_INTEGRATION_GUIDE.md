# SEO Management Integration Guide

This guide explains how to integrate the new SEO components into the Report and Blog forms.

## ✅ What's Already Complete

All SEO components, types, and admin pages have been created:

- SEO configuration and validation
- Reusable SEO components (character counter, validation alerts, preview cards, etc.)
- SEO metadata section wrapper component
- Admin SEO dashboard at `/seo`
- Extended type definitions for ReportMetadata and BlogMetadata

## 🔄 What Needs Manual Integration

The Report and Blog forms need to be updated to use the new SEO components.

---

## Report Form Integration

**File:** `/components/reports/report-form.tsx`

### Step 1: Update Imports

Add these imports at the top of the file:

```typescript
import { SEOMetadataSection } from '@/components/seo/seo-metadata-section';
import { reportMetadataSchema } from '@/lib/validation/seo';
```

### Step 2: Update Validation Schema

Replace the metadata validation in `reportFormSchema`:

**BEFORE:**

```typescript
metadata: z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
}),
```

**AFTER:**

```typescript
metadata: reportMetadataSchema,
```

### Step 3: Update Default Values

Update the metadata default values in the form to include all new fields:

**BEFORE:**

```typescript
metadata: {
  metaTitle: '',
  metaDescription: '',
  keywords: [],
},
```

**AFTER:**

```typescript
metadata: {
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  schemaJson: '',
  robotsDirective: 'index,follow',
},
```

### Step 4: Replace SEO Metadata Card Content

Replace the entire "SEO Metadata" Card section (lines ~273-363) with:

```typescript
{/* SEO Metadata */}
<Card>
  <CardHeader>
    <CardTitle>SEO Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <SEOMetadataSection
      form={form}
      contentType="report"
      currentTitle={form.watch('title')}
      currentDescription={form.watch('summary')}
    />
  </CardContent>
</Card>
```

### Step 5: Remove Keyword Input State

Remove this line from the component (around line 70):

```typescript
const [keywordInput, setKeywordInput] = useState('');
```

The SEOMetadataSection handles keyword input internally.

---

## Blog Form Integration

**File:** `/components/blogs/blog-form.tsx`

### Step 1: Update Imports

Add these imports:

```typescript
import { SEOMetadataSection } from '@/components/seo/seo-metadata-section';
import { blogMetadataSchema } from '@/lib/validation/seo';
```

### Step 2: Update Validation Schema

Replace the metadata validation in `blogFormSchema`:

**BEFORE:**

```typescript
metadata: z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  ogImage: z.string().url().optional().or(z.literal('')),
}),
```

**AFTER:**

```typescript
metadata: blogMetadataSchema,
```

### Step 3: Update Default Values

Update the metadata default values:

**BEFORE:**

```typescript
metadata: {
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  canonicalUrl: '',
  ogImage: '',
},
```

**AFTER:**

```typescript
metadata: {
  metaTitle: '',
  metaDescription: '',
  keywords: [],
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  schemaJson: '',
  robotsDirective: 'index,follow',
},
```

### Step 4: Replace SEO Metadata Card Content

Replace the "SEO Metadata" Card section with:

```typescript
{/* SEO Metadata */}
<Card>
  <CardHeader>
    <CardTitle>SEO Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <SEOMetadataSection
      form={form}
      contentType="blog"
      currentTitle={form.watch('title')}
      currentDescription={form.watch('excerpt')}
      featuredImage={form.watch('featuredImage')}
    />
  </CardContent>
</Card>
```

### Step 5: Remove Keyword Input State

Remove the keyword input state variable (similar to report form).

---

## Adding SEO to Navigation

To add the SEO Management page to your sidebar navigation, update your navigation config:

**File:** (Your navigation config file, typically in `/app/(dashboard)/layout.tsx` or `/components/sidebar.tsx`)

Add this navigation item:

```typescript
{
  title: 'SEO Management',
  href: '/seo',
  icon: Search, // or any appropriate icon from lucide-react
}
```

---

## Testing the Integration

After making these changes:

1. **Test Report Form:**
   - Create/edit a report
   - Verify all SEO fields appear
   - Check character counters work
   - Verify OpenGraph preview displays
   - Test Schema JSON editor with templates

2. **Test Blog Form:**
   - Create/edit a blog post
   - Verify all SEO fields appear
   - Check that featured image appears in OG preview
   - Test validation warnings

3. **Test SEO Dashboard:**
   - Navigate to `/seo`
   - Verify sitemap manager displays
   - Test sitemap regeneration
   - Verify robots.txt editor works
   - Check SEO stats display correctly

---

## New Features Available

After integration, users can:

### In Report/Blog Forms:

- ✅ Get real-time SEO validation warnings
- ✅ See character counters with optimal ranges
- ✅ Preview how content appears on Twitter/Facebook
- ✅ Add canonical URLs to prevent duplicate content
- ✅ Configure OpenGraph images and Twitter card types
- ✅ Add Schema.org structured data with templates
- ✅ Control robots meta directives

### In SEO Dashboard (`/seo`):

- ✅ View SEO quality metrics across all content
- ✅ Regenerate sitemap
- ✅ Edit robots.txt
- ✅ Monitor SEO coverage (meta descriptions, OG images, schema, etc.)

---

## Backend Requirements

The backend needs to:

1. **Accept new metadata fields** in Report and Blog entities:
   - canonicalUrl
   - ogTitle, ogDescription, ogImage, ogType
   - twitterCard
   - schemaJson
   - robotsDirective

2. **Validate these fields** (URLs, JSON format, etc.)

3. **Implement SEO endpoints** (currently using mock data):
   - `GET /api/v1/admin/seo/sitemap` - Get sitemap data
   - `POST /api/v1/admin/seo/regenerate-sitemap` - Regenerate sitemap
   - `GET /api/v1/admin/seo/robots-txt` - Get robots.txt
   - `PUT /api/v1/admin/seo/robots-txt` - Update robots.txt
   - `GET /api/v1/admin/seo/stats` - Get SEO statistics

See the API contract in the main plan file for detailed backend requirements.

---

## Troubleshooting

### Issue: TypeScript errors about metadata fields

**Solution:** Make sure you've updated the default values to include all new fields.

### Issue: SEOMetadataSection not displaying

**Solution:** Check that you're passing all required props (form, contentType, currentTitle, currentDescription).

### Issue: Form validation failing

**Solution:** Ensure you've replaced the metadata schema with `reportMetadataSchema` or `blogMetadataSchema`.

---

## Additional Notes

- All new metadata fields are **optional** for backward compatibility
- Existing reports/blogs will work without modification
- SEO warnings are informational only, not blocking
- The SEO dashboard uses mock data until backend endpoints are implemented
- Character counters show green/yellow/red based on SEO best practices
