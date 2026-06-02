import type { LucideIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full border border-gray-800 bg-gray-950 p-4">
        <Icon className="h-8 w-8 text-indigo-300" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-gray-400">{description}</p>
      </div>
      {actionLabel && actionHref ? (
        <Link className={cn(buttonVariants())} href={actionHref}>
          {actionLabel}
        </Link>
      ) : null}
    </Card>
  )
}
