import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number
  label?: string
  className?: string
}) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <div className="flex justify-between text-xs text-gray-400"><span>{label}</span><span>{safeValue.toFixed(0)}%</span></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-200"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}
