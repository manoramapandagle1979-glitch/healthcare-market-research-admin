export type ActivityType =
  | 'report_published'
  | 'report_updated'
  | 'blog_published'
  | 'blog_updated'
  | 'user_registered'
  | 'lead_captured';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  timestamp: string; // ISO 8601 format
  metadata?: Record<string, unknown>;
}

export interface ActivityResponse {
  activities: Activity[];
  total: number;
}

export interface DashboardStats {
  reports: {
    total: number;
    published: number;
    draft: number;
    change: number; // percentage change from last period
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
    change: number;
  };
  users: {
    total: number;
    active: number; // active in last 30 days
    change: number;
  };
  traffic: {
    views: number;
    uniqueVisitors: number;
    change: number;
  };
  leads: {
    total: number;
    new: number; // uncontacted leads
    change: number;
  };
}
