import { apiClient } from './client';
import type { SitemapResponse, RobotsTxtResponse, SEOStatsResponse } from '@/lib/types/seo';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data for development
const mockSitemapData = {
  sitemap: {
    entries: [
      {
        url: 'https://example.com/',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: 'https://example.com/reports/market-analysis-2024',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: 'https://example.com/blogs/industry-trends',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ],
    totalUrls: 3,
    lastGenerated: new Date().toISOString(),
  },
  success: true,
};

const mockRobotsTxtData = {
  robots: {
    content: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
    lastModified: new Date().toISOString(),
  },
  success: true,
};

const mockSEOStatsData = {
  stats: {
    totalIndexedPages: 150,
    pagesWithMetaDescription: 120,
    pagesWithKeywords: 100,
    pagesWithOGImage: 90,
    pagesWithSchema: 60,
    averageMetaTitleLength: 55,
    averageMetaDescriptionLength: 152,
  },
  success: true,
};

// API Functions
export async function getSitemap(): Promise<SitemapResponse> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockSitemapData);
  }

  return apiClient.get<SitemapResponse>('/seo/sitemap');
}

export async function regenerateSitemap(): Promise<SitemapResponse> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ...mockSitemapData,
          message: 'Sitemap regenerated successfully',
        });
      }, 1500);
    });
  }

  return apiClient.post<SitemapResponse>('/seo/regenerate-sitemap', {});
}

export async function getRobotsTxt(): Promise<RobotsTxtResponse> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockRobotsTxtData);
  }

  return apiClient.get<RobotsTxtResponse>('/seo/robots-txt');
}

export async function updateRobotsTxt(content: string): Promise<RobotsTxtResponse> {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          robots: {
            content,
            lastModified: new Date().toISOString(),
          },
          success: true,
          message: 'robots.txt updated successfully',
        });
      }, 1000);
    });
  }

  return apiClient.put<RobotsTxtResponse>('/seo/robots-txt', { content });
}

export async function getSEOStats(): Promise<SEOStatsResponse> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockSEOStatsData);
  }

  return apiClient.get<SEOStatsResponse>('/seo/stats');
}
