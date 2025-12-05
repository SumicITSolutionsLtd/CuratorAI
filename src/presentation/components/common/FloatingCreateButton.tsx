import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { cn } from '@/shared/utils/cn'

export const FloatingCreateButton = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide on certain pages where it might conflict
  const hiddenPaths = ['/wardrobe/add', '/wardrobe/create-outfit']
  const shouldHide = hiddenPaths.some((path) => location.pathname.includes(path))

  if (shouldHide) return null

  const handleCreateOutfit = () => {
    navigate('/wardrobe/create-outfit')
  }

  // Only show on desktop - mobile uses the integrated nav button
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 z-40 hidden lg:bottom-8 lg:right-8 lg:block"
    >
      <Button
        size="lg"
        onClick={handleCreateOutfit}
        className={cn(
          'group relative h-14 w-14 rounded-full bg-gradient-to-r from-brand-crimson to-brand-blue p-0 shadow-2xl transition-all hover:scale-110 hover:shadow-brand-crimson/50 sm:h-16 sm:w-16',
          'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-brand-crimson before:to-brand-blue before:opacity-0 before:blur-xl before:transition-opacity before:duration-300 hover:before:opacity-70'
        )}
        title="Create Outfit"
        aria-label="Create new outfit"
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Plus className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={2.5} />
          </motion.div>
          <motion.div
            className="absolute"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="h-4 w-4 text-white/80 sm:h-5 sm:w-5" />
          </motion.div>
        </div>

        {/* Tooltip on hover */}
        <span className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-brand-charcoal px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Create Outfit
          <span className="absolute left-full top-1/2 -ml-1 h-0 w-0 -translate-y-1/2 border-4 border-transparent border-l-brand-charcoal" />
        </span>
      </Button>
    </motion.div>
  )
}
