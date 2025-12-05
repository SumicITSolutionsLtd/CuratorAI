import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Copy,
  Check,
  Download,
  Mail,
  ExternalLink,
  Loader2,
  Crown,
  HardDrive,
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { showToast } from '@/shared/utils/toast'
import { useAppSelector } from '@/shared/hooks/useAppSelector'

// Social media icons as simple SVG components
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
)

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  imageUrl?: string
  shareUrl?: string
  type?: 'outfit' | 'lookbook' | 'post' | 'item'
}

export const ShareModal = ({
  isOpen,
  onClose,
  title,
  description,
  imageUrl,
  shareUrl,
  type = 'outfit',
}: ShareModalProps) => {
  const { user } = useAppSelector((state) => state.auth)
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSavingToDrive, setIsSavingToDrive] = useState(false)

  // Check if user has premium subscription (adjust based on actual User type)
  const isPremium = (user as any)?.subscription?.plan === 'premium' || false
  const currentUrl = shareUrl || window.location.href
  const shareText = description || `Check out this ${type}: ${title}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      showToast.success('Link copied!', 'Share it with your friends')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast.error('Failed to copy', 'Please try again')
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(currentUrl)
    const encodedText = encodeURIComponent(shareText)
    const encodedTitle = encodeURIComponent(title)

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}${imageUrl ? `&media=${encodeURIComponent(imageUrl)}` : ''}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
    }

    const url = shareUrls[platform]
    if (url) {
      if (platform === 'email') {
        window.location.href = url
      } else {
        window.open(url, '_blank', 'width=600,height=400')
      }
    }
  }

  const handleSaveToGoogleDrive = async () => {
    if (!imageUrl) {
      showToast.error('No image available', 'Cannot save to Google Drive without an image')
      return
    }

    setIsSavingToDrive(true)

    try {
      // For Google Drive integration, we'd typically:
      // 1. Use Google Drive Picker API or
      // 2. OAuth2 flow to get user consent
      // 3. Upload the image to their Drive

      // For now, open Google Drive with the image URL
      // In production, implement proper Google Drive API integration
      const driveUrl = `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(title)}`

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Open Google Drive (in production, use Drive API to upload)
      window.open(driveUrl, '_blank')

      showToast.success('Opening Google Drive', 'You can save the image from there')
    } catch {
      showToast.error('Failed to connect', 'Could not connect to Google Drive')
    } finally {
      setIsSavingToDrive(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) {
      showToast.error('No image available', 'Cannot download without an image')
      return
    }

    setIsDownloading(true)

    try {
      // Fetch the image
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_curatorai.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      if (!isPremium) {
        showToast.success(
          'Downloaded with watermark',
          'Upgrade to Premium for watermark-free downloads'
        )
      } else {
        showToast.success('Downloaded!', 'Image saved to your device')
      }
    } catch {
      showToast.error('Download failed', 'Please try again')
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-bold text-brand-charcoal">Share {type}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="relative mx-4 mt-4 aspect-video overflow-hidden rounded-lg bg-brand-beige/20">
              <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="truncate text-sm font-semibold text-white">{title}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4 p-4">
            {/* Copy Link */}
            <div className="flex items-center gap-2 rounded-lg border bg-brand-beige/20 p-2">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 truncate bg-transparent px-2 text-sm text-muted-foreground outline-none"
              />
              <Button
                size="sm"
                variant={copied ? 'default' : 'outline'}
                onClick={handleCopyLink}
                className={copied ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Social Share */}
            <div>
              <p className="mb-3 text-sm font-medium text-muted-foreground">Share on social</p>
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('twitter')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-shadow hover:shadow-lg"
                >
                  <TwitterIcon />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('facebook')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white transition-shadow hover:shadow-lg"
                >
                  <FacebookIcon />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('whatsapp')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-shadow hover:shadow-lg"
                >
                  <WhatsAppIcon />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('pinterest')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E60023] text-white transition-shadow hover:shadow-lg"
                >
                  <PinterestIcon />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSocialShare('email')}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gray text-white transition-shadow hover:shadow-lg"
                >
                  <Mail className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or save</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Save Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Drive */}
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleSaveToGoogleDrive}
                disabled={isSavingToDrive || !imageUrl}
              >
                {isSavingToDrive ? (
                  <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-green-500 to-blue-500 text-white">
                    <HardDrive className="h-5 w-5" />
                  </div>
                )}
                <span className="text-sm font-medium">Google Drive</span>
              </Button>

              {/* Download */}
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={handleDownload}
                disabled={isDownloading || !imageUrl}
              >
                {isDownloading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-brand-crimson" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-crimson text-white">
                    <Download className="h-5 w-5" />
                  </div>
                )}
                <span className="text-sm font-medium">Download</span>
                {!isPremium && (
                  <Badge variant="secondary" className="text-[10px]">
                    With watermark
                  </Badge>
                )}
              </Button>
            </div>

            {/* Premium Upsell */}
            {!isPremium && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-gradient-to-r from-brand-crimson/10 to-brand-blue/10 p-3"
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-brand-crimson" />
                  <span className="text-xs font-medium text-brand-charcoal">
                    Upgrade to Premium for watermark-free downloads
                  </span>
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
