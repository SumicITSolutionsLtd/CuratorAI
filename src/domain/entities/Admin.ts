export interface DashboardStats {
  totalUsers: number
  totalOutfits: number
  totalPosts: number
  totalReports: number
  conversionRate: number
  revenue: number
  userGrowth: {
    percentage: number
    trend: 'up' | 'down'
  }
  outfitGrowth: {
    percentage: number
    trend: 'up' | 'down'
  }
  revenueGrowth: {
    percentage: number
    trend: 'up' | 'down'
  }
}

export interface UserManagementFilter {
  role?: 'user' | 'admin' | 'moderator'
  status?: 'active' | 'suspended' | 'banned'
  search?: string
  limit?: number
  offset?: number
}

export interface ManagedUser {
  id: string
  email: string
  username: string
  fullName: string
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'suspended' | 'banned'
  joinedAt: Date
  lastActive?: Date
  totalPosts: number
  totalOutfits: number
}

export interface ContentReport {
  id: string
  reportedBy: string[]
  reportCount: number
  contentType: 'post' | 'comment' | 'user'
  contentId: string
  content: {
    id: string
    author: {
      id: string
      username: string
      photoUrl?: string
    }
    preview: string
    imageUrl?: string
  }
  reason: 'inappropriate' | 'spam' | 'harassment' | 'copyright' | 'other'
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: Date
  resolvedAt?: Date
  resolvedBy?: string
}

export interface ModeratorAction {
  action: 'approve' | 'remove' | 'ban' | 'warn'
  contentId: string
  userId: string
  reason?: string
  duration?: number // for temporary bans
}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    date: string
    users: number
    outfits: number
    posts: number
    revenue: number
  }[]
}
