import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'
import { Button } from '@/presentation/components/ui/button'
import { ArrowUpDown, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type SortOption = 'date' | 'timesWorn' | 'price' | 'brand' | 'name'

interface SortMenuProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export const SortMenu = ({ currentSort, onSortChange }: SortMenuProps) => {
  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'date', label: 'Date Added' },
    { value: 'timesWorn', label: 'Most Worn' },
    { value: 'price', label: 'Price (High to Low)' },
    { value: 'brand', label: 'Brand (A-Z)' },
    { value: 'name', label: 'Name (A-Z)' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={cn(
              'flex items-center justify-between',
              currentSort === option.value && 'bg-brand-crimson/10'
            )}
          >
            <span>{option.label}</span>
            {currentSort === option.value && <Check className="h-4 w-4 text-brand-crimson" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
