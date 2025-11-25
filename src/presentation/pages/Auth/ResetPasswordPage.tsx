import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, X, Check } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Logo } from '@/presentation/components/common/Logo'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { resetPassword } from '@/shared/store/slices/authSlice'
import { showToast } from '@/shared/utils/toast'

interface PasswordRequirement {
  label: string
  regex: RegExp
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /\d/ },
]

export const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { isLoading } = useAppSelector((state) => state.auth)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [resetSuccess, setResetSuccess] = useState(false)

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password')
    }
  }, [token, navigate])

  useEffect(() => {
    const strength = passwordRequirements.filter((req) => req.regex.test(newPassword)).length
    setPasswordStrength((strength / passwordRequirements.length) * 100)
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast.error('Password Mismatch', 'Passwords do not match')
      return
    }
    if (!token) return

    const result = await dispatch(resetPassword({ token, newPassword }))
    if (resetPassword.fulfilled.match(result)) {
      setResetSuccess(true)
      showToast.success('Password Reset!', 'Your password has been successfully reset')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else if (resetPassword.rejected.match(result)) {
      showToast.error('Reset Failed', result.payload as string)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = () => {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  if (resetSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-crimson/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
        </div>

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

              <h2 className="mb-3 text-2xl font-bold text-brand-charcoal">Password Reset!</h2>
              <p className="mb-6 text-brand-gray">
                Your password has been successfully reset. You can now log in with your new
                password.
              </p>

              <p className="text-sm text-brand-gray">Redirecting to login page...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-crimson/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-6 text-center">
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
              <h2 className="text-2xl font-bold text-brand-charcoal">Set New Password</h2>
              <p className="text-sm text-brand-gray">Choose a strong password for your account</p>
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
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-brand-charcoal">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-brand-gray">Password Strength</span>
                      <span
                        className={cn(
                          'font-bold',
                          passwordStrength >= 75
                            ? 'text-green-600'
                            : passwordStrength >= 50
                              ? 'text-orange-600'
                              : 'text-red-600'
                        )}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        className={cn('h-full transition-colors', getStrengthColor())}
                      />
                    </div>

                    {/* Requirements Checklist */}
                    <div className="space-y-1">
                      {passwordRequirements.map((req, idx) => {
                        const isMet = req.regex.test(newPassword)
                        return (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            {isMet ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                            <span className={cn(isMet ? 'text-green-600' : 'text-brand-gray')}>
                              {req.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-brand-charcoal"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-2 py-6 pl-11 pr-11 transition-all focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-charcoal"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading || passwordStrength < 75 || newPassword !== confirmPassword}
                  className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting Password...
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
                className="text-sm font-semibold text-brand-blue transition-colors hover:text-brand-crimson hover:underline"
              >
                Back to Login
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
