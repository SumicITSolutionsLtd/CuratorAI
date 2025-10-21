import { SocialPost, Comment, FeedFilter } from '../entities/Social'
import { PaginatedResponse } from './IOutfitRepository'

export interface CreatePostData {
  userId: string
  images: File[]
  caption: string
  tags: string[]
  taggedItems?: string[]
  outfitId?: string
  privacy: 'public' | 'friends' | 'private'
}

export interface ISocialRepository {
  getFeed(filter: FeedFilter): Promise<PaginatedResponse<SocialPost>>
  getPostById(postId: string): Promise<SocialPost>
  createPost(data: CreatePostData): Promise<SocialPost>
  updatePost(postId: string, updates: Partial<SocialPost>): Promise<SocialPost>
  deletePost(postId: string): Promise<void>
  likePost(userId: string, postId: string): Promise<void>
  unlikePost(userId: string, postId: string): Promise<void>
  savePost(userId: string, postId: string): Promise<void>
  unsavePost(userId: string, postId: string): Promise<void>
  sharePost(userId: string, postId: string): Promise<void>
  getComments(postId: string, page?: number, limit?: number): Promise<PaginatedResponse<Comment>>
  addComment(userId: string, postId: string, content: string, parentId?: string): Promise<Comment>
  updateComment(commentId: string, content: string): Promise<Comment>
  deleteComment(commentId: string): Promise<void>
  likeComment(userId: string, commentId: string): Promise<void>
  unlikeComment(userId: string, commentId: string): Promise<void>
}
