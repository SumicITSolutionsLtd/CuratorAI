import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Logo } from '@/presentation/components/common/Logo'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { requestPasswordReset } from '@/shared/store/slices/authSlice'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error, passwordResetEmailSent } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await dispatch(requestPasswordReset(email))
  }

  if (passwordResetEmailSent) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-crimson/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
        </div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <Card className="border-2 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-green-500" />
              </motion.div>

              <h2 className="mb-3 text-2xl font-bold text-brand-charcoal">Check Your Email</h2>
              <p className="mb-8 text-brand-gray">
                We've sent password reset instructions to{' '}
                <span className="font-semibold text-brand-charcoal">{email}</span>
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-brand-crimson py-6 text-base font-bold hover:bg-brand-crimson/90"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Login
                </Button>

                <p className="text-sm text-brand-gray">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => window.location.reload()}
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
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
              <h2 className="text-2xl font-bold text-brand-charcoal">Forgot Password?</h2>
              <p className="text-sm text-brand-gray">
                No worries, we'll send you reset instructions
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-8">
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-semibold text-brand-blue transition-colors hover:text-brand-crimson hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Login
              </Link>
            </motion.div>
          </CardContent>
        </Card>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-brand-gray"
        >
          Password reset links expire after 24 hours for security
        </motion.p>
      </motion.div>
    </div>
  )
}
