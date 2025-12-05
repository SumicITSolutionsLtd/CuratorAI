import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../pages/Landing/LandingPage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { RegisterPage } from '../pages/Auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/Auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/Auth/ResetPasswordPage'
import { VerifyEmailPage } from '../pages/Auth/VerifyEmailPage'
import { HomePage } from '../pages/Home/HomePage'
import { VisualSearchPage } from '../pages/Search/VisualSearchPage'
import { FeedPage } from '../pages/Social/FeedPage'
import { CreatePostPage } from '../pages/Social/CreatePostPage'
import { PostDetailPage } from '../pages/Social/PostDetailPage'
import { WardrobePage } from '../pages/Wardrobe/WardrobePage'
import { AddWardrobeItemPage } from '../pages/Wardrobe/AddWardrobeItemPage'
import { WardrobeItemDetailPage } from '../pages/Wardrobe/WardrobeItemDetailPage'
import { CreateOutfitPage } from '../pages/Wardrobe/CreateOutfitPage'
import { CartPage } from '../pages/Cart/CartPage'
import { LookbooksPage } from '../pages/Lookbooks/LookbooksPage'
import { LookbookDetailPage } from '../pages/Lookbooks/LookbookDetailPage'
import { CreateLookbookPage } from '../pages/Lookbooks/CreateLookbookPage'
import { TryOnPage } from '../pages/TryOn/TryOnPage'
import { WishlistPage } from '../pages/Wishlist/WishlistPage'
import { CollectionDetailPage } from '../pages/Wishlist/CollectionDetailPage'
import { SettingsPage } from '../pages/Settings/SettingsPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { NotificationsPage } from '../pages/Notifications/NotificationsPage'
import { OutfitDetailPage } from '../pages/Outfit/OutfitDetailPage'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Outfit/Item Routes */}
      <Route
        path="/outfits/:outfitId"
        element={
          <ProtectedRoute>
            <OutfitDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:outfitId"
        element={
          <ProtectedRoute>
            <OutfitDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Wardrobe Routes */}
      <Route
        path="/wardrobe"
        element={
          <ProtectedRoute>
            <WardrobePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wardrobe/add"
        element={
          <ProtectedRoute>
            <AddWardrobeItemPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wardrobe/items/:itemId"
        element={
          <ProtectedRoute>
            <WardrobeItemDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wardrobe/create-outfit"
        element={
          <ProtectedRoute>
            <CreateOutfitPage />
          </ProtectedRoute>
        }
      />

      {/* Search Routes */}
      <Route
        path="/search/visual"
        element={
          <ProtectedRoute>
            <VisualSearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search/results"
        element={
          <ProtectedRoute>
            <div>Search Results</div>
          </ProtectedRoute>
        }
      />

      {/* Social Routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:postId"
        element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/create"
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />

      {/* Lookbook Routes */}
      <Route
        path="/lookbooks"
        element={
          <ProtectedRoute>
            <LookbooksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lookbooks/create"
        element={
          <ProtectedRoute>
            <CreateLookbookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lookbooks/:lookbookId"
        element={
          <ProtectedRoute>
            <LookbookDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Cart & Checkout */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <div>Checkout</div>
          </ProtectedRoute>
        }
      />

      {/* Wishlist */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist/collections/:collectionId"
        element={
          <ProtectedRoute>
            <CollectionDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Virtual Try-On */}
      <Route
        path="/try-on"
        element={
          <ProtectedRoute>
            <TryOnPage />
          </ProtectedRoute>
        }
      />

      {/* Profile & Settings */}
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <div>Admin Dashboard - Coming Soon!</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <div>User Management</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <ProtectedRoute>
            <div>Content Moderation</div>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
