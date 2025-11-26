import { ISocialRepository, CreatePostData } from '@domain/repositories/ISocialRepository'
import { SocialPost, Comment, FeedFilter } from '@domain/entities/Social'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

interface BackendPost {
  id: string
  user_id: string
  author: {
    id: string
    username: string
    full_name?: string
    first_name?: string
    last_name?: string
    photo_url?: string
    avatar?: string
  }
  images: string[]
  caption: string
  tags: string[]
  tagged_items?: string[]
  outfit_id?: string
  likes_count?: number
  likes?: number
  comments_count?: number
  comments?: number
  shares_count?: number
  shares?: number
  saves_count?: number
  saves?: number
  is_liked?: boolean
  is_saved?: boolean
  privacy: 'public' | 'friends' | 'private'
  created_at: string
  updated_at: string
}

interface BackendComment {
  id: string
  post_id: string
  user_id: string
  author: {
    id: string
    username: string
    full_name?: string
    first_name?: string
    last_name?: string
    photo_url?: string
    avatar?: string
  }
  content: string
  likes_count?: number
  likes?: number
  is_liked?: boolean
  parent_comment_id?: string
  parent_id?: string
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
  const authorName =
    post.author.full_name ||
    [post.author.first_name, post.author.last_name].filter(Boolean).join(' ') ||
    post.author.username

  return {
    id: post.id,
    userId: post.user_id,
    author: {
      id: post.author.id,
      username: post.author.username,
      fullName: authorName,
      photoUrl: post.author.photo_url || post.author.avatar,
    },
    images: post.images || [],
    caption: post.caption || '',
    tags: post.tags || [],
    taggedItems: post.tagged_items,
    outfitId: post.outfit_id,
    likes: post.likes_count ?? post.likes ?? 0,
    comments: post.comments_count ?? post.comments ?? 0,
    shares: post.shares_count ?? post.shares ?? 0,
    saves: post.saves_count ?? post.saves ?? 0,
    isLiked: post.is_liked ?? false,
    isSaved: post.is_saved ?? false,
    privacy: post.privacy || 'public',
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
  }
}

function transformComment(comment: BackendComment): Comment {
  const authorName =
    comment.author.full_name ||
    [comment.author.first_name, comment.author.last_name].filter(Boolean).join(' ') ||
    comment.author.username

  return {
    id: comment.id,
    postId: comment.post_id,
    userId: comment.user_id,
    author: {
      id: comment.author.id,
      username: comment.author.username,
      fullName: authorName,
      photoUrl: comment.author.photo_url || comment.author.avatar,
    },
    content: comment.content,
    likes: comment.likes_count ?? comment.likes ?? 0,
    isLiked: comment.is_liked ?? false,
    parentCommentId: comment.parent_comment_id || comment.parent_id,
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
