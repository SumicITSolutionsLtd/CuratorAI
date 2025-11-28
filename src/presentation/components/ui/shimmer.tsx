import { cn } from '@/shared/utils/cn'

/**
 * Base Shimmer component with animated gradient effect
 */
export const Shimmer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

/**
 * Card Skeleton - Generic card loading state
 */
export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <Shimmer className="mb-4 h-48 w-full rounded-lg" />
      <Shimmer className="mb-2 h-4 w-3/4" />
      <Shimmer className="mb-4 h-3 w-1/2" />
      <div className="flex gap-2">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

/**
 * Outfit Card Skeleton - Loading state for outfit cards in grid
 */
export const OutfitCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <Shimmer className="aspect-[3/4] w-full" />
      <div className="space-y-3 p-4">
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Shimmer className="h-6 w-20" />
          <Shimmer className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Outfit Grid Skeleton - Multiple outfit cards loading
 */
export const OutfitGridSkeleton = ({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) => {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <OutfitCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Wardrobe Item Skeleton - Loading state for wardrobe items
 */
export const WardrobeItemSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <Shimmer className="aspect-square w-full" />
      <div className="space-y-2 p-3">
        <Shimmer className="h-4 w-2/3" />
        <Shimmer className="h-3 w-1/2" />
        <div className="flex gap-1">
          <Shimmer className="h-5 w-12 rounded-full" />
          <Shimmer className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Wardrobe Grid Skeleton - Multiple wardrobe items loading
 */
export const WardrobeGridSkeleton = ({
  count = 8,
  className,
}: {
  count?: number
  className?: string
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <WardrobeItemSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Lookbook Card Skeleton - Loading state for lookbook cards
 */
export const LookbookCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      <Shimmer className="aspect-[4/5] w-full" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-3 w-16" />
          </div>
        </div>
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-4 w-full" />
        <div className="flex gap-2">
          <Shimmer className="h-6 w-14 rounded-full" />
          <Shimmer className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Lookbook Grid Skeleton - Multiple lookbook cards loading
 */
export const LookbookGridSkeleton = ({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) => {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LookbookCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Cart Item Skeleton - Loading state for cart items
 */
export const CartItemSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="flex gap-4">
        <Shimmer className="h-32 w-24 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Shimmer className="h-5 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Shimmer className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-8 w-24 rounded-lg" />
            <Shimmer className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Feed Post Skeleton - Loading state for social feed posts
 */
export const FeedPostSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Shimmer className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-1">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
      {/* Image */}
      <Shimmer className="aspect-square w-full" />
      {/* Actions */}
      <div className="space-y-3 p-4">
        <div className="flex gap-4">
          <Shimmer className="h-6 w-6 rounded-full" />
          <Shimmer className="h-6 w-6 rounded-full" />
          <Shimmer className="h-6 w-6 rounded-full" />
        </div>
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-3/4" />
      </div>
    </div>
  )
}

/**
 * Profile Header Skeleton - Loading state for profile page header
 */
export const ProfileHeaderSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-6">
        <Shimmer className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-6 w-40" />
          <Shimmer className="h-4 w-32" />
          <div className="mt-2 flex gap-6">
            <Shimmer className="h-10 w-20" />
            <Shimmer className="h-10 w-20" />
            <Shimmer className="h-10 w-20" />
          </div>
        </div>
      </div>
      <Shimmer className="h-16 w-full rounded-lg" />
    </div>
  )
}

/**
 * Stats Card Skeleton - Loading state for stat cards
 */
export const StatsCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-8 w-16" />
        </div>
        <Shimmer className="h-10 w-10 rounded-full" />
      </div>
    </div>
  )
}

/**
 * Detail Page Skeleton - Full page loading state for detail pages
 */
export const DetailPageSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Back button */}
      <Shimmer className="h-10 w-20" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="space-y-4">
          <Shimmer className="aspect-[3/4] w-full rounded-lg" />
          <div className="flex gap-2">
            <Shimmer className="h-20 w-20 rounded-lg" />
            <Shimmer className="h-20 w-20 rounded-lg" />
            <Shimmer className="h-20 w-20 rounded-lg" />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Shimmer className="h-8 w-3/4" />
            <Shimmer className="h-5 w-1/2" />
            <Shimmer className="h-8 w-32" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Shimmer className="h-20 rounded-lg" />
            <Shimmer className="h-20 rounded-lg" />
            <Shimmer className="h-20 rounded-lg" />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Shimmer className="h-12 flex-1 rounded-lg" />
            <Shimmer className="h-12 w-12 rounded-lg" />
          </div>

          {/* Details card */}
          <Shimmer className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/**
 * Notification Item Skeleton - Loading state for notification items
 */
export const NotificationSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-start gap-3 border-b p-4', className)}>
      <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
      </div>
      <Shimmer className="h-3 w-12" />
    </div>
  )
}

/**
 * List Skeleton - Generic list loading state
 */
export const ListSkeleton = ({ count = 5, className }: { count?: number; className?: string }) => {
  return (
    <div className={cn('space-y-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  )
}
