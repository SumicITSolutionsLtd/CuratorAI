import { motion } from 'framer-motion'
import { Sparkles, Upload, Zap, ShoppingBag } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { useState, useRef } from 'react'

export const ControlPanel = () => {
  const [aiPrompt, setAiPrompt] = useState('')
  const [spiciness, setSpiciness] = useState([60])
  const [budget, setBudget] = useState([300])
  const [ecoFocus, setEcoFocus] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleWardrobeUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // TODO: Handle file upload
      console.log('Files selected:', files)
      alert(`${files.length} file(s) selected for upload`)
    }
  }

  const handleGenerateRecommendations = () => {
    // TODO: Implement recommendation generation
    console.log('Generating recommendations with filters:', {
      aiPrompt,
      spiciness: spiciness[0],
      budget: budget[0],
      ecoFocus,
    })
    alert('Generating personalized recommendations...')
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-4"
    >
      <Card className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-brand-charcoal">Controls</h3>
          <p className="text-sm text-muted-foreground">Guide the AI</p>
        </div>

        {/* AI Prompt */}
        <div className="mb-6">
          <Label className="mb-2 block font-semibold text-brand-charcoal">Prompt</Label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Smart casual for a rooftop dinner, earth tones, sneakers OK"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
          />
        </div>

        {/* Spiciness Slider */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-brand-crimson" />
            <Label className="font-semibold text-brand-charcoal">Spiciness</Label>
          </div>
          <Slider
            min={0}
            max={100}
            step={10}
            value={spiciness}
            onValueChange={setSpiciness}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">
            Higher = more adventurous picks ({spiciness[0]}%)
          </p>
        </div>

        {/* Budget Slider */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-brand-blue" />
            <Label className="font-semibold text-brand-charcoal">Budget (USD)</Label>
          </div>
          <Slider
            min={0}
            max={1000}
            step={50}
            value={budget}
            onValueChange={setBudget}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">Target total ≈ ${budget[0]}</p>
        </div>

        {/* Eco/Sustainable Focus */}
        <div className="mb-6 flex items-center justify-between rounded-lg border p-4">
          <Label className="font-medium text-brand-charcoal">Eco / sustainable focus</Label>
          <Switch checked={ecoFocus} onCheckedChange={setEcoFocus} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            className="w-full bg-brand-charcoal text-white hover:bg-brand-charcoal/90"
            size="lg"
            onClick={handleGenerateRecommendations}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate
          </Button>
          <Button variant="outline" className="w-full" size="lg" onClick={handleWardrobeUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Wardrobe
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
