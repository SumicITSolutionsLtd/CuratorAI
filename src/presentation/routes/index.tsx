import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../pages/Landing/LandingPage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { RegisterPage } from '../pages/Auth/RegisterPage'
import { HomePage } from '../pages/Home/HomePage'
import { VisualSearchPage } from '../pages/Search/VisualSearchPage'
import { FeedPage } from '../pages/Social/FeedPage'
import { CreatePostPage } from '../pages/Social/CreatePostPage'
import { PostDetailPage } from '../pages/Social/PostDetailPage'
import { WardrobePage } from '../pages/Wardrobe/WardrobePage'
import { CartPage } from '../pages/Cart/CartPage'
import { LookbooksPage } from '../pages/Lookbooks/LookbooksPage'
import { LookbookDetailPage } from '../pages/Lookbooks/LookbookDetailPage'
import { TryOnPage } from '../pages/TryOn/TryOnPage'
import { SavedPage } from '../pages/Saved/SavedPage'
import { SettingsPage } from '../pages/Settings/SettingsPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { NotificationsPage } from '../pages/Notifications/NotificationsPage'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/home" element={<HomePage />} />

      {/* Wardrobe Routes */}
      <Route path="/wardrobe" element={<WardrobePage />} />
      <Route path="/wardrobe/items/:itemId" element={<div>Item Detail</div>} />
      <Route path="/wardrobe/create-outfit" element={<div>Create Outfit</div>} />

      {/* Search Routes */}
      <Route path="/search/visual" element={<VisualSearchPage />} />
      <Route path="/search/results" element={<div>Search Results</div>} />

      {/* Social Routes */}
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/posts/:postId" element={<PostDetailPage />} />
      <Route path="/posts/create" element={<CreatePostPage />} />

      {/* Lookbook Routes */}
      <Route path="/lookbooks" element={<LookbooksPage />} />
      <Route path="/lookbooks/:lookbookId" element={<LookbookDetailPage />} />

      {/* Cart & Checkout */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<div>Checkout</div>} />

      {/* Saved Items */}
      <Route path="/saved" element={<SavedPage />} />

      {/* Virtual Try-On */}
      <Route path="/try-on" element={<TryOnPage />} />

      {/* Profile & Settings */}
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<div>Admin Dashboard - Coming Soon!</div>} />
      <Route path="/admin/users" element={<div>User Management</div>} />
      <Route path="/admin/moderation" element={<div>Content Moderation</div>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
