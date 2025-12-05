import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { ArrowLeft, Plus, Image as ImageIcon, BookOpen, Sparkles, X, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Switch } from '@/presentation/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { showToast } from '@/shared/utils/toast'

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season']
const OCCASIONS = ['Casual', 'Work', 'Evening', 'Formal', 'Weekend', 'Date Night', 'Travel']

export const CreateLookbookPage = () => {
  const navigate = useNavigate()
  const { recommendations } = useAppSelector((state) => state.outfit)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [season, setSeason] = useState('')
  const [occasion, setOccasion] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [selectedOutfits, setSelectedOutfits] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectOutfit = (outfitId: string) => {
    setSelectedOutfits((prev) =>
      prev.includes(outfitId) ? prev.filter((id) => id !== outfitId) : [...prev, outfitId]
    )
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast.error('Title required', 'Please enter a title for your lookbook')
      return
    }

    if (selectedOutfits.length === 0) {
      showToast.error('No outfits selected', 'Please select at least one outfit')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual API call when backend endpoint is ready
      // const response = await lookbookRepository.createLookbook({
      //   title,
      //   description,
      //   season,
      //   occasion,
      //   isPublic,
      //   outfitIds: selectedOutfits,
      //   coverImage,
      // })

      await new Promise((resolve) => setTimeout(resolve, 1500))

      showToast.success('Lookbook created!', 'Your lookbook has been published')
      navigate('/lookbooks')
    } catch {
      showToast.error('Error', 'Failed to create lookbook. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-charcoal">Create Lookbook</h1>
            <p className="text-sm text-muted-foreground">
              Curate your favorite outfits into a collection
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Cover Image */}
            <Card className="p-6">
              <Label className="mb-3 block font-semibold">Cover Image</Label>
              <div
                className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-brand-gray/30 bg-brand-beige/20 transition-colors hover:border-brand-crimson/50"
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                {coverImage ? (
                  <>
                    <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-2 top-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCoverImage(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
                    <ImageIcon className="h-10 w-10 text-brand-gray/40" />
                    <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
                  </div>
                )}
              </div>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </Card>

            {/* Details Form */}
            <Card className="space-y-4 p-6">
              <div>
                <Label htmlFor="title" className="mb-2 block font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Vacation Essentials"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block font-semibold">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe your lookbook..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block font-semibold">Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEASONS.map((s) => (
                        <SelectItem key={s} value={s.toLowerCase().replace(' ', '_')}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block font-semibold">Occasion</Label>
                  <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {OCCASIONS.map((o) => (
                        <SelectItem key={o} value={o.toLowerCase().replace(' ', '_')}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label className="font-semibold">Make Public</Label>
                  <p className="text-xs text-muted-foreground">Others can discover this lookbook</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
            </Card>
          </div>

          {/* Right Column - Outfit Selection */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-brand-charcoal">Select Outfits</h3>
                  <p className="text-sm text-muted-foreground">{selectedOutfits.length} selected</p>
                </div>
                <Badge variant="secondary" className="bg-brand-crimson/10 text-brand-crimson">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {recommendations.length} available
                </Badge>
              </div>

              {recommendations.length === 0 ? (
                <div className="py-8 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No outfits available</p>
                  <p className="text-sm text-muted-foreground">
                    Create outfits first or browse recommendations
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/wardrobe/create-outfit')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Outfit
                  </Button>
                </div>
              ) : (
                <div className="grid max-h-[500px] grid-cols-2 gap-3 overflow-y-auto">
                  {recommendations.map((outfit: any) => {
                    const isSelected = selectedOutfits.includes(outfit.id)
                    return (
                      <motion.div
                        key={outfit.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectOutfit(outfit.id)}
                        className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-brand-crimson shadow-lg'
                            : 'border-transparent hover:border-brand-gray/30'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-brand-beige/20">
                          {outfit.main_image || outfit.thumbnail ? (
                            <img
                              src={outfit.main_image || outfit.thumbnail}
                              alt={outfit.title || outfit.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Sparkles className="h-8 w-8 text-brand-gray/30" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="truncate text-xs font-medium text-white">
                            {outfit.title || outfit.name || 'Untitled'}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-crimson text-white">
                            <span className="text-xs font-bold">
                              {selectedOutfits.indexOf(outfit.id) + 1}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </Card>

            {/* Submit Button */}
            <Button
              className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || selectedOutfits.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Create Lookbook
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
