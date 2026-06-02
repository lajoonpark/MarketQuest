import { cn } from '@/lib/utils'

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-colors duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}
