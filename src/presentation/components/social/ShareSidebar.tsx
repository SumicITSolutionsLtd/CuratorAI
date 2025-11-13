import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Twitter, Facebook, MessageCircle, Mail, Link2, Check, X, Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { showToast } from '../../../shared/utils/toast'

interface ShareSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  postUrl?: string
}

export const ShareSidebar = ({
  open,
  onOpenChange,
  postId,
  postUrl = `${window.location.origin}/posts/${postId}`,
}: ShareSidebarProps) => {
  const [copied, setCopied] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock users for direct sharing
  const suggestedUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: '2',
      name: 'Mike Chen',
      username: 'mike_style',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      username: 'emma_w',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    {
      id: '4',
      name: 'Alex Chen',
      username: 'alex_fashion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
  ]

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
      bgColor: 'bg-[#1DA1F2]/10',
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
      bgColor: 'bg-[#4267B2]/10',
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
      bgColor: 'bg-[#25D366]/10',
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, '_blank')
      },
    },
    {
      icon: Mail,
      label: 'Email',
      color: 'text-brand-gray',
      bgColor: 'bg-brand-gray/10',
      action: () => {
        window.location.href = `mailto:?subject=Check out this outfit&body=${encodeURIComponent(postUrl)}`
      },
    },
  ]

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleSendDirectMessage = () => {
    if (selectedUsers.length === 0) {
      showToast.error('Please select at least one person')
      return
    }
    showToast.success(
      `Sent to ${selectedUsers.length} ${selectedUsers.length === 1 ? 'person' : 'people'}!`
    )
    setSelectedUsers([])
    setMessageText('')
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <>
      {/* Mobile/Tablet - Bottom Sheet */}
      <div className="lg:hidden">
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onOpenChange(false)}
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: 9998 }}
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-background shadow-2xl"
                style={{ zIndex: 9999 }}
              >
                {/* Header */}
                <div className="border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-montserrat text-xl font-semibold">Share Post</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share this post with your friends and followers
                  </p>
                </div>

                <div className="max-h-[calc(85vh-80px)] space-y-6 overflow-y-auto p-6">
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
                      <p className="font-medium text-foreground">
                        {copied ? 'Link Copied!' : 'Copy Link'}
                      </p>
                      <p className="text-sm text-muted-foreground">Share anywhere</p>
                    </div>
                  </motion.button>

                  {/* Social Share Options */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-foreground">
                      Share to social media
                    </p>
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
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-full ${option.bgColor}`}
                            >
                              <Icon className={`h-6 w-6 ${option.color}`} />
                            </div>
                            <span className="text-xs text-muted-foreground">{option.label}</span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Direct Share */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-foreground">Send to friends</p>
                    <div className="space-y-2">
                      {suggestedUsers.map((user) => (
                        <motion.button
                          key={user.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleUserSelection(user.id)}
                          className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                            selectedUsers.includes(user.id)
                              ? 'border-brand-crimson bg-brand-crimson/10'
                              : 'border-border bg-background hover:bg-accent'
                          } border`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                          {selectedUsers.includes(user.id) && (
                            <Check className="h-5 w-5 text-brand-crimson" />
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {selectedUsers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-3"
                      >
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Add a message (optional)..."
                          rows={2}
                          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                        />
                        <Button
                          onClick={handleSendDirectMessage}
                          className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send to {selectedUsers.length}{' '}
                          {selectedUsers.length === 1 ? 'person' : 'people'}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop - Right Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 hidden bg-black/30 lg:block"
              style={{ zIndex: 9998 }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 hidden w-[480px] flex-col bg-background shadow-2xl lg:flex"
              style={{ zIndex: 9999 }}
            >
              {/* Header */}
              <div className="shrink-0 border-b border-border px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-montserrat text-xl font-semibold">Share Post</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Share this post with your friends and followers
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                {/* Copy Link Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson/10">
                    {copied ? (
                      <Check className="h-6 w-6 text-brand-crimson" />
                    ) : (
                      <Link2 className="h-6 w-6 text-brand-crimson" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-semibold text-foreground">
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </p>
                    <p className="text-sm text-muted-foreground">Share anywhere</p>
                  </div>
                </motion.button>

                {/* Social Share Options */}
                <div>
                  <p className="mb-4 text-sm font-semibold text-foreground">
                    Share to social media
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {shareOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <motion.button
                          key={option.label}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={option.action}
                          className={`flex items-center gap-3 rounded-lg p-4 transition-colors ${option.bgColor} hover:opacity-80`}
                        >
                          <Icon className={`h-6 w-6 ${option.color}`} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Direct Share */}
                <div>
                  <p className="mb-4 text-sm font-semibold text-foreground">Send to friends</p>
                  <div className="space-y-2">
                    {suggestedUsers.map((user) => (
                      <motion.button
                        key={user.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleUserSelection(user.id)}
                        className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                          selectedUsers.includes(user.id)
                            ? 'border-brand-crimson bg-brand-crimson/10'
                            : 'border-border bg-background hover:bg-accent'
                        } border`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <Check className="h-5 w-5 text-brand-crimson" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {selectedUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Add a message (optional)..."
                        rows={3}
                        className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                      />
                      <Button
                        onClick={handleSendDirectMessage}
                        className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send to {selectedUsers.length}{' '}
                        {selectedUsers.length === 1 ? 'person' : 'people'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
