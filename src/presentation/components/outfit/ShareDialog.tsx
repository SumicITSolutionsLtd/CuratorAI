import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Share2,
  Crown,
  Download,
} from 'lucide-react'
import { showToast } from '@/shared/utils/toast'
import { cn } from '@/shared/utils/cn'

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  outfitName: string
  outfitUrl?: string
  onDownload: () => void
  downloadsRemaining: number
  isPremium?: boolean
}

const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]', requiresWatermark: true },
  { name: 'Twitter', icon: Twitter, color: 'bg-[#1DA1F2]', requiresWatermark: true },
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
    requiresWatermark: true,
  },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-[#0A66C2]', requiresWatermark: true },
]

export const ShareDialog = ({
  open,
  onOpenChange,
  outfitName,
  outfitUrl = window.location.href,
  onDownload,
  downloadsRemaining,
  isPremium = false,
}: ShareDialogProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(outfitUrl)
    setIsCopied(true)
    showToast.success('Link Copied!', 'Share this look with your friends')
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSocialShare = (platform: string, requiresWatermark: boolean) => {
    if (requiresWatermark && !isPremium) {
      showToast.success(`Sharing to ${platform}`, 'Your image will include a CuratorAI watermark')
    } else {
      showToast.success(`Sharing to ${platform}`, 'Opening share dialog...')
    }

    // Analytics tracking
    console.log('[Analytics] Social Share:', {
      platform,
      hasWatermark: requiresWatermark && !isPremium,
    })
  }

  const handleInternalShare = () => {
    showToast.success('Shared to Feed!', 'Your look is now visible to your followers')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-brand-blue" />
            Share "{outfitName}"
          </DialogTitle>
          <DialogDescription>Choose where you'd like to share this outfit</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share to CuratorAI Feed - Primary Action */}
          <div className="rounded-lg border-2 border-brand-blue/20 bg-brand-blue/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-brand-charcoal">Share to CuratorAI Feed</h4>
              <Badge className="bg-brand-blue text-white">Recommended</Badge>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Share with your followers on CuratorAI (No watermark)
            </p>
            <Button
              className="w-full bg-brand-blue text-white hover:bg-brand-blue/90"
              onClick={handleInternalShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Post to My Feed
            </Button>
          </div>

          {/* Social Media Platforms */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
              External Social Media
              {!isPremium && (
                <Badge variant="secondary" className="text-xs">
                  Includes Watermark
                </Badge>
              )}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                const hasWatermark = platform.requiresWatermark && !isPremium

                return (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="relative justify-start"
                    onClick={() => handleSocialShare(platform.name, platform.requiresWatermark)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-8 w-8 items-center justify-center rounded',
                        platform.color
                      )}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">{platform.name}</span>
                    {hasWatermark && (
                      <span className="absolute right-2 top-2 text-xs text-muted-foreground">
                        🔒
                      </span>
                    )}
                  </Button>
                )
              })}
            </div>
            {!isPremium && (
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Upgrade to Premium to share without watermarks
              </p>
            )}
          </div>

          {/* Copy Link */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-brand-charcoal">Copy Link</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={outfitUrl}
                readOnly
                className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm"
              />
              <Button onClick={handleCopyLink} variant={isCopied ? 'default' : 'outline'}>
                <LinkIcon className="mr-2 h-4 w-4" />
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Download Option */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-brand-charcoal">Download Look</h4>
              {!isPremium && (
                <Badge variant="secondary" className="text-xs">
                  {downloadsRemaining}/3 today
                </Badge>
              )}
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              {isPremium
                ? 'Download high-quality image without watermark'
                : downloadsRemaining > 0
                  ? `${downloadsRemaining} free downloads remaining today`
                  : 'Daily limit reached. Upgrade to Premium for unlimited downloads.'}
            </p>
            <Button
              className="w-full"
              variant={downloadsRemaining > 0 || isPremium ? 'default' : 'outline'}
              onClick={onDownload}
              disabled={!isPremium && downloadsRemaining === 0}
            >
              {isPremium ? (
                <>
                  <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                  Download (Premium)
                </>
              ) : downloadsRemaining > 0 ? (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade for More
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
