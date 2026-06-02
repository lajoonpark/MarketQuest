import { differenceInHours, isAfter } from 'date-fns'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { NewsRecord } from '@/lib/types'

export function NewsCard({ news }: { news: NewsRecord }) {
  const active = isAfter(new Date(news.expiresAt), new Date())
  const hoursLeft = Math.max(0, differenceInHours(new Date(news.expiresAt), new Date()))

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={news.impactDirection === 'positive' ? 'positive' : news.impactDirection === 'negative' ? 'negative' : 'neutral'}>
          {news.impactDirection}
        </Badge>
        <Badge variant={active ? 'info' : 'warning'}>{active ? `Active · ${hoursLeft}h left` : 'Expired'}</Badge>
        {news.affectedSector ? <Badge>{news.affectedSector}</Badge> : null}
        {news.company ? <Badge>{news.company.ticker}</Badge> : null}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{news.title}</h3>
        <p className="mt-2 text-sm text-gray-400">{news.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Impact strength {(news.impactStrength * 100).toFixed(0)} bp</span>
        <span>{new Date(news.createdAt).toLocaleString()}</span>
      </div>
    </Card>
  )
}
