# Authors API Documentation

Complete API request/response specification for all author-related endpoints in the Research Team section.

## Base Configuration

- **Base URL**: Configured in `lib/config.ts` (typically `/api`)
- **Authentication**: JWT Bearer token (auto-refreshed)
- **Content-Type**: `application/json`
- **Response Format**: All responses wrapped in `ApiResponse<T>`

---

## Standard Response Wrapper

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data"?: T,
  "error"?: string,
  "meta"?: {
    "page"?: number,
    "limit"?: number,
    "total"?: number,
    "total_pages"?: number
  }
}
```

---

## 1. Get All Authors

### Endpoint

```
GET /api/v1/authors
```

### Authentication

✅ Required (authenticated users only)

### Query Parameters

```typescript
{
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 50)
  search?: string;        // Search by name
}
```

### Request Example

```http
GET /api/v1/authors?page=1&limit=50
```

### Response Structure

```typescript
{
  "success": true,
  "data": {
    "authors": [
      {
        "id": "1",
        "name": "Dr. Michael Chen",
        "role": "Lead Analyst",
        "bio": "Dr. Chen has over 15 years of experience in healthcare market research with a focus on pharmaceutical and biotechnology sectors. He holds a PhD in Healthcare Economics from Harvard University.",
        "createdAt": "2024-01-10T10:30:00Z",
        "updatedAt": "2024-01-15T14:22:00Z"
      },
      {
        "id": "2",
        "name": "Dr. Sarah Johnson",
        "role": "Principal Consultant",
        "bio": "Dr. Johnson specializes in medical device market analysis and regulatory affairs. She has published numerous research papers on healthcare innovation and market dynamics.",
        "createdAt": "2024-01-12T09:15:00Z",
        "updatedAt": "2024-01-12T09:15:00Z"
      }
      // ... more authors
    ],
    "total": 25
  },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 25,
    "total_pages": 1
  }
}
```

### Error Response

```typescript
{
  "success": false,
  "error": "Authentication required"
}
```

---

## 2. Get Author by ID

### Endpoint

```
GET /api/v1/authors/{id}
```

### Authentication

✅ Required (authenticated users only)

### Path Parameters

- `id` (string): Author unique identifier

### Request Example

```http
GET /api/v1/authors/1
```

### Response Structure

```typescript
{
  "success": true,
  "data": {
    "author": {
      "id": "1",
      "name": "Dr. Michael Chen",
      "role": "Lead Analyst",
      "bio": "Dr. Chen has over 15 years of experience in healthcare market research with a focus on pharmaceutical and biotechnology sectors. He holds a PhD in Healthcare Economics from Harvard University.",
      "createdAt": "2024-01-10T10:30:00Z",
      "updatedAt": "2024-01-15T14:22:00Z"
    }
  }
}
```

### Error Response

```typescript
// Author Not Found
{
  "success": false,
  "error": "Author not found"
}

// Authentication Error
{
  "success": false,
  "error": "No authentication token"
}
```

---

## 3. Create New Author

### Endpoint

```
POST /api/v1/authors
```

### Authentication

✅ Required (admin/editor only)

### Request Headers

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body

```typescript
{
  "name": "Dr. Emily Rodriguez",      // Required, min 2 characters
  "role": "Senior Analyst",            // Optional
  "bio": "Dr. Rodriguez specializes in oncology market research and has over 10 years of experience in pharmaceutical consulting."  // Optional
}
```

### Minimum Required Fields

```typescript
{
  "name": "Dr. Emily Rodriguez"
}
```

### Request Example

```http
POST /api/v1/authors
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Dr. Emily Rodriguez",
  "role": "Senior Analyst",
  "bio": "Dr. Rodriguez specializes in oncology market research and has over 10 years of experience in pharmaceutical consulting."
}
```

### Success Response

```typescript
{
  "success": true,
  "data": {
    "author": {
      "id": "26",
      "name": "Dr. Emily Rodriguez",
      "role": "Senior Analyst",
      "bio": "Dr. Rodriguez specializes in oncology market research and has over 10 years of experience in pharmaceutical consulting.",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

### Error Responses

```typescript
// Validation Error
{
  "success": false,
  "error": "Name must be at least 2 characters"
}

// Authentication Error
{
  "success": false,
  "error": "No authentication token"
}

// Authorization Error
{
  "success": false,
  "error": "Insufficient permissions - admin or editor role required"
}
```

---

## 4. Update Existing Author

### Endpoint

```
PUT /api/v1/authors/{id}
```

### Authentication

✅ Required (admin/editor only)

### Path Parameters

- `id` (string): Author unique identifier

### Request Headers

```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body

All fields are optional (partial update supported):

```typescript
{
  "name"?: "Dr. Emily M. Rodriguez",
  "role"?: "Lead Senior Analyst",
  "bio"?: "Updated biography with additional credentials and experience..."
}
```

### Request Example

```http
PUT /api/v1/authors/26
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "role": "Lead Senior Analyst",
  "bio": "Dr. Rodriguez specializes in oncology market research and has over 12 years of experience in pharmaceutical consulting. She recently completed advanced training in AI-driven market analysis."
}
```

### Success Response

```typescript
{
  "success": true,
  "data": {
    "author": {
      "id": "26",
      "name": "Dr. Emily Rodriguez",
      "role": "Lead Senior Analyst",
      "bio": "Dr. Rodriguez specializes in oncology market research and has over 12 years of experience in pharmaceutical consulting. She recently completed advanced training in AI-driven market analysis.",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  }
}
```

### Error Responses

```typescript
// Author Not Found
{
  "success": false,
  "error": "Author not found"
}

// Validation Error
{
  "success": false,
  "error": "Name must be at least 2 characters"
}

// Authorization Error
{
  "success": false,
  "error": "Insufficient permissions - admin or editor role required"
}
```

---

## 5. Delete Author

### Endpoint

```
DELETE /api/v1/authors/{id}
```

### Authentication

✅ Required (admin only)

### Path Parameters

- `id` (string): Author unique identifier

### Request Headers

```http
Authorization: Bearer {access_token}
```

### Request Example

```http
DELETE /api/v1/authors/26
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Success Response

```typescript
{
  "success": true,
  "data": {
    "message": "Author deleted successfully"
  }
}
```

### Error Responses

```typescript
// Author Not Found
{
  "success": false,
  "error": "Author not found"
}

// Authorization Error
{
  "success": false,
  "error": "Only admins can delete authors"
}

// Constraint Error (Author is referenced in reports)
{
  "success": false,
  "error": "Cannot delete author: Author is referenced in 5 reports. Please remove author from reports first."
}
```

---

## Data Field Specifications

### Author Fields

| Field       | Type   | Required | Description                        | Validation          |
| ----------- | ------ | -------- | ---------------------------------- | ------------------- |
| `id`        | string | Auto     | Unique identifier (auto-generated) | -                   |
| `name`      | string | Yes      | Author full name                   | Min 2 characters    |
| `role`      | string | No       | Job title or role in research team | Max 100 characters  |
| `bio`       | string | No       | Detailed background and experience | Max 1000 characters |
| `createdAt` | string | Auto     | ISO 8601 timestamp of creation     | Auto-generated      |
| `updatedAt` | string | Auto     | ISO 8601 timestamp of last update  | Auto-updated        |

### Field Examples

```typescript
{
  "name": "Dr. Michael Chen",
  "role": "Lead Analyst, Principal Consultant, Senior Researcher",
  "bio": "Dr. Chen has over 15 years of experience in healthcare market research with a focus on pharmaceutical and biotechnology sectors. He holds a PhD in Healthcare Economics from Harvard University and has authored over 50 research reports on global healthcare markets."
}
```

---

## Status Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created (POST successful)            |
| 400  | Bad Request (validation error)       |
| 401  | Unauthorized (no/invalid token)      |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found (author doesn't exist)     |
| 409  | Conflict (constraint violation)      |
| 500  | Internal Server Error                |

---

## Authentication Flow

### Token Included in Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Auto Token Refresh

The API client automatically:

1. Checks token expiration before each request
2. Calls `/api/v1/auth/refresh` if expired
3. Retries original request with new token
4. Clears tokens and throws error if refresh fails

---

## Frontend Usage Examples

### Fetch All Authors

```typescript
import { fetchAuthors } from '@/lib/api/authors';

const response = await fetchAuthors();

console.log(response.authors); // Array of authors
console.log(response.total); // Total count
```

### Get Single Author

```typescript
import { fetchAuthorById } from '@/lib/api/authors';

const response = await fetchAuthorById('1');

console.log(response.author); // Author object
```

### Create New Author

```typescript
import { createAuthor } from '@/lib/api/authors';

const response = await createAuthor({
  name: 'Dr. Emily Rodriguez',
  role: 'Senior Analyst',
  bio: 'Expert in oncology market research...',
});

console.log(response.author.id); // New author ID
console.log(response.author.name); // "Dr. Emily Rodriguez"
```

### Update Author

```typescript
import { updateAuthor } from '@/lib/api/authors';

const response = await updateAuthor('26', {
  role: 'Lead Senior Analyst',
  bio: 'Updated biography...',
});

console.log(response.author.role); // "Lead Senior Analyst"
```

### Delete Author

```typescript
import { deleteAuthor } from '@/lib/api/authors';

await deleteAuthor('26');
console.log('Author deleted successfully');
```

---

## Integration with Reports

Authors are referenced in reports via the `authorIds` field:

```typescript
// Report with multiple authors
{
  "title": "Global Healthcare Market Report",
  "authorIds": ["1", "2", "5"],  // References to authors
  // ... other report fields
}
```

### Fetching Report with Author Details

```typescript
import { fetchReportBySlug } from '@/lib/api/reports';

const response = await fetchReportBySlug('global-healthcare-market-2024');

// Authors need to be fetched separately if needed
const authorIds = response.data.author_ids || [];
const authors = await Promise.all(authorIds.map(id => fetchAuthorById(id)));
```

---

## Notes

1. **Author Deletion**:
   - Cannot delete authors referenced in published reports
   - Must remove author from all reports first
   - Soft delete may be implemented on backend

2. **Validation**:
   - Name is the only required field
   - Role and bio are optional but recommended
   - Bio supports plain text (may be extended to HTML in future)

3. **Permissions**:
   - Read operations: All authenticated users
   - Create/Update: Admin and Editor roles
   - Delete: Admin role only

4. **Search & Filtering**:
   - Basic search by name supported
   - May be extended to search by role or bio content
   - Case-insensitive search

5. **Pagination**:
   - Default limit is 50 authors per page
   - Most organizations have < 50 authors
   - Pagination available for larger teams

---

## File References

- **API Service**: `lib/api/authors.ts`
- **API Client**: `lib/api/client.ts`
- **Types**: `lib/types/reports.ts` (ReportAuthor, AuthorFormData, AuthorsResponse, AuthorResponse)
- **Form Component**: `components/authors/author-form.tsx`
- **Frontend Validation**: Zod schema in `author-form.tsx`

---

## Related Endpoints

- **Reports API**: See `REPORTS_API_DOCUMENTATION.md`
- **Authentication API**: `/api/v1/auth/*`
- **Categories API**: `/api/v1/categories/*`
