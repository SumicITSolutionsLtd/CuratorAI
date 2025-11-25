import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Logo } from '@/presentation/components/common/Logo'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { verifyEmail, requestEmailVerification } from '@/shared/store/slices/authSlice'
import { showToast } from '@/shared/utils/toast'

export const VerifyEmailPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { isLoading, user } = useAppSelector((state) => state.auth)

  const [code, setCode] = useState('')
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const codeFromUrl = searchParams.get('code')

  const handleVerification = useCallback(
    async (verificationCode: string) => {
      const result = await dispatch(verifyEmail(verificationCode))
      if (verifyEmail.fulfilled.match(result)) {
        setVerificationSuccess(true)
        showToast.success('Email Verified!', 'Your email has been successfully verified')
        setTimeout(() => {
          navigate('/home')
        }, 3000)
      } else if (verifyEmail.rejected.match(result)) {
        showToast.error('Verification Failed', result.payload as string)
      }
    },
    [dispatch, navigate]
  )

  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl)
      handleVerification(codeFromUrl)
    }
  }, [codeFromUrl, handleVerification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleVerification(code)
  }

  if (verificationSuccess) {
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

              <h2 className="mb-3 text-2xl font-bold text-brand-charcoal">Email Verified!</h2>
              <p className="mb-6 text-brand-gray">
                Your email has been successfully verified. You now have full access to all features.
              </p>

              <p className="text-sm text-brand-gray">Redirecting to home page...</p>
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
              <h2 className="text-2xl font-bold text-brand-charcoal">Verify Your Email</h2>
              <p className="text-sm text-brand-gray">
                {user?.email
                  ? `We sent a verification code to ${user.email}`
                  : 'Enter the verification code sent to your email'}
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
              {/* Verification Code */}
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-semibold text-brand-charcoal">
                  Verification Code
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    maxLength={6}
                    className="border-2 py-6 pl-11 text-center text-lg font-semibold tracking-widest transition-all focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Resend Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              {resendSuccess ? (
                <p className="text-sm text-green-600">
                  ✓ Verification email sent! Please check your inbox.
                </p>
              ) : (
                <p className="text-sm text-brand-gray">
                  Didn't receive the code?{' '}
                  <button
                    onClick={async () => {
                      setResendLoading(true)
                      setResendSuccess(false)
                      const result = await dispatch(requestEmailVerification())
                      if (requestEmailVerification.fulfilled.match(result)) {
                        setResendSuccess(true)
                        showToast.success('Email Sent', 'Verification email sent successfully')
                        setTimeout(() => setResendSuccess(false), 5000)
                      } else if (requestEmailVerification.rejected.match(result)) {
                        showToast.error('Failed', result.payload as string)
                      }
                      setResendLoading(false)
                    }}
                    disabled={resendLoading}
                    className="font-semibold text-brand-blue transition-colors hover:text-brand-crimson hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend'}
                  </button>
                </p>
              )}
            </motion.div>

            {/* Skip for now */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <button
                onClick={() => navigate('/home')}
                className="text-xs text-brand-gray transition-colors hover:text-brand-charcoal hover:underline"
              >
                Skip for now
              </button>
            </motion.div>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-brand-gray"
        >
          Verification codes expire after 10 minutes
        </motion.p>
      </motion.div>
    </div>
  )
}
