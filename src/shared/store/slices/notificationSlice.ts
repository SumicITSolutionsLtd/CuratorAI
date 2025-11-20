import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Notification, NotificationFilter, NotificationPreferences } from '@domain/entities/Notification'
import { NotificationRepository } from '@infrastructure/repositories/NotificationRepository'

const notificationRepository = new NotificationRepository()

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences | null
  isLoading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async ({ userId, filter }: { userId: string; filter?: NotificationFilter }, { rejectWithValue }) => {
    try {
      return await notificationRepository.getNotifications(userId, filter)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await notificationRepository.getUnreadCount(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count')
    }
  }
)

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationRepository.markAsRead(notificationId)
      return notificationId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read')
    }
  }
)

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (userId: string, { rejectWithValue }) => {
    try {
      await notificationRepository.markAllAsRead(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationRepository.deleteNotification(notificationId)
      return notificationId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
    }
  }
)

export const fetchNotificationPreferences = createAsyncThunk(
  'notification/fetchPreferences',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await notificationRepository.getPreferences(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch preferences')
    }
  }
)

export const updateNotificationPreferences = createAsyncThunk(
  'notification/updatePreferences',
  async (
    { userId, preferences }: { userId: string; preferences: Partial<NotificationPreferences> },
    { rejectWithValue }
  ) => {
    try {
      return await notificationRepository.updatePreferences(userId, preferences)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences')
    }
  }
)

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((n) => !n.isRead).length
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload.results
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload)
        if (notification && !notification.isRead) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.isRead = true))
        state.unreadCount = 0
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload)
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications = state.notifications.filter((n) => n.id !== action.payload)
      })
      // Fetch preferences
      .addCase(fetchNotificationPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload
      })
      // Update preferences
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload
      })
  },
})

export const { setNotifications, clearError } = notificationSlice.actions
export default notificationSlice.reducer
