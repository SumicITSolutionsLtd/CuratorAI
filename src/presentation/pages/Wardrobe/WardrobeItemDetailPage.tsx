import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Tag,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import {
  fetchWardrobe,
  deleteWardrobeItem,
  incrementTimesWorn,
} from '@/shared/store/slices/wardrobeSlice'
import { useToast } from '@/presentation/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog'

export const WardrobeItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { items, isLoading } = useAppSelector((state) => state.wardrobe)
  const { user } = useAppSelector((state) => state.auth)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const item = items.find((i) => i.id === itemId)

  useEffect(() => {
    if (items.length === 0 && user?.id) {
      dispatch(fetchWardrobe(user.id))
    }
  }, [dispatch, items.length, user?.id])

  const handlePreviousImage = () => {
    if (!item) return
    setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!item) return
    setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1))
  }

  const handleMarkAsWorn = async () => {
    if (!item) return

    try {
      await dispatch(incrementTimesWorn(item.id)).unwrap()
      toast({
        title: 'Marked as Worn',
        description: `${item.name} has been marked as worn.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!item) return

    setIsDeleting(true)
    try {
      await dispatch(deleteWardrobeItem(item.id)).unwrap()
      toast({
        title: 'Item Deleted',
        description: `${item.name} has been removed from your wardrobe.`,
      })
      navigate('/wardrobe')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item.',
        variant: 'destructive',
      })
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatLastWorn = () => {
    if (!item) return 'Never'
    const now = new Date()
    const updated = new Date(item.updatedAt)
    const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 60) return '1 month ago'
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-crimson" />
        </div>
      </MainLayout>
    )
  }

  if (!item) {
    return (
      <MainLayout>
        <div className="flex h-96 flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Item Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The item you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/wardrobe')} className="mt-6">
            Back to Wardrobe
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/wardrobe')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-brand-beige">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={item.images[currentImageIndex]}
                    alt={`${item.name} ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {currentImageIndex + 1} / {item.images.length}
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Strip */}
            {item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-brand-crimson'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
                    {item.name}
                  </h1>
                  <p className="mt-1 text-lg text-muted-foreground">{item.brand || 'No brand'}</p>
                </div>
                <Badge className="shrink-0 capitalize">{item.category}</Badge>
              </div>

              {item.price && (
                <p className="text-2xl font-bold text-brand-crimson">
                  {item.currency} ${item.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-brand-crimson">{item.timesWorn}</p>
                <p className="text-xs text-muted-foreground">Times Worn</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-sm font-semibold text-brand-charcoal">{formatLastWorn()}</p>
                <p className="text-xs text-muted-foreground">Last Worn</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-sm font-semibold text-brand-charcoal">
                  ${((item.price || 0) / Math.max(item.timesWorn, 1)).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Cost Per Wear</p>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleMarkAsWorn} className="flex-1 bg-brand-blue">
                <Calendar className="mr-2 h-4 w-4" />
                Mark as Worn
              </Button>
            </div>

            {/* Details Section */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige">
                    <Tag className="h-5 w-5 text-brand-crimson" />
                  </div>
                  <div>
                    <p className="font-medium">Color</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{
                          backgroundColor: item.color.includes('/')
                            ? undefined
                            : item.color.toLowerCase(),
                          background: item.color.includes('/')
                            ? 'linear-gradient(135deg, navy 50%, white 50%)'
                            : undefined,
                        }}
                      />
                      <span className="text-muted-foreground">{item.color}</span>
                    </div>
                  </div>
                </div>

                {item.size && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige">
                      <ShoppingBag className="h-5 w-5 text-brand-crimson" />
                    </div>
                    <div>
                      <p className="font-medium">Size</p>
                      <p className="text-muted-foreground">{item.size}</p>
                    </div>
                  </div>
                )}

                {item.material && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige">
                      <Tag className="h-5 w-5 text-brand-crimson" />
                    </div>
                    <div>
                      <p className="font-medium">Material</p>
                      <p className="text-muted-foreground">{item.material}</p>
                    </div>
                  </div>
                )}

                {item.purchaseDate && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-beige">
                      <Calendar className="h-5 w-5 text-brand-crimson" />
                    </div>
                    <div>
                      <p className="font-medium">Purchased</p>
                      <p className="text-muted-foreground">{formatDate(item.purchaseDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Attributes */}
            {item.attributes.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Attributes</h2>
                <div className="space-y-2">
                  {item.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{attr.key}</span>
                      <span className="text-muted-foreground">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {item.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Notes */}
            {item.notes && (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Notes</h2>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </Card>
            )}

            {/* Purchase Link */}
            {item.purchaseLink && (
              <Card className="p-6">
                <a
                  href={item.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-sm font-medium text-brand-blue hover:underline"
                >
                  <span>View Purchase Link</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item from your
              wardrobe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
