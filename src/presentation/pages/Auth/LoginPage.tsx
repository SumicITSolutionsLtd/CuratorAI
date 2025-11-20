import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Logo } from '@/presentation/components/common/Logo'
import { useAuth } from '@/shared/hooks/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithOAuth, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
    navigate('/home')
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      await loginWithOAuth(provider)
      navigate('/home')
    } catch (error: any) {
      console.error(`OAuth ${provider} login failed:`, error)

      // Show user-friendly error message
      let errorMessage = `Failed to login with ${provider === 'google' ? 'Google' : 'Facebook'}.`

      if (error.message?.includes('not configured')) {
        errorMessage = `${provider === 'google' ? 'Google' : 'Facebook'} login is not configured yet. Please use email/password login or contact support.`
      } else if (error.message?.includes('popup was closed') || error.message?.includes('cancelled')) {
        errorMessage = 'Login was cancelled. Please try again.'
      }

      alert(errorMessage)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-crimson/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-6 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <Logo size="lg" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-brand-charcoal">Welcome Back</h2>
              <p className="text-sm text-brand-gray">Sign in to continue your fashion journey</p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-8">
            {/* OAuth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="group w-full border-2 border-gray-300 bg-white py-6 text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                onClick={() => handleOAuthLogin('google')}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-semibold">Continue with Google</span>
              </Button>

              {/* Facebook Sign In */}
              <Button
                type="button"
                variant="outline"
                className="group w-full border-2 border-[#1877F2] bg-[#1877F2] py-6 text-white transition-all hover:border-[#1666D9] hover:bg-[#1666D9]"
                onClick={() => handleOAuthLogin('facebook')}
              >
                <svg className="mr-3 h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="font-semibold">Continue with Facebook</span>
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-dashed" />
              </div>
              <div className="relative flex justify-center text-xs font-semibold uppercase">
                <span className="bg-white px-4 text-brand-gray">or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-brand-charcoal">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 py-6 pl-11 transition-all focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-brand-charcoal">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 py-6 pl-11 pr-11 transition-all focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-charcoal"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-2 border-brand-gray text-brand-crimson transition-all focus:ring-2 focus:ring-brand-crimson/20"
                  />
                  <span className="text-sm font-medium text-brand-charcoal">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-brand-blue transition-colors hover:text-brand-crimson hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border-2 border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to CuratorAI
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-sm text-brand-gray"
            >
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-brand-crimson transition-colors hover:text-brand-blue hover:underline"
              >
                Create Account
              </Link>
            </motion.p>

            {/* Back to Home */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <Link
                to="/"
                className="text-xs text-brand-gray transition-colors hover:text-brand-charcoal hover:underline"
              >
                ← Back to Home
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Bottom Decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs text-brand-gray"
        >
          Protected by industry-leading security standards
        </motion.p>
      </motion.div>
    </div>
  )
}
