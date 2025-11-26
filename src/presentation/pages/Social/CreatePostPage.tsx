import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Upload,
  X,
  Image as ImageIcon,
  MapPin,
  Users,
  Globe,
  Lock,
  Sparkles,
  Camera,
  Smile,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Separator } from '@/presentation/components/ui/separator'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { createPost } from '@/shared/store/slices/socialSlice'
import { showToast } from '@/shared/utils/toast'

const suggestedTags = [
  '#OOTD',
  '#FashionInspo',
  '#StreetStyle',
  '#SummerVibes',
  '#Casual',
  '#DateNight',
  '#WorkWear',
  '#WeekendLook',
]

type Privacy = 'public' | 'friends' | 'private'

export const CreatePostPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isPostActionLoading } = useAppSelector((state) => state.social)

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [visibility, setVisibility] = useState<Privacy>('public')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const moreFilesInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      // Store the actual file
      setImageFiles((prev) => [...prev, file])

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const mapVisibilityToPrivacy = (vis: string): Privacy => {
    switch (vis) {
      case 'followers':
        return 'friends'
      case 'private':
        return 'private'
      default:
        return 'public'
    }
  }

  const handlePost = async () => {
    if (imageFiles.length === 0) {
      showToast.error('Please add at least one image')
      return
    }

    if (!user?.id) {
      showToast.error('You must be logged in to create a post')
      return
    }

    try {
      // Clean tags (remove # prefix for storage, keep for display)
      const cleanTags = tags.map((tag) => tag.replace(/^#/, ''))

      await dispatch(
        createPost({
          userId: user.id,
          images: imageFiles,
          caption,
          tags: cleanTags,
          privacy: mapVisibilityToPrivacy(visibility),
        })
      ).unwrap()

      showToast.success('Post created successfully!')
      navigate('/feed')
    } catch (error) {
      showToast.error(typeof error === 'string' ? error : 'Failed to create post')
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
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Create Post
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Share your outfit with the community
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="ml-2">
            Cancel
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image Upload */}
            <Card className="p-6">
              <Label className="mb-4 block">Photos</Label>

              {imagePreviews.length === 0 ? (
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-crimson/30 bg-gradient-to-br from-brand-ivory to-brand-beige transition-all hover:border-brand-crimson/60"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/10">
                      <Upload className="h-8 w-8 text-brand-crimson" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-charcoal">Upload Photos</p>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        Click to browse or drag and drop
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="bg-brand-crimson hover:bg-brand-crimson/90"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Select Photos</span>
                      <span className="sm:hidden">Select</span>
                    </Button>
                  </div>
                </motion.label>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {imagePreviews.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-[4/5] overflow-hidden rounded-lg bg-brand-beige"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-brand-crimson">Cover</Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-crimson/30 p-4 transition-all hover:border-brand-crimson/60"
                  >
                    <input
                      ref={moreFilesInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <ImageIcon className="h-5 w-5 text-brand-crimson" />
                    <span className="text-sm font-medium text-brand-charcoal">Add More Photos</span>
                  </motion.label>
                </div>
              )}
            </Card>

            {/* Caption */}
            <Card className="p-6">
              <Label htmlFor="caption" className="mb-4 block">
                Caption
              </Label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption... Share your style story!"
                maxLength={500}
                className="min-h-[120px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="mt-2 flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <Smile className="mr-2 h-4 w-4" />
                  Add Emoji
                </Button>
                <span className="text-xs text-muted-foreground">{caption.length}/500</span>
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <Label className="mb-4 block">Tags</Label>

              {tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="py-1 pl-3 pr-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addTag(tag)}
                      disabled={tags.includes(tag)}
                      className="rounded-full border border-brand-crimson/30 px-3 py-1 text-sm font-medium text-brand-charcoal transition-colors hover:bg-brand-crimson/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Author Card */}
              <Card className="bg-gradient-to-br from-brand-ivory to-brand-beige p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-brand-crimson/20">
                    <AvatarImage
                      src={
                        user?.profile?.photoUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`
                      }
                    />
                    <AvatarFallback>
                      {user?.fullName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-brand-charcoal">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username || 'user'}</p>
                  </div>
                </div>
              </Card>

              {/* Post Settings */}
              <Card className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={visibility} onValueChange={(v) => setVisibility(v as Privacy)}>
                    <SelectTrigger id="visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Followers Only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          <span>Only Me</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>AI Enhancement</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Generate Caption with AI</span>
                    <span className="sm:hidden">AI Caption</span>
                  </Button>
                </div>
              </Card>

              {/* Post Button */}
              <Button
                onClick={handlePost}
                disabled={imageFiles.length === 0 || isPostActionLoading}
                className="h-12 w-full bg-brand-crimson hover:bg-brand-crimson/90"
              >
                {isPostActionLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Posting...
                  </>
                ) : (
                  'Share Post'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
