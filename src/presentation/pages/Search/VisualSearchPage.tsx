import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { OutfitGrid } from '@/presentation/components/outfit/OutfitGrid'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import {
  performVisualSearch,
  uploadSearchImage,
  clearResults,
} from '@/shared/store/slices/searchSlice'
import { showToast } from '@/shared/utils/toast'

export const VisualSearchPage = () => {
  const dispatch = useAppDispatch()
  const { uploadedImageUrl, results, isProcessing, isLoading } = useAppSelector(
    (state) => state.search
  )

  const [detectedStyle, setDetectedStyle] = useState<string>('')
  const [detectedItems, setDetectedItems] = useState<number>(0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast.error('File too large', 'Please upload an image smaller than 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Invalid file type', 'Please upload a valid image file')
      return
    }

    try {
      // Upload image first
      await dispatch(uploadSearchImage(file)).unwrap()

      // Perform visual search
      const result = await dispatch(
        performVisualSearch({
          image: file,
          similarityThreshold: 0.7,
          removeDuplicates: true,
        })
      ).unwrap()

      // Extract detected information from results
      if (result.results && result.results.length > 0) {
        // Mock style detection - in real implementation this would come from backend
        setDetectedStyle('Casual Chic')
        setDetectedItems(3)
        showToast.success('Search Complete', `Found ${result.results.length} similar items`)
      } else {
        showToast.info('No Results', 'No similar items found. Try another image.')
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to perform visual search'
      showToast.error('Search Failed', errorMsg)
      console.error('Visual search error:', error)
    }
  }

  const handleReset = () => {
    dispatch(clearResults())
    setDetectedStyle('')
    setDetectedItems(0)
  }

  // Transform results to match OutfitGrid format
  const outfits = results.map((result) => ({
    id: result.id || '',
    name: result.outfit?.name || 'Similar Item',
    imageUrl: result.outfit?.imageUrl || '',
    items:
      result.outfit?.items?.map((item: any) => ({
        name: item.name || '',
        price: item.price || 0,
      })) || [],
    totalPrice: result.outfit?.totalPrice || 0,
    matchScore: Math.round((result.similarityScore || 0) * 100),
    tags: [],
    likes: 0,
  }))

  const loading = isProcessing || isLoading

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold">Visual Search</h1>
          <p className="text-muted-foreground">
            Upload any fashion image to find similar outfits and styles
          </p>
        </motion.div>

        {/* Upload Area */}
        <AnimatePresence mode="wait">
          {!uploadedImageUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <div className="aspect-[21/9] bg-gradient-to-br from-brand-crimson/10 via-brand-blue/10 to-brand-beige/20">
                    <div className="flex h-full items-center justify-center p-12">
                      <div className="text-center">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-crimson to-brand-blue"
                        >
                          <Sparkles className="h-12 w-12 text-white" />
                        </motion.div>

                        <h2 className="mb-2 text-2xl font-bold">Find Your Perfect Match</h2>
                        <p className="mb-8 text-muted-foreground">
                          Upload a photo or take a picture to discover similar styles
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                          <label>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                              disabled={loading}
                            />
                            <Button size="lg" asChild disabled={loading}>
                              <span className="cursor-pointer">
                                {loading ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-5 w-5" />
                                    Upload Image
                                  </>
                                )}
                              </span>
                            </Button>
                          </label>

                          <Button size="lg" variant="outline" disabled>
                            <Camera className="mr-2 h-5 w-5" />
                            Take Photo
                          </Button>

                          <Button size="lg" variant="outline" disabled>
                            <ImageIcon className="mr-2 h-5 w-5" />
                            Browse Gallery
                          </Button>
                        </div>

                        <div className="mt-8 text-sm text-muted-foreground">
                          Supported formats: JPG, PNG, WebP (Max 10MB)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Uploaded Image & Processing */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">Your Image</h3>
                      <Button variant="outline" size="sm" onClick={handleReset} disabled={loading}>
                        Upload New
                      </Button>
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-6">
                    <h3 className="mb-4 font-semibold">Analysis</h3>
                    {loading ? (
                      <div className="flex aspect-square flex-col items-center justify-center rounded-lg bg-muted/50">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="mb-4 h-12 w-12 text-brand-crimson" />
                        </motion.div>
                        <p className="text-sm text-muted-foreground">
                          Analyzing your image with AI...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-brand-crimson/10 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-brand-crimson" />
                            <span className="text-sm font-medium">Analysis Complete</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Found {results.length} similar items
                          </p>
                        </div>

                        <div className="space-y-2">
                          {detectedStyle && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Detected Style</span>
                              <span className="font-medium">{detectedStyle}</span>
                            </div>
                          )}
                          {detectedItems > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span>Detected Items</span>
                              <span className="font-medium">{detectedItems} items</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm">
                            <span>Match Quality</span>
                            <span className="font-medium">
                              {outfits.length > 0
                                ? `${Math.round(outfits.reduce((sum, o) => sum + o.matchScore, 0) / outfits.length)}%`
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Results */}
              {!loading && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Similar Items</h2>
                    <p className="text-sm text-muted-foreground">{results.length} results found</p>
                  </div>
                  <OutfitGrid outfits={outfits} />
                </motion.div>
              )}

              {/* No Results */}
              {!loading && results.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border bg-muted/30 p-16 text-center"
                >
                  <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No similar items found
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    Try uploading a different image
                  </p>
                  <Button variant="outline" className="mt-4" onClick={handleReset}>
                    Try Another Image
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}
