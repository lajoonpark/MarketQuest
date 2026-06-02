import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
}: {
  title: string
  value: string
  icon: LucideIcon
  hint?: string
  trend?: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{value}</h3>
        </div>
        <div className="rounded-xl bg-gray-950 p-3">
          <Icon className="h-5 w-5 text-indigo-300" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-gray-400">{hint}</p>
        {trend ? (
          <Badge
            variant={trend === 'positive' ? 'positive' : trend === 'negative' ? 'negative' : 'neutral'}
            className={cn('uppercase tracking-wide')}
          >
            {trend}
          </Badge>
        ) : null}
      </div>
    </Card>
  )
}
