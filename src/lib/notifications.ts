export type NotificationType =
  | 'alert'
  | 'breaking'
  | 'info'
  | 'system'
  | 'campaign'
  | 'contact'
  | 'subscription'
  | 'article'
  | 'health_tip';

export type NotificationAudience = 'all' | 'users' | 'admin' | 'user';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  audience: NotificationAudience;
  user_id?: string | null;
  link_url?: string | null;
  icon?: string | null;
  priority: NotificationPriority;
  is_read: boolean;
  is_broadcast: boolean;
  expires_at?: string | null;
  created_at: string;
  created_by?: string | null;
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}
