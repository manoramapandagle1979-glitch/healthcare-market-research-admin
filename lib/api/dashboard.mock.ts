import type { DashboardStats, ActivityResponse, Activity } from '@/lib/types/dashboard';

/**
 * Mock implementation of fetchDashboardStats
 * Simulates network delay and returns realistic test data
 */
export async function fetchDashboardStatsMock(): Promise<DashboardStats> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    reports: {
      total: 24,
      published: 18,
      draft: 6,
      change: 12.5,
    },
    blogs: {
      total: 48,
      published: 42,
      draft: 6,
      change: 8.3,
    },
    users: {
      total: 1234,
      active: 856,
      change: 23.1,
    },
    traffic: {
      views: 45200,
      uniqueVisitors: 12300,
      change: 18.4,
    },
    leads: {
      total: 89,
      new: 12,
      change: 15.7,
    },
  };
}

/**
 * Mock implementation of fetchRecentActivity
 * Simulates network delay and returns realistic activity data
 * @param limit - Number of activities to return
 */
export async function fetchRecentActivityMock(limit: number = 10): Promise<ActivityResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const now = Date.now();
  const allActivities: Activity[] = [
    {
      id: '1',
      type: 'report_published',
      title: 'Healthcare Market Trends 2024',
      description: 'Q4 market analysis published',
      user: {
        id: 'user1',
        email: 'admin@example.com',
        name: 'Admin User',
      },
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      type: 'blog_updated',
      title: 'Understanding Market Research',
      description: 'Added new section on data analysis',
      user: {
        id: 'user2',
        email: 'editor@example.com',
        name: 'Editor User',
      },
      timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: '3',
      type: 'user_registered',
      title: 'New user registered',
      description: 'john.doe@example.com',
      timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: '4',
      type: 'lead_captured',
      title: 'New inquiry received',
      description: 'Interest in Pharmaceutical Market Report',
      timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    },
    {
      id: '5',
      type: 'report_updated',
      title: 'Medical Devices Market Report',
      description: 'Updated pricing and forecast sections',
      user: {
        id: 'user1',
        email: 'admin@example.com',
        name: 'Admin User',
      },
      timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    },
    {
      id: '6',
      type: 'blog_published',
      title: 'Top 10 Healthcare Trends in 2024',
      description: 'New blog post about emerging healthcare trends',
      user: {
        id: 'user2',
        email: 'editor@example.com',
        name: 'Editor User',
      },
      timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      id: '7',
      type: 'lead_captured',
      title: 'New inquiry received',
      description: 'Request for custom research on biotech sector',
      timestamp: new Date(now - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    },
    {
      id: '8',
      type: 'report_published',
      title: 'Digital Health Market Analysis',
      description: 'Comprehensive report on digital health trends',
      user: {
        id: 'user1',
        email: 'admin@example.com',
        name: 'Admin User',
      },
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: '9',
      type: 'user_registered',
      title: 'New user registered',
      description: 'sarah.smith@healthcare.com',
      timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
    {
      id: '10',
      type: 'blog_updated',
      title: 'Market Research Best Practices',
      description: 'Added case studies and examples',
      user: {
        id: 'user2',
        email: 'editor@example.com',
        name: 'Editor User',
      },
      timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    },
    {
      id: '11',
      type: 'lead_captured',
      title: 'New inquiry received',
      description: 'Interest in Telemedicine Market Report',
      timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
    {
      id: '12',
      type: 'report_published',
      title: 'AI in Healthcare Market Report',
      description: 'Analysis of AI adoption in healthcare industry',
      user: {
        id: 'user1',
        email: 'admin@example.com',
        name: 'Admin User',
      },
      timestamp: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    },
  ];

  // Return only the requested number of activities
  const activities = allActivities.slice(0, limit);

  return {
    activities,
    total: allActivities.length,
  };
}
