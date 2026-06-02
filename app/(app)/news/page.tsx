import Link from 'next/link'

import { NewsCard } from '@/components/news/NewsCard'
import { Badge } from '@/components/ui/Badge'
import { getNewsPageData } from '@/lib/data'

export const dynamic = 'force-dynamic'

const filters = ['all', 'market', 'sector', 'company'] as const

export default async function NewsPage({ searchParams }: { searchParams?: { type?: string } }) {
  const { news, activeCount } = await getNewsPageData()
  const selected = (searchParams?.type ?? 'all') as (typeof filters)[number]

  const filtered = news.filter((item) => {
    if (selected === 'market') return !item.affectedSector && !item.company
    if (selected === 'sector') return Boolean(item.affectedSector)
    if (selected === 'company') return Boolean(item.company)
    return true
  })

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Market news feed</h2>
            <p className="mt-1 text-sm text-gray-400">Track fictional catalysts shaping sentiment, sector rotation, and company momentum.</p>
          </div>
          <Badge variant="info">{activeCount} active catalysts</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Link key={filter} href={`/news?type=${filter}`}>
              <Badge variant={filter === selected ? 'info' : 'neutral'} className="capitalize">{filter}</Badge>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {filtered.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </section>
    </div>
  )
}
