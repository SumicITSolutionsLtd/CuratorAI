import { cn } from '@/shared/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  variant?: 'default' | 'light' | 'dark'
}

const sizeClasses = {
  sm: 'h-16',   // 64px (increased from 48px)
  md: 'h-20',   // 80px (increased from 64px)
  lg: 'h-28',   // 112px (increased from 96px)
  xl: 'h-40',   // 160px (increased from 128px)
}

export const Logo = ({ className, size = 'md', showTagline = false, variant = 'default' }: LogoProps) => {
  const textColor = variant === 'light' ? 'text-brand-ivory' : 'text-brand-charcoal'

  // Scale text with logo size
  const textSizes = {
    sm: { brand: 'text-2xl', tagline: 'text-sm' },
    md: { brand: 'text-3xl', tagline: 'text-base' },
    lg: { brand: 'text-4xl', tagline: 'text-lg' },
    xl: { brand: 'text-6xl', tagline: 'text-xl' },
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="CuratorAI Logo"
        className={cn(sizeClasses[size], 'w-auto object-contain')}
        style={{ imageRendering: 'auto' }}
        loading="eager"
      />

      {/* Brand Name & Tagline */}
      {showTagline && (
        <div className="flex flex-col gap-1">
          <h1 className={cn('font-logo font-bold leading-none', textSizes[size].brand, textColor)}>
            CuratorAI
          </h1>
          <p className={cn('font-logo italic leading-none', textSizes[size].tagline, textColor === 'text-brand-ivory' ? 'text-brand-ivory/80' : 'text-brand-gray')}>
            Where Fashion Meets Intelligence
          </p>
        </div>
      )}
    </div>
  )
}
