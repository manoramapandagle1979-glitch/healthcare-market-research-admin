# API Integration Documentation

This document describes the API integration implementation based on the Swagger specification.

## Overview

The application now has full integration with the backend API as defined in `swagger.json`. The implementation maintains backward compatibility with existing components while providing new swagger-aligned API functions.

## Architecture

### 1. Type Definitions

#### **lib/types/api-types.ts** (NEW)

Swagger-aligned TypeScript types matching the backend API exactly:

- `ApiResponse<T>` - Standard API response wrapper
- `ApiReport`, `ApiReportWithRelations` - Report entities
- `ApiCategory` - Category entities
- `LoginRequest`, `LoginResponse`, etc. - Authentication types
- All types use `snake_case` field names matching the backend

#### **lib/types/reports.ts** (EXISTING)

Legacy types maintained for backward compatibility with existing components. Uses `camelCase` convention.

### 2. API Services

#### **lib/api/reports.api.ts** (NEW)

Swagger-aligned report endpoints:

- `fetchReports(filters)` - GET /api/v1/reports
- `fetchReportBySlug(slug)` - GET /api/v1/reports/{slug}
- `createReport(data)` - POST /api/v1/reports
- `updateReport(id, data)` - PUT /api/v1/reports/{id}
- `deleteReport(id)` - DELETE /api/v1/reports/{id}
- `searchReports(query, options)` - GET /api/v1/search
- `fetchReportsByCategory(slug, options)` - GET /api/v1/categories/{slug}/reports

#### **lib/api/categories.api.ts** (NEW)

Category endpoints:

- `fetchCategories(options)` - GET /api/v1/categories
- `fetchCategoryBySlug(slug)` - GET /api/v1/categories/{slug}

#### **lib/api/auth.api.ts** (NEW)

Authentication and user management:

- `login(credentials)` - POST /api/v1/auth/login
- `logout(refreshToken)` - POST /api/v1/auth/logout
- `refreshAccessToken(refreshToken)` - POST /api/v1/auth/refresh
- `fetchUsers(options)` - GET /api/v1/users
- `fetchCurrentUser()` - GET /api/v1/users/me
- `createUser(data)` - POST /api/v1/users
- `updateUser(id, data)` - PUT /api/v1/users/{id}
- `deleteUser(id)` - DELETE /api/v1/users/{id}

#### **lib/api/reports.ts** (UPDATED)

Backward-compatible wrapper that:

- Maintains the original function signatures
- Converts between legacy types and swagger types
- Falls back to mock data when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Uses the new API internally when mock mode is disabled

#### **lib/api/index.ts** (NEW)

Central export point for all API functions.

### 3. API Client

#### **lib/api/client.ts** (UPDATED)

- Updated to handle swagger response format: `{ success, data, error, meta }`
- Properly handles authentication with Bearer tokens
- Automatic token refresh on expiration
- Request timeout handling
- Error handling with `ApiError` class

## Usage

### Using New Swagger-Aligned APIs

```typescript
import { fetchReports, createReport, login } from '@/lib/api';

// Fetch reports with filters
const response = await fetchReports({
  page: 1,
  limit: 20,
  status: 'published',
  category: 'telemedicine',
});

if (response.success && response.data) {
  console.log('Reports:', response.data);
  console.log('Total:', response.meta?.total);
}

// Create a new report
const newReport = await createReport({
  title: 'New Market Report',
  summary: 'Summary text',
  status: 'draft',
  category_id: 1,
  // ... other fields
});

// Login
const loginResponse = await login({
  email: 'user@example.com',
  password: 'password123',
});

if (loginResponse.success && loginResponse.data) {
  // Tokens are automatically stored
  console.log('User:', loginResponse.data.user);
}
```

### Using Legacy APIs (Backward Compatible)

Existing components continue to work without changes:

```typescript
import { fetchReports, createReport } from '@/lib/api/reports';

// These functions work exactly as before
const { reports, total, page } = await fetchReports({
  status: 'published',
  page: 1,
  limit: 10,
});

const { report } = await createReport({
  title: 'New Report',
  summary: 'Summary',
  // ... uses camelCase
});
```

## Key Differences: Swagger Types vs Legacy Types

| Swagger (Backend)                   | Legacy (Frontend)     | Notes                   |
| ----------------------------------- | --------------------- | ----------------------- |
| `snake_case`                        | `camelCase`           | Field naming convention |
| `id: number`                        | `id: string`          | ID types                |
| `category_id: number`               | `category: string`    | Category reference      |
| `author_ids: number[]`              | `authorIds: string[]` | Author references       |
| Response: `{ success, data, meta }` | Direct data           | Response wrapper        |

## Configuration

### Environment Variables

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=https://healthcare-market-research-backend-production.up.railway.app/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Mock Data Toggle
NEXT_PUBLIC_USE_MOCK_DATA=true  # Set to false to use real API
```

## Migration Path

### For New Components

Use the swagger-aligned APIs directly:

```typescript
import { fetchReports, ApiReport } from '@/lib/api';
```

### For Existing Components

No changes required! The wrapper in `lib/api/reports.ts` handles conversion automatically.

### Gradual Migration

1. Keep using existing APIs in components
2. Gradually update components to use new types when refactoring
3. Eventually phase out legacy types once all components are updated

## API Response Structure

All API responses follow this structure:

```typescript
{
  success: boolean;      // true if request succeeded
  data?: T;              // Response data (only if success=true)
  error?: string;        // Error message (only if success=false)
  meta?: {               // Pagination metadata (for list endpoints)
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  }
}
```

## Authentication Flow

1. User calls `login(credentials)`
2. Backend returns `{ access_token, refresh_token, user }`
3. Tokens are automatically stored in localStorage
4. API client automatically adds `Authorization: Bearer {token}` header
5. On token expiration, client automatically refreshes using refresh token
6. On logout, tokens are cleared from localStorage

## Error Handling

```typescript
import { fetchReports, ApiError } from '@/lib/api';

try {
  const response = await fetchReports({ page: 1 });

  if (!response.success) {
    console.error('API Error:', response.error);
  } else {
    // Success - use response.data
  }
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.status}):`, error.message);
  }
}
```

## Testing

### With Mock Data

Set `NEXT_PUBLIC_USE_MOCK_DATA=true` to use mock data for development/testing.

### With Real API

Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and configure `NEXT_PUBLIC_API_BASE_URL` to point to your backend.

## Files Created/Modified

### Created

- `lib/types/api-types.ts` - Swagger-aligned type definitions
- `lib/api/reports.api.ts` - Reports API service
- `lib/api/categories.api.ts` - Categories API service
- `lib/api/auth.api.ts` - Authentication API service
- `lib/api/index.ts` - Central API exports

### Modified

- `lib/api/client.ts` - Updated for swagger response format
- `lib/api/reports.ts` - Added backward-compatible wrapper

## Next Steps

1. **Test the Integration**: Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and test with real backend
2. **Update Components**: Gradually migrate components to use new types
3. **Add Error Boundaries**: Implement proper error handling UI
4. **Add Loading States**: Show loading indicators during API calls
5. **Implement Retry Logic**: Add automatic retry for failed requests
6. **Add Request Caching**: Implement caching strategy for frequently accessed data

## Support

For issues or questions about the API integration, refer to:

- `swagger.json` - API specification
- This documentation
- Backend API documentation at your backend URL
