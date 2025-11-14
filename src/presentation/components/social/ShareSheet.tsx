import { useState } from 'react'
import { motion } from 'framer-motion'
import { Twitter, Facebook, MessageCircle, Mail, Link2, Check } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { showToast } from '../../../shared/utils/toast'

interface ShareSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  postUrl?: string
}

export const ShareSheet = ({
  open,
  onOpenChange,
  postId,
  postUrl = `${window.location.origin}/posts/${postId}`,
}: ShareSheetProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      setCopied(true)
      showToast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showToast.error('Failed to copy link')
    }
  }

  const shareOptions = [
    {
      icon: Twitter,
      label: 'Twitter',
      color: 'text-[#1DA1F2]',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
          '_blank',
          'width=550,height=420'
        )
      },
    },
    {
      icon: Facebook,
      label: 'Facebook',
      color: 'text-[#4267B2]',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
          '_blank',
          'width=550,height=420'
        )
      },
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'text-[#25D366]',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, '_blank')
      },
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'text-brand-gray',
      action: () => {
        window.location.href = `mailto:?subject=Check out this outfit&body=${encodeURIComponent(postUrl)}`
      },
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="inset-x-0 inset-y-auto bottom-0 left-auto right-auto top-auto h-auto max-w-full border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom lg:inset-x-auto lg:inset-y-0 lg:bottom-0 lg:left-auto lg:right-0 lg:top-0 lg:h-screen lg:max-w-md lg:border-l lg:border-t-0 lg:data-[state=closed]:slide-out-to-right lg:data-[state=open]:slide-in-from-right"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-montserrat text-xl">Share Post</SheetTitle>
          <SheetDescription>Share this post with your friends and followers</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Copy Link Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleCopyLink}
            className="flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-crimson/10">
              {copied ? (
                <Check className="h-5 w-5 text-brand-crimson" />
              ) : (
                <Link2 className="h-5 w-5 text-brand-crimson" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{copied ? 'Link Copied!' : 'Copy Link'}</p>
              <p className="text-sm text-muted-foreground">Share anywhere</p>
            </div>
          </motion.button>

          {/* Social Share Options */}
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent">
                    <Icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">{option.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
