import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { OutfitGrid } from '@/presentation/components/outfit/OutfitGrid'
import { Outfit } from '@/shared/types/outfit'

export const VisualSearchPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<Outfit[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        setIsProcessing(true)

        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          setResults(mockResults)
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

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
          {!uploadedImage ? (
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
                            />
                            <Button size="lg" asChild>
                              <span className="cursor-pointer">
                                <Upload className="mr-2 h-5 w-5" />
                                Upload Image
                              </span>
                            </Button>
                          </label>

                          <Button size="lg" variant="outline">
                            <Camera className="mr-2 h-5 w-5" />
                            Take Photo
                          </Button>

                          <Button size="lg" variant="outline">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadedImage(null)
                          setResults([])
                        }}
                      >
                        Upload New
                      </Button>
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-6">
                    <h3 className="mb-4 font-semibold">Analysis</h3>
                    {isProcessing ? (
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
                            Found {results.length} similar outfits
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Detected Style</span>
                            <span className="font-medium">Casual Chic</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Color Palette</span>
                            <div className="flex gap-1">
                              <div className="h-6 w-6 rounded bg-brand-blue" />
                              <div className="h-6 w-6 rounded border bg-white" />
                              <div className="h-6 w-6 rounded bg-gray-800" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Detected Items</span>
                            <span className="font-medium">3 items</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Results */}
              {!isProcessing && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Similar Outfits</h2>
                    <p className="text-sm text-muted-foreground">{results.length} results found</p>
                  </div>
                  <OutfitGrid outfits={results} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}

const mockResults = [
  {
    id: '1',
    name: 'Summer Vibes Ensemble',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    items: [
      { name: 'Floral Midi Dress', price: 89 },
      { name: 'Strappy Sandals', price: 45 },
    ],
    totalPrice: 134,
    matchScore: 96,
    tags: ['Summer', 'Casual', 'Similar'],
    likes: 234,
  },
  {
    id: '2',
    name: 'Urban Street Style',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    items: [
      { name: 'Graphic Hoodie', price: 65 },
      { name: 'Denim Jacket', price: 98 },
    ],
    totalPrice: 163,
    matchScore: 92,
    tags: ['Street', 'Urban'],
    likes: 189,
  },
]
