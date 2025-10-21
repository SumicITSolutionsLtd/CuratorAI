import { ISocialRepository, CreatePostData } from '@domain/repositories/ISocialRepository'
import { SocialPost, Comment, FeedFilter } from '@domain/entities/Social'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

export class SocialRepository implements ISocialRepository {
  async getFeed(filter: FeedFilter): Promise<PaginatedResponse<SocialPost>> {
    return await apiClient.post<PaginatedResponse<SocialPost>>('/social/feed', filter)
  }

  async getPostById(postId: string): Promise<SocialPost> {
    return await apiClient.get<SocialPost>(`/social/posts/${postId}`)
  }

  async createPost(data: CreatePostData): Promise<SocialPost> {
    const formData = new FormData()
    data.images.forEach((image) => formData.append('images', image))
    formData.append('caption', data.caption)
    formData.append('tags', JSON.stringify(data.tags))
    if (data.taggedItems) {
      formData.append('taggedItems', JSON.stringify(data.taggedItems))
    }
    if (data.outfitId) {
      formData.append('outfitId', data.outfitId)
    }
    formData.append('privacy', data.privacy)

    return await apiClient.upload<SocialPost>('/social/posts', formData)
  }

  async updatePost(postId: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    return await apiClient.patch<SocialPost>(`/social/posts/${postId}`, updates)
  }

  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}`)
  }

  async likePost(userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/like`, { userId })
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}/like`)
  }

  async savePost(userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/save`, { userId })
  }

  async unsavePost(userId: string, postId: string): Promise<void> {
    await apiClient.delete(`/social/posts/${postId}/save`)
  }

  async sharePost(userId: string, postId: string): Promise<void> {
    await apiClient.post(`/social/posts/${postId}/share`, { userId })
  }

  async getComments(
    postId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> {
    return await apiClient.get<PaginatedResponse<Comment>>(
      `/social/posts/${postId}/comments?page=${page}&limit=${limit}`
    )
  }

  async addComment(
    userId: string,
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    return await apiClient.post<Comment>(`/social/posts/${postId}/comments`, {
      userId,
      content,
      parentId,
    })
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    return await apiClient.patch<Comment>(`/social/comments/${commentId}`, { content })
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/social/comments/${commentId}`)
  }

  async likeComment(userId: string, commentId: string): Promise<void> {
    await apiClient.post(`/social/comments/${commentId}/like`, { userId })
  }

  async unlikeComment(userId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/social/comments/${commentId}/like`)
  }
}
