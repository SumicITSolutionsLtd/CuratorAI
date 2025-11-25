import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { register, completeRegistration, loginWithOAuth } from '@/shared/store/slices/authSlice'
import { loginWithGoogle, loginWithFacebook } from '@/shared/utils/oauth'
import { showToast } from '@/shared/utils/toast'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  ShoppingBag,
  Shirt,
  Calendar,
  DollarSign,
  X,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Logo } from '@/presentation/components/common/Logo'
import { cn } from '@/shared/utils/cn'

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

export const RegisterPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(1)

  // Step 2: Account Details
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Step 3: Style Preferences
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string>('')

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    const strength = passwordRequirements.filter((req) => req.regex.test(password)).length
    setPasswordStrength((strength / passwordRequirements.length) * 100)
  }, [password])

  const handleOAuthRegister = async (provider: 'google' | 'facebook') => {
    try {
      let token: string
      if (provider === 'google') {
        token = await loginWithGoogle()
      } else {
        token = await loginWithFacebook()
      }

      const result = await dispatch(loginWithOAuth({ provider, token }))

      if (loginWithOAuth.fulfilled.match(result)) {
        showToast.success('Welcome!', 'Registration successful')
        navigate('/home')
      } else if (loginWithOAuth.rejected.match(result)) {
        const providerName = provider === 'google' ? 'Google' : 'Facebook'
        showToast.error(`${providerName} Registration Failed`, result.payload as string)
      }
    } catch (error: unknown) {
      console.error(`OAuth ${provider} registration failed:`, error)
      const providerName = provider === 'google' ? 'Google' : 'Facebook'
      const errorMsg =
        error instanceof Error ? error.message : `Failed to register with ${providerName}`
      showToast.error(`${providerName} Registration Failed`, errorMsg)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      showToast.error('Password Mismatch', 'Passwords do not match!')
      return
    }

    // Generate username from email (before @ symbol)
    const username = email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

    // Register the user
    const result = await dispatch(
      register({
        fullName,
        email,
        username,
        password,
        password2: confirmPassword,
        agreeToTerms: agreedToTerms,
      })
    )

    if (register.fulfilled.match(result)) {
      // Registration successful, move to style preferences
      showToast.success('Account Created!', "Now let's set up your style preferences")
      setStep(3)
    } else if (register.rejected.match(result)) {
      showToast.error('Registration Failed', result.payload as string)
    }
  }

  const handleCompleteRegistration = async () => {
    // Complete registration with style preferences
    const preferences = {
      shop_for: selectedGender,
      styles: selectedStyles,
      dress_for: selectedOccasions,
      budget_range: selectedBudget,
    }

    const result = await dispatch(completeRegistration(preferences))

    if (completeRegistration.fulfilled.match(result)) {
      showToast.success('Welcome to CuratorAI!', 'Your account is all set up')
      navigate('/home')
    } else if (completeRegistration.rejected.match(result)) {
      showToast.error('Setup Failed', result.payload as string)
    }
  }

  const genderOptions = ['Men', 'Women', 'Non-binary', 'Prefer not to say']
  const styleOptions = [
    'Casual',
    'Formal',
    'Streetwear',
    'Bohemian',
    'Minimalist',
    'Vintage',
    'Athletic',
    'Trendy',
  ]
  const occasionOptions = [
    'Work',
    'Casual',
    'Date Night',
    'Party',
    'Gym',
    'Travel',
    'Beach',
    'Wedding',
  ]
  const budgetOptions = ['Budget-friendly ($)', 'Mid-range ($$)', 'Premium ($$$)', 'Luxury ($$$$)']

  const toggleArraySelection = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item))
    } else {
      setArr([...arr, item])
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

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-ivory py-8">
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
        className="relative z-10 w-full max-w-2xl px-4"
      >
        <Card className="border-2 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (step > 1 ? setStep(step - 1) : navigate('/login'))}
                  className="group"
                >
                  <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back
                </Button>
                <span className="text-sm font-semibold text-brand-gray">Step {step} of 3</span>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-2 flex-1 rounded-full transition-all duration-300',
                      s <= step ? 'bg-brand-crimson' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center"
              >
                <Logo size="lg" />
              </motion.div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Choose Method */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-brand-charcoal">
                      Create Your Account
                    </h2>
                    <p className="text-sm text-brand-gray">
                      Join thousands discovering their perfect style
                    </p>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="space-y-3">
                    {/* Google Sign In */}
                    <Button
                      type="button"
                      variant="outline"
                      className="group w-full border-2 border-gray-300 bg-white py-6 text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                      onClick={() => handleOAuthRegister('google')}
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
                      onClick={() => handleOAuthRegister('facebook')}
                    >
                      <svg className="mr-3 h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="font-semibold">Continue with Facebook</span>
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t-2 border-dashed" />
                    </div>
                    <div className="relative flex justify-center text-xs font-semibold uppercase">
                      <span className="bg-white px-4 text-brand-gray">or continue with email</span>
                    </div>
                  </div>

                  {/* Email Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl"
                      onClick={() => setStep(2)}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Continue with Email
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>

                  {/* Login Link */}
                  <p className="text-center text-sm text-brand-gray">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-bold text-brand-crimson transition-colors hover:text-brand-blue hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* Step 2: Account Details */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleStep2Submit}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-brand-charcoal">Your Details</h2>
                    <p className="text-sm text-brand-gray">Tell us about yourself</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold text-brand-charcoal">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="border-2 py-6 pl-11 transition-all focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-brand-charcoal">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gray" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
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
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
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
                            const isMet = req.regex.test(password)
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
                        placeholder="Re-enter your password"
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
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all hover:bg-brand-beige/30">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-2 border-brand-gray text-brand-crimson transition-all focus:ring-2 focus:ring-brand-crimson/20"
                    />
                    <span className="text-sm text-brand-charcoal">
                      I agree to the{' '}
                      <Link to="/terms" className="font-semibold text-brand-blue hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="font-semibold text-brand-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl"
                      disabled={
                        passwordStrength < 75 || password !== confirmPassword || !agreedToTerms
                      }
                    >
                      Continue to Style Preferences
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.form>
              )}

              {/* Step 3: Style Preferences */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="mb-2 text-2xl font-bold text-brand-charcoal">
                      Personalize Your Style
                    </h2>
                    <p className="text-sm text-brand-gray">
                      Help us curate the perfect outfits for you
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                      <Shirt className="h-4 w-4" />I shop for
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {genderOptions.map((gender) => (
                        <motion.button
                          key={gender}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedGender(gender)}
                          className={cn(
                            'rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all',
                            selectedGender === gender
                              ? 'border-brand-crimson bg-brand-crimson text-white shadow-lg'
                              : 'border-gray-200 bg-white text-brand-charcoal hover:border-brand-crimson/50'
                          )}
                        >
                          {gender}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Style Preferences */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                      <ShoppingBag className="h-4 w-4" />
                      My style (select multiple)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {styleOptions.map((style) => {
                        const isSelected = selectedStyles.includes(style)
                        return (
                          <motion.button
                            key={style}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              toggleArraySelection(selectedStyles, setSelectedStyles, style)
                            }
                          >
                            <Badge
                              variant={isSelected ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer px-4 py-2 text-sm font-semibold transition-all',
                                isSelected
                                  ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                                  : 'border-2 hover:border-brand-blue/50'
                              )}
                            >
                              {isSelected && <Check className="mr-1 h-3 w-3" />}
                              {style}
                            </Badge>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Occasions */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                      <Calendar className="h-4 w-4" />I dress for (select multiple)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {occasionOptions.map((occasion) => {
                        const isSelected = selectedOccasions.includes(occasion)
                        return (
                          <motion.button
                            key={occasion}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              toggleArraySelection(
                                selectedOccasions,
                                setSelectedOccasions,
                                occasion
                              )
                            }
                          >
                            <Badge
                              variant={isSelected ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer px-4 py-2 text-sm font-semibold transition-all',
                                isSelected
                                  ? 'bg-brand-crimson text-white hover:bg-brand-crimson/90'
                                  : 'border-2 hover:border-brand-crimson/50'
                              )}
                            >
                              {isSelected && <Check className="mr-1 h-3 w-3" />}
                              {occasion}
                            </Badge>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                      <DollarSign className="h-4 w-4" />
                      My budget range
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetOptions.map((budget) => (
                        <motion.button
                          key={budget}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedBudget(budget)}
                          className={cn(
                            'rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all',
                            selectedBudget === budget
                              ? 'border-brand-crimson bg-brand-crimson text-white shadow-lg'
                              : 'border-gray-200 bg-white text-brand-charcoal hover:border-brand-blue/50'
                          )}
                        >
                          {budget}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Complete Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={handleCompleteRegistration}
                      disabled={
                        !selectedGender ||
                        selectedStyles.length === 0 ||
                        selectedOccasions.length === 0 ||
                        !selectedBudget
                      }
                      className="w-full bg-brand-crimson py-6 text-base font-bold shadow-lg transition-all hover:bg-brand-crimson/90 hover:shadow-xl disabled:opacity-50"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Complete Registration
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>

                  <p className="text-center text-xs text-brand-gray">
                    You can always update these preferences in your settings
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-brand-gray"
        >
          By creating an account, you're joining a community of fashion enthusiasts
        </motion.p>
      </motion.div>
    </div>
  )
}
