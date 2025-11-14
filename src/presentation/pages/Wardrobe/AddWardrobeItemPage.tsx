import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  ArrowLeft,
  X,
  Plus,
  Loader2,
  Camera,
  Image as ImageIcon,
  Cloud,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Card } from '@/presentation/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Badge } from '@/presentation/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/shared/store/hooks'
import { addWardrobeItem } from '@/shared/store/slices/wardrobeSlice'
import { WardrobeItem } from '@/domain/entities/Wardrobe'
import { useToast } from '@/presentation/components/ui/use-toast'

export const AddWardrobeItemPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
    { key: 'season', value: '' },
    { key: 'occasion', value: '' },
    { key: 'care', value: '' },
  ])

  const [formData, setFormData] = useState({
    wardrobeId: 'wardrobe-1',
    category: '' as WardrobeItem['category'],
    name: '',
    brand: '',
    color: '',
    size: '',
    price: '',
    currency: 'USD',
    purchaseDate: '',
    material: '',
    notes: '',
    purchaseLink: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCameraUpload = () => {
    cameraInputRef.current?.click()
  }

  const handleGalleryUpload = () => {
    fileInputRef.current?.click()
  }

  const handleGoogleDriveUpload = () => {
    toast({
      title: 'Google Drive Upload',
      description:
        'Google Drive integration coming soon! This will allow you to upload images directly from your Drive.',
    })
    console.log('[Analytics] Google Drive Upload clicked')
    // TODO: Implement Google Drive OAuth integration
  }

  const handleUrlUpload = () => {
    toast({
      title: 'URL Upload',
      description: 'Upload from URL coming soon! Paste a link to add images directly.',
    })
    console.log('[Analytics] URL Upload clicked')
    // TODO: Implement URL image upload
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags((prev) => [...prev, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    )
  }

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { key: '', value: '' }])
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.name || !formData.color) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in category, name, and color.',
        variant: 'destructive',
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: 'No Images',
        description: 'Please add at least one image.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newItem = {
        wardrobeId: formData.wardrobeId,
        category: formData.category,
        name: formData.name,
        brand: formData.brand || undefined,
        color: formData.color,
        size: formData.size || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        currency: formData.currency || undefined,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
        material: formData.material || undefined,
        images,
        attributes: attributes.filter((attr) => attr.key && attr.value),
        tags,
        notes: formData.notes || undefined,
        timesWorn: 0,
        purchaseLink: formData.purchaseLink || undefined,
      }

      await dispatch(addWardrobeItem(newItem)).unwrap()

      toast({
        title: 'Item Added',
        description: `${formData.name} has been added to your wardrobe.`,
      })

      navigate('/wardrobe')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item. Please try again.',
        variant: 'destructive',
      })
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/wardrobe')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Add New Item
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new piece to your wardrobe collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Images</h2>
            <div className="space-y-4">
              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCameraUpload}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-brand-crimson hover:bg-brand-crimson/5"
                >
                  <Camera className="h-6 w-6 text-brand-crimson" />
                  <span className="text-xs font-medium text-brand-charcoal">Camera</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGalleryUpload}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <ImageIcon className="h-6 w-6 text-brand-blue" />
                  <span className="text-xs font-medium text-brand-charcoal">Gallery</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleDriveUpload}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-brand-crimson hover:bg-brand-crimson/5"
                >
                  <Cloud className="h-6 w-6 text-brand-crimson" />
                  <span className="text-xs font-medium text-brand-charcoal">Drive</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUrlUpload}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <LinkIcon className="h-6 w-6 text-brand-blue" />
                  <span className="text-xs font-medium text-brand-charcoal">URL</span>
                </motion.button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="group relative aspect-square">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-brand-crimson text-xs">Primary</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Upload up to 5 images. First image will be the primary image.
              </p>
            </div>
          </Card>

          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as WardrobeItem['category'] })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Silk Blouse"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g., Zara"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">
                  Color <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="e.g., Navy Blue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., M, 8, 32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., Cotton, Silk"
                />
              </div>
            </div>
          </Card>

          {/* Purchase Details */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Purchase Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="purchaseLink">Purchase Link</Label>
                <Input
                  id="purchaseLink"
                  type="url"
                  value={formData.purchaseLink}
                  onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </Card>

          {/* Attributes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Attributes</h2>
              <Button type="button" variant="outline" size="sm" onClick={handleAddAttribute}>
                <Plus className="mr-2 h-4 w-4" />
                Add Attribute
              </Button>
            </div>
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    placeholder="Key (e.g., season)"
                    className="flex-1"
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g., Summer)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Tags</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Notes</h2>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this item..."
              rows={4}
            />
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/wardrobe')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-crimson hover:bg-brand-crimson/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Wardrobe'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </MainLayout>
  )
}
