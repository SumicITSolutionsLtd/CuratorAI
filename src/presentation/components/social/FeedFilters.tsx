import { motion } from 'framer-motion'
import { SlidersHorizontal, Clock, TrendingUp, Heart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export type SortOption = 'recent' | 'popular' | 'trending'

interface FeedFiltersProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  activeFilters?: string[]
  onFilterRemove?: (filter: string) => void
}

const sortOptions = [
  {
    value: 'recent' as SortOption,
    label: 'Most Recent',
    icon: Clock,
    description: 'Newest posts first',
  },
  {
    value: 'popular' as SortOption,
    label: 'Most Popular',
    icon: Heart,
    description: 'Highest engagement',
  },
  {
    value: 'trending' as SortOption,
    label: 'Trending Now',
    icon: TrendingUp,
    description: 'Rising in popularity',
  },
]

export const FeedFilters = ({
  sortBy,
  onSortChange,
  activeFilters = [],
  onFilterRemove,
}: FeedFiltersProps) => {
  const currentSort = sortOptions.find((opt) => opt.value === sortBy)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 pb-4"
    >
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 border-dashed">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Sort:</span>
            <span className="font-medium">{currentSort?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Sort Posts By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="h-9 gap-1 px-3">
              {filter}
              {onFilterRemove && (
                <button
                  onClick={() => onFilterRemove(filter)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  )
}
