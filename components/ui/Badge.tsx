import { cn } from '@/lib/utils'

const variants = {
  neutral: 'border-gray-700 bg-gray-800 text-gray-200',
  info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200',
  positive: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  negative: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
} as const

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-200',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
