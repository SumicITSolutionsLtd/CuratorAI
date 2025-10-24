import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Camera,
  Upload,
  RotateCw,
  Download,
  Share2,
  Sparkles,
  Image as ImageIcon,
  Settings,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { Slider } from '@/presentation/components/ui/slider'
import { cn } from '@/shared/utils/cn'

const sampleGarments = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop',
    category: 'Dresses',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    category: 'Jackets',
  },
  {
    id: 3,
    name: 'White Button-Up',
    image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=300&h=400&fit=crop',
    category: 'Tops',
  },
  {
    id: 4,
    name: 'Black Midi Skirt',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=400&fit=crop',
    category: 'Bottoms',
  },
]

export const TryOnPage = () => {
  const [selectedGarment, setSelectedGarment] = useState<number | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [brightness, setBrightness] = useState([100])
  const [contrast, setContrast] = useState([100])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTryOn = () => {
    setIsProcessing(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Virtual Try-On</h1>
          <p className="text-muted-foreground">
            See how clothes look on you with AI-powered virtual fitting
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-brand-crimson/20 p-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-crimson/10">
              <Camera className="h-6 w-6 text-brand-crimson" />
            </div>
            <h3 className="font-semibold text-brand-charcoal">Upload Photo</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Take a full-body photo or upload from gallery
            </p>
          </Card>

          <Card className="border-brand-blue/20 p-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
              <Sparkles className="h-6 w-6 text-brand-blue" />
            </div>
            <h3 className="font-semibold text-brand-charcoal">Select Garment</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose from your wardrobe or our collection
            </p>
          </Card>

          <Card className="border-amber-500/20 p-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <ImageIcon className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-semibold text-brand-charcoal">See Result</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              AI generates realistic try-on in seconds
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Try-On Canvas */}
          <div className="space-y-4 lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Upload Area */}
                {!userImage ? (
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-crimson/30 bg-gradient-to-br from-brand-ivory to-brand-beige transition-all hover:border-brand-crimson/60"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="space-y-3 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/10">
                        <Upload className="h-8 w-8 text-brand-crimson" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-charcoal">Upload Your Photo</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Click to browse or drag and drop
                        </p>
                      </div>
                      <Button className="bg-brand-crimson hover:bg-brand-crimson/90">
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                  </motion.label>
                ) : (
                  /* Preview Area */
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-brand-charcoal">
                    <img
                      src={userImage}
                      alt="Your photo"
                      className="h-full w-full object-cover"
                      style={{
                        filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`,
                      }}
                    />

                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="space-y-3 text-center">
                          <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-crimson" />
                          <p className="font-medium text-white">AI is trying on your outfit...</p>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute right-4 top-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                      >
                        <RotateCw className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                        onClick={() => setUserImage(null)}
                      >
                        <Upload className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {userImage && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleTryOn}
                      disabled={!selectedGarment || isProcessing}
                      className="h-12 flex-1 bg-brand-crimson hover:bg-brand-crimson/90"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      {isProcessing ? 'Processing...' : 'Try On Selected'}
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Adjustments */}
            {userImage && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-brand-crimson" />
                    <h3 className="font-semibold text-brand-charcoal">Adjustments</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label>Brightness</label>
                        <span className="text-muted-foreground">{brightness[0]}%</span>
                      </div>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        min={50}
                        max={150}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <label>Contrast</label>
                        <span className="text-muted-foreground">{contrast[0]}%</span>
                      </div>
                      <Slider
                        value={contrast}
                        onValueChange={setContrast}
                        min={50}
                        max={150}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Garment Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 p-6">
              <h3 className="mb-4 font-semibold text-brand-charcoal">Select Garment</h3>

              <Tabs defaultValue="wardrobe" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wardrobe">My Wardrobe</TabsTrigger>
                  <TabsTrigger value="shop">Shop</TabsTrigger>
                </TabsList>

                <TabsContent value="wardrobe" className="mt-4 space-y-3">
                  {sampleGarments.map((garment) => (
                    <motion.button
                      key={garment.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGarment(garment.id)}
                      className={cn(
                        'relative w-full overflow-hidden rounded-lg transition-all',
                        selectedGarment === garment.id
                          ? 'ring-2 ring-brand-crimson ring-offset-2'
                          : 'opacity-70 hover:opacity-100'
                      )}
                    >
                      <div className="flex gap-3 rounded-lg bg-muted p-2">
                        <img
                          src={garment.image}
                          alt={garment.name}
                          className="h-20 w-16 rounded object-cover"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-brand-charcoal">{garment.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {garment.category}
                          </Badge>
                        </div>
                      </div>
                      {selectedGarment === garment.id && (
                        <div className="absolute right-2 top-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson">
                            <div className="h-2 w-2 rounded-full bg-white" />
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </TabsContent>

                <TabsContent value="shop" className="mt-4">
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Browse our catalog to try on items before purchasing
                  </p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
