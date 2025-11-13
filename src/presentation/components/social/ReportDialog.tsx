import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Flag } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { showToast } from '../../../shared/utils/toast'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  postAuthor: string
}

const reportReasons = [
  {
    value: 'spam',
    label: 'Spam or misleading',
    description: 'Fake engagement, scams, or misleading content',
  },
  {
    value: 'inappropriate',
    label: 'Inappropriate content',
    description: 'Nudity, violence, or offensive material',
  },
  {
    value: 'harassment',
    label: 'Harassment or bullying',
    description: 'Targeting or attacking individuals',
  },
  {
    value: 'copyright',
    label: 'Copyright violation',
    description: 'Unauthorized use of copyrighted material',
  },
  {
    value: 'fake',
    label: 'False information',
    description: 'Deliberately false or misleading information',
  },
  {
    value: 'other',
    label: 'Something else',
    description: 'Other issues not listed above',
  },
]

export const ReportDialog = ({ open, onOpenChange, postAuthor }: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) {
      showToast.error('Please select a reason')
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    showToast.success('Report submitted. Thank you for keeping our community safe!')

    setIsSubmitting(false)
    setSelectedReason('')
    setAdditionalInfo('')
    onOpenChange(false)
  }

  const handleClose = () => {
    setSelectedReason('')
    setAdditionalInfo('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Flag className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <DialogTitle className="text-center font-montserrat text-xl">Report Post</DialogTitle>
          <DialogDescription className="text-center">
            Help us understand what's wrong with this post by {postAuthor}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-2"
          >
            {reportReasons.map((reason) => (
              <motion.div key={reason.value} whileHover={{ scale: 1.01 }} className="relative">
                <div className="flex items-start space-x-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent">
                  <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                  <Label htmlFor={reason.value} className="flex-1 cursor-pointer space-y-1">
                    <p className="text-sm font-medium">{reason.label}</p>
                    <p className="text-xs text-muted-foreground">{reason.description}</p>
                  </Label>
                </div>
              </motion.div>
            ))}
          </RadioGroup>

          {selectedReason && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Label htmlFor="additional-info" className="text-sm font-medium">
                Additional information (optional)
              </Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Provide any additional details that might help us review this report..."
                className="mt-2 min-h-[100px]"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {additionalInfo.length}/500 characters
              </p>
            </motion.div>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-900/10 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Reports are anonymous. We'll review this report and take appropriate action if it
              violates our Community Guidelines.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
