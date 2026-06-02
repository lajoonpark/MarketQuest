import { AlertTriangle } from 'lucide-react'

import { Card } from '@/components/ui/Card'

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
}: {
  title?: string
  description?: string
}) {
  return (
    <Card className="flex items-start gap-4 border-rose-500/20 bg-rose-500/5">
      <div className="rounded-full bg-rose-500/10 p-2">
        <AlertTriangle className="h-5 w-5 text-rose-300" />
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-rose-100/80">{description}</p>
      </div>
    </Card>
  )
}
