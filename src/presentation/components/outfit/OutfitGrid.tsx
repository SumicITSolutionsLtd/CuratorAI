import { motion } from 'framer-motion'
import { OutfitCard } from './OutfitCard'
import { Skeleton } from '../ui/skeleton'
import { Outfit } from '@/shared/types/outfit'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import {
  likeOutfit,
  unlikeOutfit,
  saveOutfit,
  unsaveOutfit,
} from '@/shared/store/slices/outfitSlice'
import { showToast } from '@/shared/utils/toast'

interface OutfitGridProps {
  outfits: Outfit[]
  isLoading?: boolean
}

export const OutfitGrid = ({ outfits, isLoading }: OutfitGridProps) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLike = async (outfitId: string | number, isNowLiked: boolean) => {
    if (!user?.id) {
      showToast.error('Sign in required', 'Please sign in to like outfits')
      return
    }

    try {
      if (isNowLiked) {
        await dispatch(likeOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      } else {
        await dispatch(unlikeOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      }
    } catch {
      showToast.error('Error', 'Failed to update like status')
    }
  }

  const handleSave = async (outfitId: string | number, isNowSaved: boolean) => {
    if (!user?.id) {
      showToast.error('Sign in required', 'Please sign in to save outfits')
      return
    }

    try {
      if (isNowSaved) {
        await dispatch(saveOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      } else {
        await dispatch(unsaveOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      }
    } catch {
      showToast.error('Error', 'Failed to update save status')
    }
  }
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
          isLiked={outfit.isLiked}
          isSaved={outfit.isSaved}
          onLike={handleLike}
          onSave={handleSave}
        />
      ))}
    </motion.div>
  )
}
