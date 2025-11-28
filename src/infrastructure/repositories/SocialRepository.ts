import { ISocialRepository, CreatePostData } from '@domain/repositories/ISocialRepository'
import { SocialPost, Comment, FeedFilter } from '@domain/entities/Social'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

// Matches UserBasic schema from API
interface BackendUserBasic {
  id: number
  username: string
  first_name?: string
  last_name?: string
  avatar?: string | null
  is_verified?: boolean
}

// Matches PostImage schema from API
interface BackendPostImage {
  id: number
  image: string
  order: number
  created_at: string
}

// Matches Post schema from API
interface BackendPost {
  id: number
  user: BackendUserBasic
  caption: string
  tags?: string[]
  outfit_id?: number | null
  tagged_items?: string[]
  location_name?: string
  images: BackendPostImage[]
  likes_count: number
  comments_count: number
  shares_count: number
  saves_count: number
  views_count?: number
  is_liked: boolean | string
  is_saved: boolean | string
  privacy: 'public' | 'friends' | 'private'
  created_at: string
  updated_at: string
}

// Matches Comment schema from API
interface BackendComment {
  id: number
  post_id: number
  user: BackendUserBasic
  content: string
  parent_comment_id?: number | null
  likes_count: number
  is_liked: boolean | string
  replies_count?: number | string
  replies?: BackendComment[]
  created_at: string
  updated_at: string
}

interface BackendPaginatedResponse<T> {
  results: T[]
  count: number
  page?: number
  current_page?: number
  total_pages?: number
  has_more?: boolean
  next?: string | null
  previous?: string | null
}

function transformPost(post: BackendPost): SocialPost {
  // Handle cases where user might be missing or null
  const user = post.user || {
    id: 0,
    username: 'unknown',
    first_name: undefined,
    last_name: undefined,
    avatar: undefined,
    is_verified: false,
  }

  // Build full name from first_name + last_name
  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Unknown User'

  // Extract image URLs from PostImage objects
  const imageUrls = (post.images || []).map((img) => (typeof img === 'string' ? img : img.image))

  // Handle is_liked and is_saved which can be boolean or string
  const isLiked =
    typeof post.is_liked === 'string'
      ? post.is_liked === 'true' || post.is_liked === 'True'
      : Boolean(post.is_liked)
  const isSaved =
    typeof post.is_saved === 'string'
      ? post.is_saved === 'true' || post.is_saved === 'True'
      : Boolean(post.is_saved)

  return {
    id: String(post.id),
    userId: String(user.id),
    author: {
      id: String(user.id),
      username: user.username || 'unknown',
      fullName: fullName,
      photoUrl: user.avatar || undefined,
    },
    images: imageUrls,
    caption: post.caption || '',
    tags: post.tags || [],
    taggedItems: post.tagged_items,
    outfitId: post.outfit_id ? String(post.outfit_id) : undefined,
    likes: post.likes_count ?? 0,
    comments: post.comments_count ?? 0,
    shares: post.shares_count ?? 0,
    saves: post.saves_count ?? 0,
    isLiked,
    isSaved,
    privacy: post.privacy || 'public',
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
  }
}

function transformComment(comment: BackendComment): Comment {
  // Handle cases where user might be missing or null
  const user = comment.user || {
    id: 0,
    username: 'unknown',
    first_name: undefined,
    last_name: undefined,
    avatar: undefined,
    is_verified: false,
  }

  // Build full name from first_name + last_name
  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Unknown User'

  // Handle is_liked which can be boolean or string
  const isLiked =
    typeof comment.is_liked === 'string'
      ? comment.is_liked === 'true' || comment.is_liked === 'True'
      : Boolean(comment.is_liked)

  return {
    id: String(comment.id),
    postId: String(comment.post_id),
    userId: String(user.id),
    author: {
      id: String(user.id),
      username: user.username || 'unknown',
      fullName: fullName,
      photoUrl: user.avatar || undefined,
    },
    content: comment.content,
    likes: comment.likes_count ?? 0,
    isLiked,
    parentCommentId: comment.parent_comment_id ? String(comment.parent_comment_id) : undefined,
    replies: comment.replies?.map(transformComment),
    createdAt: new Date(comment.created_at),
    updatedAt: new Date(comment.updated_at),
  }
}

export class SocialRepository implements ISocialRepository {
  async getFeed(filter: FeedFilter): Promise<PaginatedResponse<SocialPost>> {
    const params = new URLSearchParams()
    if (filter.type) params.append('type', filter.type)

    const page = filter.page || 1
    const limit = filter.limit || 20

    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await apiClient.get<BackendPaginatedResponse<BackendPost>>(
      `/social/feed/?${params.toString()}`
    )

    const results = (response.results || []).map(transformPost)
    const totalPages = response.total_pages || Math.ceil((response.count || 0) / limit)
    const currentPage = response.page || response.current_page || page

    return {
      results,
      count: response.count || results.length,
      currentPage,
      totalPages,
      hasMore: response.has_more ?? (response.next !== null && currentPage < totalPages),
    }
  }

  async getPostById(postId: string): Promise<SocialPost> {
    const response = await apiClient.get<BackendPost>(`/social/posts/${postId}/`)
    return transformPost(response)
  }

  async createPost(data: CreatePostData): Promise<SocialPost> {
    const formData = new FormData()
    data.images.forEach((image) => formData.append('images', image))
    formData.append('caption', data.caption)
    formData.append('tags', JSON.stringify(data.tags))
    if (data.taggedItems) {
      formData.append('tagged_items', JSON.stringify(data.taggedItems))
    }
    if (data.outfitId) {
      formData.append('outfit_id', data.outfitId)
    }
    formData.append('privacy', data.privacy)

    const response = await apiClient.upload<BackendPost>('/social/posts/', formData)
    return transformPost(response)
  }

  async updatePost(postId: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    const payload: Record<string, unknown> = {}

    if (updates.caption !== undefined) payload.caption = updates.caption
    if (updates.tags !== undefined) payload.tags = updates.tags
    if (updates.privacy !== undefined) payload.privacy = updates.privacy
    if (updates.taggedItems !== undefined) payload.tagged_items = updates.taggedItems

    const response = await apiClient.patch<BackendPost>(`/social/posts/${postId}/update/`, payload)
    return transformPost(response)
  }

  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}/delete/`)
  }

  async likePost(_userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/like/`)
  }

  async unlikePost(_userId: string, postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}/like/`)
  }

  async savePost(_userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/save/`)
  }

  async unsavePost(_userId: string, postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}/save/`)
  }

  async sharePost(_userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/share/`)
  }

  async getComments(
    postId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> {
    const response = await apiClient.get<BackendPaginatedResponse<BackendComment>>(
      `/social/posts/${postId}/comments/?page=${page}&limit=${limit}`
    )

    const results = (response.results || []).map(transformComment)
    const totalPages = response.total_pages || Math.ceil((response.count || 0) / limit)
    const currentPage = response.page || response.current_page || page

    return {
      results,
      count: response.count || results.length,
      currentPage,
      totalPages,
      hasMore: response.has_more ?? (response.next !== null && currentPage < totalPages),
    }
  }

  async addComment(
    _userId: string,
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    const payload: Record<string, string> = { content }
    if (parentId) {
      payload.parent_id = parentId
    }

    const response = await apiClient.post<BackendComment>(
      `/social/posts/${postId}/comments/add/`,
      payload
    )
    return transformComment(response)
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const response = await apiClient.patch<BackendComment>(
      `/social/comments/${commentId}/update/`,
      {
        content,
      }
    )
    return transformComment(response)
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/social/comments/${commentId}/delete/`)
  }

  async likeComment(_userId: string, commentId: string): Promise<void> {
    await apiClient.post(`/social/comments/${commentId}/like/`)
  }

  async unlikeComment(_userId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/social/comments/${commentId}/like/`)
  }

  async reportPost(postId: string, reason: string, additionalInfo?: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/report/`, {
      reason,
      additional_info: additionalInfo,
    })
  }
}
