import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import outfitReducer from './slices/outfitSlice'
import wardrobeReducer from './slices/wardrobeSlice'
import socialReducer from './slices/socialSlice'
import searchReducer from './slices/searchSlice'
import cartReducer from './slices/cartSlice'
import notificationReducer from './slices/notificationSlice'
import lookbookReducer from './slices/lookbookSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    outfit: outfitReducer,
    wardrobe: wardrobeReducer,
    social: socialReducer,
    search: searchReducer,
    cart: cartReducer,
    notification: notificationReducer,
    lookbook: lookbookReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['search/uploadImage/pending'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.image', 'payload.images'],
        // Ignore these paths in the state
        ignoredPaths: ['search.uploadedImage'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
