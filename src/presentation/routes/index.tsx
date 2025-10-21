import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from '../pages/Landing/LandingPage'
import { LoginPage } from '../pages/Auth/LoginPage'
import { RegisterPage } from '../pages/Auth/RegisterPage'
import { HomePage } from '../pages/Home/HomePage'
import { VisualSearchPage } from '../pages/Search/VisualSearchPage'
import { FeedPage } from '../pages/Social/FeedPage'

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
      <Route path="/wardrobe" element={<div>Wardrobe Page - Coming Soon!</div>} />
      <Route path="/wardrobe/items/:itemId" element={<div>Item Detail</div>} />
      <Route path="/wardrobe/create-outfit" element={<div>Create Outfit</div>} />

      {/* Search Routes */}
      <Route path="/search/visual" element={<VisualSearchPage />} />
      <Route path="/search/results" element={<div>Search Results</div>} />

      {/* Social Routes */}
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/posts/:postId" element={<div>Post Detail</div>} />
      <Route path="/posts/create" element={<div>Create Post</div>} />

      {/* Lookbook Routes */}
      <Route path="/lookbooks" element={<div>Lookbooks - Coming Soon!</div>} />
      <Route path="/lookbooks/:lookbookId" element={<div>Lookbook Detail</div>} />

      {/* Cart & Checkout */}
      <Route path="/cart" element={<div>Shopping Cart - Coming Soon!</div>} />
      <Route path="/checkout" element={<div>Checkout</div>} />

      {/* Virtual Try-On */}
      <Route path="/try-on" element={<div>Virtual Try-On - Coming Soon!</div>} />

      {/* Profile & Settings */}
      <Route path="/profile/:userId" element={<div>User Profile</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
      <Route path="/notifications" element={<div>Notifications</div>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<div>Admin Dashboard - Coming Soon!</div>} />
      <Route path="/admin/users" element={<div>User Management</div>} />
      <Route path="/admin/moderation" element={<div>Content Moderation</div>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
