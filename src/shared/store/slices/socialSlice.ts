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
  isLoadingMore: boolean
  isPostActionLoading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  totalCount: number
}

const initialState: SocialState = {
  feed: [],
  currentFeedType: 'forYou',
  selectedPost: null,
  comments: [],
  isLoading: false,
  isLoadingMore: false,
  isPostActionLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  totalCount: 0,
}

// ==================== FEED MANAGEMENT ====================

export const fetchFeed = createAsyncThunk(
  'social/fetchFeed',
  async (filter: FeedFilter, { rejectWithValue }) => {
    try {
      return await socialRepository.getFeed(filter)
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch feed'))
    }
  }
)

export const loadMoreFeed = createAsyncThunk(
  'social/loadMoreFeed',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { social: SocialState }
      const { currentFeedType, currentPage, hasMore } = state.social

      if (!hasMore) {
        return null
      }

      return await socialRepository.getFeed({
        type: currentFeedType,
        page: currentPage + 1,
        limit: 20,
      })
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to load more posts'))
    }
  }
)

// ==================== POST MANAGEMENT ====================

export const fetchPostById = createAsyncThunk(
  'social/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      return await socialRepository.getPostById(postId)
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch post'))
    }
  }
)

export const createPost = createAsyncThunk(
  'social/createPost',
  async (data: CreatePostData, { rejectWithValue }) => {
    try {
      return await socialRepository.createPost(data)
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete post'))
    }
  }
)

// ==================== POST ACTIONS ====================

export const likePost = createAsyncThunk(
  'social/likePost',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.likePost('', postId)
      return postId
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to like post'))
    }
  }
)

export const unlikePost = createAsyncThunk(
  'social/unlikePost',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unlikePost('', postId)
      return postId
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unlike post'))
    }
  }
)

export const savePost = createAsyncThunk(
  'social/savePost',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.savePost('', postId)
      return postId
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to save post'))
    }
  }
)

export const unsavePost = createAsyncThunk(
  'social/unsavePost',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unsavePost('', postId)
      return postId
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unsave post'))
    }
  }
)

export const sharePost = createAsyncThunk(
  'social/sharePost',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.sharePost('', postId)
      return postId
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch comments'))
    }
  }
)

export const addComment = createAsyncThunk(
  'social/addComment',
  async (
    { postId, content, parentId }: { postId: string; content: string; parentId?: string },
    { rejectWithValue }
  ) => {
    try {
      return await socialRepository.addComment('', postId, content, parentId)
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to add comment'))
    }
  }
)

export const updateComment = createAsyncThunk(
  'social/updateComment',
  async ({ commentId, content }: { commentId: string; content: string }, { rejectWithValue }) => {
    try {
      return await socialRepository.updateComment(commentId, content)
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to update comment'))
    }
  }
)

export const deleteComment = createAsyncThunk(
  'social/deleteComment',
  async ({ commentId, postId }: { commentId: string; postId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.deleteComment(commentId)
      return { commentId, postId }
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete comment'))
    }
  }
)

export const likeComment = createAsyncThunk(
  'social/likeComment',
  async ({ commentId }: { commentId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.likeComment('', commentId)
      return commentId
    } catch (error: unknown) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to like comment'))
    }
  }
)

export const unlikeComment = createAsyncThunk(
  'social/unlikeComment',
  async ({ commentId }: { commentId: string }, { rejectWithValue }) => {
    try {
      await socialRepository.unlikeComment('', commentId)
      return commentId
    } catch (error: unknown) {
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
      state.totalCount = 0
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null
      state.comments = []
    },
    // Optimistic updates
    optimisticLikePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post && !post.isLiked) {
        post.isLiked = true
        post.likes += 1
      }
      if (state.selectedPost?.id === action.payload && !state.selectedPost.isLiked) {
        state.selectedPost.isLiked = true
        state.selectedPost.likes += 1
      }
    },
    optimisticUnlikePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post && post.isLiked) {
        post.isLiked = false
        post.likes = Math.max(0, post.likes - 1)
      }
      if (state.selectedPost?.id === action.payload && state.selectedPost.isLiked) {
        state.selectedPost.isLiked = false
        state.selectedPost.likes = Math.max(0, state.selectedPost.likes - 1)
      }
    },
    optimisticSavePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post && !post.isSaved) {
        post.isSaved = true
        post.saves += 1
      }
      if (state.selectedPost?.id === action.payload && !state.selectedPost.isSaved) {
        state.selectedPost.isSaved = true
        state.selectedPost.saves += 1
      }
    },
    optimisticUnsavePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post && post.isSaved) {
        post.isSaved = false
        post.saves = Math.max(0, post.saves - 1)
      }
      if (state.selectedPost?.id === action.payload && state.selectedPost.isSaved) {
        state.selectedPost.isSaved = false
        state.selectedPost.saves = Math.max(0, state.selectedPost.saves - 1)
      }
    },
    rollbackLikePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post) {
        post.isLiked = false
        post.likes = Math.max(0, post.likes - 1)
      }
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost.isLiked = false
        state.selectedPost.likes = Math.max(0, state.selectedPost.likes - 1)
      }
    },
    rollbackUnlikePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post) {
        post.isLiked = true
        post.likes += 1
      }
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost.isLiked = true
        state.selectedPost.likes += 1
      }
    },
    rollbackSavePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post) {
        post.isSaved = false
        post.saves = Math.max(0, post.saves - 1)
      }
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost.isSaved = false
        state.selectedPost.saves = Math.max(0, state.selectedPost.saves - 1)
      }
    },
    rollbackUnsavePost: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.id === action.payload)
      if (post) {
        post.isSaved = true
        post.saves += 1
      }
      if (state.selectedPost?.id === action.payload) {
        state.selectedPost.isSaved = true
        state.selectedPost.saves += 1
      }
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
        state.feed = action.payload.results
        state.hasMore = action.payload.hasMore
        state.currentPage = action.payload.currentPage
        state.totalCount = action.payload.count
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== LOAD MORE FEED ====================
      .addCase(loadMoreFeed.pending, (state) => {
        state.isLoadingMore = true
      })
      .addCase(loadMoreFeed.fulfilled, (state, action) => {
        state.isLoadingMore = false
        if (action.payload) {
          state.feed = [...state.feed, ...action.payload.results]
          state.hasMore = action.payload.hasMore
          state.currentPage = action.payload.currentPage
          state.totalCount = action.payload.count
        }
      })
      .addCase(loadMoreFeed.rejected, (state, action) => {
        state.isLoadingMore = false
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
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isPostActionLoading = false
        state.feed = [action.payload, ...state.feed]
        state.totalCount += 1
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isPostActionLoading = false
        state.error = action.payload as string
      })

      // ==================== UPDATE POST ====================
      .addCase(updatePost.pending, (state) => {
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isPostActionLoading = false
        const index = state.feed.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.feed[index] = action.payload
        }
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isPostActionLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE POST ====================
      .addCase(deletePost.pending, (state) => {
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isPostActionLoading = false
        state.feed = state.feed.filter((post) => post.id !== action.payload)
        state.totalCount = Math.max(0, state.totalCount - 1)
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isPostActionLoading = false
        state.error = action.payload as string
      })

      // ==================== LIKE/UNLIKE/SAVE/UNSAVE/SHARE - No state changes on success ====================
      // (Using optimistic updates via reducers instead)
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(savePost.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(unsavePost.rejected, (state, action) => {
        state.error = action.payload as string
      })
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
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isPostActionLoading = false
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
        state.isPostActionLoading = false
        state.error = action.payload as string
      })

      // ==================== UPDATE COMMENT ====================
      .addCase(updateComment.pending, (state) => {
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isPostActionLoading = false
        const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
        if (index !== -1) {
          state.comments[index] = action.payload
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isPostActionLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE COMMENT ====================
      .addCase(deleteComment.pending, (state) => {
        state.isPostActionLoading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isPostActionLoading = false
        state.comments = state.comments.filter((c) => c.id !== action.payload.commentId)
        // Update comment count in post
        const post = state.feed.find((p) => p.id === action.payload.postId)
        if (post) {
          post.comments = Math.max(0, post.comments - 1)
        }
        if (state.selectedPost?.id === action.payload.postId) {
          state.selectedPost.comments = Math.max(0, state.selectedPost.comments - 1)
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isPostActionLoading = false
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
          comment.likes = Math.max(0, comment.likes - 1)
        }
      })
  },
})

export const {
  clearError,
  setFeedType,
  clearSelectedPost,
  optimisticLikePost,
  optimisticUnlikePost,
  optimisticSavePost,
  optimisticUnsavePost,
  rollbackLikePost,
  rollbackUnlikePost,
  rollbackSavePost,
  rollbackUnsavePost,
} = socialSlice.actions
export default socialSlice.reducer
