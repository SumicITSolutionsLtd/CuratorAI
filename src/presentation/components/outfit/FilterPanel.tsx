import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { useState } from 'react'

const occasions = ['Casual', 'Work', 'Party', 'Date', 'Sport', 'Travel']
const styles = ['Minimal', 'Boho', 'Street', 'Vintage', 'Formal']
const priceRanges = ['$0-50', '$50-100', '$100-200', '$200+']

export const FilterPanel = () => {
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    )
  }

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  const clearAll = () => {
    setSelectedOccasions([])
    setSelectedStyles([])
    setSelectedPriceRange(null)
  }

  const activeFilters =
    selectedOccasions.length + selectedStyles.length + (selectedPriceRange ? 1 : 0)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-4"
    >
      <Card className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-brand-crimson" />
            <h3 className="font-semibold text-lg">Filters</h3>
            {activeFilters > 0 && (
              <Badge variant="secondary">{activeFilters}</Badge>
            )}
          </div>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>

        {/* Occasion */}
        <div className="mb-6">
          <Label className="mb-3 block text-sm font-medium">Occasion</Label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occasion) => {
              const isSelected = selectedOccasions.includes(occasion)
              return (
                <motion.div key={occasion} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={isSelected ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-crimson hover:bg-brand-crimson/90'
                        : 'hover:border-brand-crimson'
                    }`}
                    onClick={() => toggleOccasion(occasion)}
                  >
                    {occasion}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Style */}
        <div className="mb-6">
          <Label className="mb-3 block text-sm font-medium">Style</Label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => {
              const isSelected = selectedStyles.includes(style)
              return (
                <motion.div key={style} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant={isSelected ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-blue hover:bg-brand-blue/90'
                        : 'hover:border-brand-blue'
                    }`}
                    onClick={() => toggleStyle(style)}
                  >
                    {style}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-3 block text-sm font-medium">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            {priceRanges.map((range) => {
              const isSelected = selectedPriceRange === range
              return (
                <motion.div key={range} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full ${
                      isSelected && 'bg-brand-crimson hover:bg-brand-crimson/90'
                    }`}
                    onClick={() =>
                      setSelectedPriceRange(isSelected ? null : range)
                    }
                  >
                    {range}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
