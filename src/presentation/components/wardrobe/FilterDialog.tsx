import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { Badge } from '@/presentation/components/ui/badge'
import { getAllBrands, getAllColors } from '@/shared/mocks/wardrobeMockData'

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (filters: FilterValues) => void
  currentFilters: FilterValues
}

export interface FilterValues {
  brand?: string
  color?: string
  season?: string
  minPrice?: number
  maxPrice?: number
}

export const FilterDialog = ({
  open,
  onOpenChange,
  onApply,
  currentFilters,
}: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterValues>(currentFilters)

  const brands = getAllBrands()
  const colors = getAllColors()
  const seasons = [
    'All Season',
    'Spring',
    'Summer',
    'Fall',
    'Winter',
    'Spring/Summer',
    'Fall/Winter',
    'Spring/Fall',
  ]

  const handleApply = () => {
    onApply(filters)
    onOpenChange(false)
  }

  const handleClear = () => {
    setFilters({})
    onApply({})
    onOpenChange(false)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filter Items</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Brand Filter */}
          <div className="space-y-2">
            <Label>Brand</Label>
            <Select
              value={filters.brand || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, brand: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Filter */}
          <div className="space-y-2">
            <Label>Color</Label>
            <Select
              value={filters.color || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, color: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All colors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All colors</SelectItem>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{
                          backgroundColor: color.includes('/') ? undefined : color.toLowerCase(),
                          background: color.includes('/')
                            ? 'linear-gradient(135deg, navy 50%, white 50%)'
                            : undefined,
                        }}
                      />
                      {color}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season Filter */}
          <div className="space-y-2">
            <Label>Season</Label>
            <Select
              value={filters.season || 'all'}
              onValueChange={(value) =>
                setFilters({ ...filters, season: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All seasons</SelectItem>
                {seasons.map((season) => (
                  <SelectItem key={season} value={season}>
                    {season}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  step="10"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  step="10"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button onClick={handleApply} className="bg-brand-crimson">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
