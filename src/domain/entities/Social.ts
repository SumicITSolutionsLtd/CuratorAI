export interface SocialPost {
  id: string
  userId: string
  author: {
    id: string
    username: string
    fullName: string
    photoUrl?: string
  }
  images: string[]
  caption: string
  tags: string[]
  taggedItems?: string[]
  outfitId?: string
  likes: number
  comments: number
  shares: number
  saves: number
  isLiked: boolean
  isSaved: boolean
  privacy: 'public' | 'friends' | 'private'
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  userId: string
  author: {
    id: string
    username: string
    fullName: string
    photoUrl?: string
  }
  content: string
  likes: number
  isLiked: boolean
  parentCommentId?: string
  replies?: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date
}

export interface FeedFilter {
  type: 'following' | 'forYou' | 'trending'
  page?: number
  limit?: number
}
