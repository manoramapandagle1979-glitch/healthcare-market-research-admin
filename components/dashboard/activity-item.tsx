import { Skeleton } from '@/components/ui/skeleton';
import type { Activity, ActivityType } from '@/lib/types/dashboard';
import { formatRelativeTime } from '@/lib/utils/date';
import {
  FileText,
  FileEdit,
  FilePlus,
  FileX,
  PenSquare,
  UserPlus,
  UserCog,
  MessageSquare,
  CheckCircle,
  Megaphone,
  LogIn,
  LogOut,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';

const activityIcons: Record<ActivityType, LucideIcon> = {
  report_published: FileText,
  report_created: FilePlus,
  report_updated: FileEdit,
  report_deleted: FileX,
  blog_published: PenSquare,
  blog_created: FilePlus,
  blog_updated: FileEdit,
  blog_deleted: FileX,
  press_release_published: Megaphone,
  press_release_created: FilePlus,
  press_release_updated: FileEdit,
  press_release_deleted: FileX,
  'user.create': UserPlus,
  'user.update': UserCog,
  lead_received: MessageSquare,
  lead_processed: CheckCircle,
  'auth.login': LogIn,
  'auth.logout': LogOut,
  'auth.token_refresh': RefreshCw,
};

const activityColors: Record<ActivityType, string> = {
  report_published: 'bg-blue-500/10 text-blue-500',
  report_created: 'bg-cyan-500/10 text-cyan-500',
  report_updated: 'bg-purple-500/10 text-purple-500',
  report_deleted: 'bg-red-500/10 text-red-500',
  blog_published: 'bg-green-500/10 text-green-500',
  blog_created: 'bg-emerald-500/10 text-emerald-500',
  blog_updated: 'bg-teal-500/10 text-teal-500',
  blog_deleted: 'bg-red-500/10 text-red-500',
  press_release_published: 'bg-indigo-500/10 text-indigo-500',
  press_release_created: 'bg-violet-500/10 text-violet-500',
  press_release_updated: 'bg-purple-500/10 text-purple-500',
  press_release_deleted: 'bg-red-500/10 text-red-500',
  'user.create': 'bg-orange-500/10 text-orange-500',
  'user.update': 'bg-amber-500/10 text-amber-500',
  lead_received: 'bg-pink-500/10 text-pink-500',
  lead_processed: 'bg-lime-500/10 text-lime-500',
  'auth.login': 'bg-green-500/10 text-green-500',
  'auth.logout': 'bg-gray-500/10 text-gray-500',
  'auth.token_refresh': 'bg-blue-500/10 text-blue-500',
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
