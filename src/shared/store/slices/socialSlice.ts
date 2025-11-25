import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { SocialPost, Comment, FeedFilter } from '@domain/entities/Social'
import { SocialRepository } from '@infrastructure/repositories/SocialRepository'
import { CreatePostData } from '@domain/repositories/ISocialRepository'
import { extractAPIErrorMessage } from '@/shared/utils/apiErrorHandler'

const socialRepository = new SocialRepository()

interface SocialState {
  feed: SocialPost[]
  currentFeedType: 'following' | 'forYou' | 'trending'
  selectedPost: SocialPost | null
  comments: Comment[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
}

const initialState: SocialState = {
  feed: [],
  currentFeedType: 'forYou',
  selectedPost: null,
  comments: [],
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
}

// ==================== FEED MANAGEMENT ====================

export const fetchFeed = createAsyncThunk(
  'social/fetchFeed',
  async (filter: FeedFilter, { rejectWithValue }) => {
    try {
      return await socialRepository.getFeed(filter)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch feed'))
    }
  }
)

// ==================== POST MANAGEMENT ====================

export const fetchPostById = createAsyncThunk(
  'social/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      return await socialRepository.getPostById(postId)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch post'))
    }
  }
)

export const createPost = createAsyncThunk(
  'social/createPost',
  async (data: CreatePostData, { rejectWithValue }) => {
    try {
      return await socialRepository.createPost(data)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to create post'))
    }
  }
)

export const updatePost = createAsyncThunk(
  'social/updatePost',
  async (
    { postId, updates }: { postId: string; updates: Partial<SocialPost> },
    { rejectWithValue }
  ) => {
    try {
      return await socialRepository.updatePost(postId, updates)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to update post'))
    }
  }
)

export const deletePost = createAsyncThunk(
  'social/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await socialRepository.deletePost(postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete post'))
    }
  }
)

// ==================== POST ACTIONS ====================

export const likePost = createAsyncThunk(
  'social/likePost',
  async ({ userId, postId }: { userId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.likePost(userId, postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to like post'))
    }
  }
)

export const unlikePost = createAsyncThunk(
  'social/unlikePost',
  async ({ userId, postId }: { userId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unlikePost(userId, postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unlike post'))
    }
  }
)

export const savePost = createAsyncThunk(
  'social/savePost',
  async ({ userId, postId }: { userId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.savePost(userId, postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to save post'))
    }
  }
)

export const unsavePost = createAsyncThunk(
  'social/unsavePost',
  async ({ userId, postId }: { userId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unsavePost(userId, postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unsave post'))
    }
  }
)

export const sharePost = createAsyncThunk(
  'social/sharePost',
  async ({ userId, postId }: { userId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.sharePost(userId, postId)
      return postId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to share post'))
    }
  }
)

// ==================== COMMENT MANAGEMENT ====================

export const fetchComments = createAsyncThunk(
  'social/fetchComments',
  async (
    { postId, page = 1, limit = 20 }: { postId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await socialRepository.getComments(postId, page, limit)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch comments'))
    }
  }
)

export const addComment = createAsyncThunk(
  'social/addComment',
  async (
    {
      userId,
      postId,
      content,
      parentId,
    }: { userId: string; postId: string; content: string; parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await socialRepository.addComment(userId, postId, content, parentId)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to add comment'))
    }
  }
)

export const updateComment = createAsyncThunk(
  'social/updateComment',
  async ({ commentId, content }: { commentId: string; content: string }, { rejectWithValue }) => {
    try {
      return await socialRepository.updateComment(commentId, content)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to update comment'))
    }
  }
)

export const deleteComment = createAsyncThunk(
  'social/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await socialRepository.deleteComment(commentId)
      return commentId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete comment'))
    }
  }
)

export const likeComment = createAsyncThunk(
  'social/likeComment',
  async ({ userId, commentId }: { userId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.likeComment(userId, commentId)
      return commentId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to like comment'))
    }
  }
)

export const unlikeComment = createAsyncThunk(
  'social/unlikeComment',
  async ({ userId, commentId }: { userId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unlikeComment(userId, commentId)
      return commentId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unlike comment'))
    }
  }
)

// ==================== SLICE ====================

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFeedType: (state, action: PayloadAction<'following' | 'forYou' | 'trending'>) => {
      state.currentFeedType = action.payload
      state.feed = []
      state.currentPage = 1
      state.hasMore = true
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null
      state.comments = []
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== FETCH FEED ====================
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.currentPage === 1) {
          state.feed = action.payload.results
        } else {
          state.feed = [...state.feed, ...action.payload.results]
        }
        state.hasMore = action.payload.hasMore
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== FETCH POST BY ID ====================
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedPost = action.payload
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== CREATE POST ====================
      .addCase(createPost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.feed = [action.payload, ...state.feed]
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== UPDATE POST ====================
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.feed.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.feed[index] = action.payload
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE POST ====================
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false
        state.feed = state.feed.filter((post) => post.id !== action.payload)
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== LIKE POST ====================
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p.id === action.payload)
        if (post) {
          post.isLiked = true
          post.likes += 1
        }
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost.isLiked = true
          state.selectedPost.likes += 1
        }
      })

      // ==================== UNLIKE POST ====================
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p.id === action.payload)
        if (post) {
          post.isLiked = false
          post.likes -= 1
        }
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost.isLiked = false
          state.selectedPost.likes -= 1
        }
      })

      // ==================== SAVE POST ====================
      .addCase(savePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p.id === action.payload)
        if (post) {
          post.isSaved = true
          post.saves += 1
        }
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost.isSaved = true
          state.selectedPost.saves += 1
        }
      })

      // ==================== UNSAVE POST ====================
      .addCase(unsavePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p.id === action.payload)
        if (post) {
          post.isSaved = false
          post.saves -= 1
        }
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost.isSaved = false
          state.selectedPost.saves -= 1
        }
      })

      // ==================== SHARE POST ====================
      .addCase(sharePost.fulfilled, (state, action) => {
        const post = state.feed.find((p) => p.id === action.payload)
        if (post) {
          post.shares += 1
        }
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost.shares += 1
        }
      })

      // ==================== FETCH COMMENTS ====================
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.currentPage === 1) {
          state.comments = action.payload.results
        } else {
          state.comments = [...state.comments, ...action.payload.results]
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== ADD COMMENT ====================
      .addCase(addComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = [action.payload, ...state.comments]
        // Update comment count in post
        const post = state.feed.find((p) => p.id === action.payload.postId)
        if (post) {
          post.comments += 1
        }
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost.comments += 1
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== UPDATE COMMENT ====================
      .addCase(updateComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
        if (index !== -1) {
          state.comments[index] = action.payload
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE COMMENT ====================
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false
        const comment = state.comments.find((c) => c.id === action.payload)
        if (comment) {
          state.comments = state.comments.filter((c) => c.id !== action.payload)
          // Update comment count in post
          const post = state.feed.find((p) => p.id === comment.postId)
          if (post) {
            post.comments -= 1
          }
          if (state.selectedPost?.id === comment.postId) {
            state.selectedPost.comments -= 1
          }
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== LIKE COMMENT ====================
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c.id === action.payload)
        if (comment) {
          comment.isLiked = true
          comment.likes += 1
        }
      })

      // ==================== UNLIKE COMMENT ====================
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c.id === action.payload)
        if (comment) {
          comment.isLiked = false
          comment.likes -= 1
        }
      })
  },
})

export const { clearError, setFeedType, clearSelectedPost } = socialSlice.actions
export default socialSlice.reducer
