# Report Validation Summary

This document summarizes the validation rules implemented for report creation and editing, aligned with the backend requirements.

## Backend Alignment

The validation has been aligned with the backend requirements from:

- `internal/domain/report/report.go`
- `internal/handler/report_handler.go` (lines 376-390)

## Mandatory Fields

These fields are **required** when creating a new report:

1. **title** (string)
   - Minimum: 10 characters
   - Validation: `z.string().min(10, 'Title must be at least 10 characters')`

2. **slug** (string)
   - Required: Yes
   - Must be unique
   - Format: lowercase letters, numbers, and hyphens only
   - Validation: `z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)`

3. **category_id** (uint)
   - Required: Yes
   - Must reference a valid category
   - Validation: `z.string().min(1, 'Category is required')`

4. **summary** (string)
   - Minimum: 50 characters
   - Validation: `z.string().min(50, 'Summary must be at least 50 characters')`

5. **geography** ([]string)
   - At least one geography required
   - Validation: `z.array(z.string()).min(1, 'Select at least one geography')`

6. **sections** (ReportSections object)
   - All report content sections required
   - Required sections with minimum character counts:
     - executiveSummary: 100 chars
     - marketOverview: 100 chars
     - marketSize: 100 chars
     - competitive: 100 chars
     - keyPlayers: 1 char minimum
     - regional: 1 char minimum
     - trends: 1 char minimum
     - conclusion: 50 chars
     - marketDetails: 100 chars
     - tableOfContents: 50 chars
   - Optional sections:
     - marketDrivers (optional)
     - challenges (optional)

## Optional Fields

### Basic Information

- **description** (string) - Additional report description
- **thumbnail_url** (string) - URL to report thumbnail image

### Pricing

- **price** (float64) - Defaults to 0
- **discounted_price** (float64) - Defaults to 0
- **currency** (string) - Defaults to "USD"

### Report Details

- **page_count** (int) - Defaults to 0
- **formats** ([]string) - Available formats (PDF, Excel, Word, PowerPoint)

### Status & Publishing

- **status** (string) - Defaults to "draft" if not provided
  - Valid values: "draft" or "published"
- **is_featured** (bool) - Defaults to false

### Authors & Contributors

- **author_ids** ([]uint) - Array of user IDs who contributed

### Market Data

- **market_metrics** (MarketMetrics object) - All fields optional:
  - currentRevenue (string)
  - currentYear (number)
  - forecastRevenue (string)
  - forecastYear (number)
  - cagr (string)
  - cagrStartYear (number)
  - cagrEndYear (number)

- **key_players** ([]KeyPlayer array) - Each player includes:
  - name (required, min 2 chars)
  - marketShare (optional)
  - description (optional)

### FAQs & Metadata

- **faqs** ([]FAQ array) - Each FAQ includes:
  - question (min 5 chars)
  - answer (min 10 chars)

- **metadata** (ReportMetadata object) - SEO metadata:
  - metaTitle
  - metaDescription
  - keywords (array)
  - canonicalUrl
  - ogTitle, ogDescription, ogImage, ogType
  - twitterCard
  - schemaJson
  - robotsDirective

### Admin Notes

- **internal_notes** (string) - Admin-only notes

### Legacy Fields

- **meta_title** (string)
- **meta_description** (string)
- **meta_keywords** (string)

## Auto-Managed Fields (Read-Only)

These fields are **automatically managed** by the backend and should **NOT** be included in form submissions:

1. **id** - Auto-generated primary key
2. **created_by** - Auto-set from authenticated user on creation
3. **updated_by** - Auto-set from authenticated user on updates
4. **created_at** - Auto-managed timestamp
5. **updated_at** - Auto-managed timestamp
6. **view_count** - Managed by view tracking system
7. **download_count** - Managed by download tracking system
8. **publish_date** - Auto-set when status changes to "published"

## Files Modified

### Type Definitions

1. **lib/types/api-types.ts**
   - Updated `ApiReportSections` to include `marketDrivers` and `challenges`
   - Reorganized `ApiReport` interface with clear comments for field categories
   - Added all missing fields with proper documentation

2. **lib/types/reports.ts**
   - Updated `ReportSectionKey` type to include new section keys
   - Updated `ReportSections` interface with optional new fields
   - Updated `Report` interface with all new fields
   - Updated `ReportFormData` with detailed field documentation

### Validation

3. **lib/validation/report-schema.ts** (NEW)
   - Centralized validation schema using Zod
   - Aligned with backend validation rules
   - Comprehensive field validation with clear error messages
   - Exported schemas for reuse across components

### API Layer

4. **lib/api/reports.ts**
   - Updated `convertApiReportToLegacy()` to handle all new fields
   - Updated `createReport()` to send all fields to backend
   - Updated `updateReport()` to handle partial updates with new fields

### Forms

5. **components/reports/report-form-tabs.tsx**
   - Switched to centralized `reportFormSchema` from validation file
   - Added all missing fields to form default values
   - Updated sample data to include new fields
   - Added `marketDrivers` and `challenges` sections to sample data

## Validation Behavior

### On Creation

- All mandatory fields must be provided
- Validation errors will prevent form submission
- Backend will apply default values for optional fields not provided

### On Update

- Only fields provided in the update payload will be modified
- Mandatory field validation still applies if those fields are included
- Auto-managed fields are ignored if accidentally included

## Testing Recommendations

1. **Mandatory Field Validation**
   - Test creating report without each mandatory field
   - Verify appropriate error messages appear

2. **Field Length Validation**
   - Test title with < 10 characters
   - Test summary with < 50 characters
   - Test section content with insufficient length

3. **Optional Field Handling**
   - Create report with minimal mandatory fields only
   - Verify defaults are applied by backend

4. **Auto-Managed Fields**
   - Verify these fields cannot be manually set
   - Confirm timestamps are automatically updated

5. **New Fields Integration**
   - Test `marketDrivers` and `challenges` sections
   - Verify `description`, `currency`, `thumbnail_url` work correctly
   - Test `is_featured` and `internal_notes` functionality

## Next Steps

To ensure full integration:

1. Update form UI components to expose new fields (description, thumbnailUrl, currency, isFeatured, internalNotes)
2. Add marketDrivers and challenges to section editor
3. Test end-to-end with backend API
4. Update any documentation or user guides
