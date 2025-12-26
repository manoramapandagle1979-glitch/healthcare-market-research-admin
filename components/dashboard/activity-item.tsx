import { Skeleton } from '@/components/ui/skeleton';
import type { Activity, ActivityType } from '@/lib/types/dashboard';
import { formatRelativeTime } from '@/lib/utils/date';
import {
  FileText,
  FileEdit,
  PenSquare,
  UserPlus,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

const activityIcons: Record<ActivityType, LucideIcon> = {
  report_published: FileText,
  report_updated: FileEdit,
  blog_published: PenSquare,
  blog_updated: PenSquare,
  user_registered: UserPlus,
  lead_captured: MessageSquare,
};

const activityColors: Record<ActivityType, string> = {
  report_published: 'bg-blue-500/10 text-blue-500',
  report_updated: 'bg-purple-500/10 text-purple-500',
  blog_published: 'bg-green-500/10 text-green-500',
  blog_updated: 'bg-green-500/10 text-green-500',
  user_registered: 'bg-orange-500/10 text-orange-500',
  lead_captured: 'bg-pink-500/10 text-pink-500',
};

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type];
  const colorClass = activityColors[activity.type];

  return (
    <div className="flex items-start gap-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        {activity.description && (
          <p className="text-xs text-muted-foreground">{activity.description}</p>
        )}
        <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
