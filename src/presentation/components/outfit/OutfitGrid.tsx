import { motion } from 'framer-motion'
import { OutfitCard } from './OutfitCard'
import { Skeleton } from '../ui/skeleton'
import { Outfit } from '@/shared/types/outfit'

interface OutfitGridProps {
  outfits: Outfit[]
  isLoading?: boolean
}

export const OutfitGrid = ({ outfits, isLoading }: OutfitGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3"
    >
      {outfits.map((outfit, index) => (
        <OutfitCard
          key={outfit.id || index}
          id={outfit.id}
          name={outfit.name}
          imageUrl={outfit.imageUrl}
          items={outfit.items}
          totalPrice={outfit.totalPrice}
          matchScore={outfit.matchScore || 85}
          tags={outfit.tags || []}
          likes={outfit.likes || 0}
        />
      ))}
    </motion.div>
  )
}
