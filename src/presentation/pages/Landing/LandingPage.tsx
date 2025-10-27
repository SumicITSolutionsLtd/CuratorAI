import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Search,
  Shirt,
  Users,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Heart,
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Shield,
  ChevronDown,
  ChevronUp,
  Mail,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/presentation/components/ui/avatar'
import { Input } from '@/presentation/components/ui/input'
import { Logo } from '@/presentation/components/common/Logo'

export const LandingPage = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recommendations',
      description:
        'Get personalized outfit suggestions that match your unique style, budget, and occasion',
      bgColor: 'bg-brand-crimson',
    },
    {
      icon: Search,
      title: 'Visual Search',
      description: 'Upload any fashion photo and instantly discover similar outfits and styles',
      bgColor: 'bg-brand-blue',
    },
    {
      icon: Shirt,
      title: 'Smart Wardrobe',
      description:
        'Organize, track, and maximize your existing wardrobe with intelligent analytics',
      bgColor: 'bg-brand-crimson',
    },
    {
      icon: Users,
      title: 'Social Fashion Feed',
      description: 'Share your looks, get inspired, and connect with fashion enthusiasts worldwide',
      bgColor: 'bg-brand-blue',
    },
    {
      icon: BookOpen,
      title: 'Curated Lookbooks',
      description: 'Browse professional styling collections for every season and occasion',
      bgColor: 'bg-brand-crimson',
    },
    {
      icon: ShoppingBag,
      title: 'Seamless Shopping',
      description: 'Shop directly from outfits with one-click purchasing from trusted retailers',
      bgColor: 'bg-brand-blue',
    },
  ]

  const faqs = [
    {
      question: 'How does the AI recommendation system work?',
      answer:
        'Our AI analyzes your style preferences, body type, budget, and occasion to suggest outfits that match your unique taste. It learns from your interactions to provide increasingly personalized recommendations.',
    },
    {
      question: 'Is CuratorAI free to use?',
      answer:
        'Yes! We offer a free tier with basic features. Premium plans unlock advanced AI features, unlimited outfit saves, and priority support.',
    },
    {
      question: 'Can I shop directly through the app?',
      answer:
        'Absolutely! We partner with trusted retailers so you can purchase items directly from outfits you love. We earn a small commission when you buy, which helps keep our service running.',
    },
    {
      question: 'How accurate is the visual search?',
      answer:
        "Our visual search uses advanced AI to identify clothing items with 95% accuracy. Simply upload a photo, and we'll find similar styles across thousands of products from our partner retailers.",
    },
    {
      question: 'Can I use CuratorAI on mobile?',
      answer:
        'Yes! CuratorAI works seamlessly on all devices - desktop, tablet, and mobile. Our responsive design ensures you have a great experience wherever you are.',
    },
    {
      question: 'How do you protect my data?',
      answer:
        'We take privacy seriously. Your data is encrypted, never sold to third parties, and you have full control over what you share. We comply with GDPR and all major privacy regulations.',
    },
  ]

  const trustLogos = [
    { name: 'TechCrunch', text: 'Featured in TechCrunch' },
    { name: 'Vogue', text: 'Mentioned by Vogue' },
    { name: 'Forbes', text: 'Covered by Forbes' },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
    alert('Thanks for subscribing! Check your email for confirmation.')
  }

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Outfit Matches', value: '2M+', icon: Sparkles },
    { label: 'Satisfaction Rate', value: '98%', icon: Star },
    { label: 'AI Accuracy', value: '95%', icon: TrendingUp },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Fashion Blogger',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      text: 'CuratorAI has completely transformed how I discover and style outfits. The AI recommendations are spot-on!',
      rating: 5,
    },
    {
      name: 'Alex Rodriguez',
      role: 'Entrepreneur',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      text: 'Finally, a fashion app that understands my style and budget. Saved me hours of shopping time!',
      rating: 5,
    },
    {
      name: 'Maya Patel',
      role: 'Creative Director',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      text: 'The visual search feature is incredible. I can recreate runway looks within my budget!',
      rating: 5,
    },
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Create Your Profile',
      description: 'Tell us about your style preferences, budget, and fashion goals',
      icon: Users,
    },
    {
      step: '2',
      title: 'Get AI Recommendations',
      description: 'Our AI analyzes your preferences and suggests perfect outfit matches',
      icon: Sparkles,
    },
    {
      step: '3',
      title: 'Build Your Wardrobe',
      description: 'Save favorites, create looks, and shop seamlessly',
      icon: Heart,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>
        CuratorAI - AI-Powered Fashion Recommendations | Where Fashion Meets Intelligence
      </title>
      <meta
        name="description"
        content="Discover your perfect style with CuratorAI's AI-powered outfit recommendations. Visual search, smart wardrobe, and personalized fashion advice. Start free today!"
      />

      {/* Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-crimson focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo size="sm" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-brand-crimson hover:bg-brand-crimson/90"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 z-50 w-64 border-l bg-background shadow-lg md:hidden"
          >
            <div className="flex h-full flex-col p-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-bold">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="mb-8 flex flex-col gap-4">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-brand-crimson"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-brand-crimson"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-brand-crimson"
                >
                  Testimonials
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium transition-colors hover:text-brand-crimson"
                >
                  FAQ
                </a>
              </nav>

              <div className="mt-auto space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/login')
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/register')
                  }}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="main-content" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-brand-crimson/5 via-brand-blue/5 to-brand-beige/30"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"
        />

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 inline-block"
            >
              <Badge className="bg-brand-crimson text-white">
                <Zap className="mr-1 h-3 w-3" />
                AI-Powered Fashion Intelligence
              </Badge>
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-brand-charcoal md:text-7xl">
              Where Fashion Meets Intelligence
            </h1>

            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Discover your perfect style with AI-powered recommendations.
              <br />
              Save time, money, and always look your best.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="group bg-brand-crimson text-lg hover:bg-brand-crimson/90"
              >
                Start Your Style Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-blue text-lg text-brand-blue hover:bg-brand-blue/10"
                onClick={() =>
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Hero Visual Content - Fashion Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-16 grid grid-cols-3 gap-4 md:gap-6"
            >
              {[
                {
                  img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
                  delay: 0.1,
                },
                {
                  img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop',
                  delay: 0.2,
                },
                {
                  img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=500&fit=crop',
                  delay: 0.3,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + item.delay, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={item.img}
                      alt={`Fashion inspiration ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="absolute bottom-4 left-4 right-4 text-white"
                  >
                    <Sparkles className="mb-2 h-5 w-5" />
                    <p className="text-sm font-semibold">
                      {idx === 0 && 'AI-Curated Looks'}
                      {idx === 1 && 'Style Intelligence'}
                      {idx === 2 && 'Perfect Matches'}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="rounded-lg border bg-background/60 p-4 backdrop-blur"
                  >
                    <Icon className="mx-auto mb-2 h-6 w-6 text-brand-crimson" />
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything You Need to Look Amazing
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to revolutionize your fashion journey
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="group h-full border-2 p-6 transition-all hover:border-brand-crimson/50 hover:shadow-2xl">
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg ${feature.bgColor} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-brand-beige/30 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
            {howItWorks.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-crimson text-3xl font-bold text-white">
                    {item.step}
                    {idx < howItWorks.length - 1 && (
                      <div className="absolute left-full top-1/2 hidden h-0.5 w-full bg-brand-gray md:block" />
                    )}
                  </div>
                  <Icon className="mx-auto mb-4 h-10 w-10 text-brand-crimson" />
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Loved by Fashion Enthusiasts</h2>
            <p className="text-xl text-muted-foreground">See what our users are saying</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="bg-brand-beige/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="mb-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              As Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {trustLogos.map((logo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Shield className="h-6 w-6 text-brand-blue" />
                  <span className="text-lg font-semibold">{logo.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-brand-beige/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <Mail className="mx-auto mb-4 h-12 w-12 text-brand-crimson" />
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Stay in Style</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Get the latest fashion tips, style trends, and exclusive offers delivered to your
              inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mx-auto flex max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-brand-crimson hover:bg-brand-crimson/90">
                Subscribe
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about CuratorAI
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="text-lg font-semibold">{faq.question}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-brand-crimson" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t px-6 pb-6 pt-4 text-muted-foreground">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-brand-crimson py-24 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"
        />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="mx-auto mb-6 h-16 w-16" />
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ready to Transform Your Style?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of fashion lovers who've discovered their perfect style
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-brand-ivory text-brand-charcoal hover:bg-brand-ivory/90"
              >
                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-ivory bg-transparent text-brand-ivory hover:bg-brand-ivory hover:text-brand-crimson"
              >
                Contact Sales
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-75">No credit card required • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-brand-charcoal py-12 text-brand-ivory">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <div className="mb-4">
                <Logo size="sm" showTagline={true} variant="light" />
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-brand-gray">
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-ivory">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/curatorai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gray transition-colors hover:text-brand-crimson"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/curatorai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gray transition-colors hover:text-brand-blue"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com/curatorai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gray transition-colors hover:text-brand-blue"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-gray/20 pt-8 text-center text-sm text-brand-gray">
            <p>© 2025 CuratorAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA - Removed Free Trial Button as per UI feedback */}
    </div>
  )
}
