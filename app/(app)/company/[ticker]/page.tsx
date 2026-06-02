import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Activity, Shield, Sparkles } from 'lucide-react'

import { PriceChart } from '@/components/market/PriceChart'
import { NewsCard } from '@/components/news/NewsCard'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getCompanyPageData } from '@/lib/data'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function CompanyDetailPage({
  params,
}: {
  params: { ticker: string } | Promise<{ ticker: string }>
}) {
  const rawParams: unknown = await params
  const ticker =
    rawParams &&
    typeof rawParams === 'object' &&
    'ticker' in rawParams &&
    typeof rawParams.ticker === 'string'
      ? rawParams.ticker
      : undefined
  if (!ticker) return notFound()
  const data = await getCompanyPageData(ticker)
  if (!data) return notFound()

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16" dangerouslySetInnerHTML={{ __html: data.company.logoSvg }} />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gray-400">{data.company.ticker}</p>
                <h1 className="text-3xl font-semibold">{data.company.name}</h1>
                <p className="mt-1 text-sm text-gray-400">{data.company.sector}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold">{formatCurrency(data.company.currentPrice)}</p>
              <Badge variant={data.changePercent >= 0 ? 'positive' : 'negative'} className="mt-2">
                {formatPercent(data.changePercent)}
              </Badge>
              <p className="mt-2 text-xs text-gray-500">Updated {data.activeFor}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{data.company.description}</p>
          <PriceChart data={data.company.priceHistory} />
        </Card>
        <Card className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Company snapshot</h2>
            <p className="mt-1 text-sm text-gray-400">Use these signals alongside the chart before placing a fictional trade.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Shield className="h-4 w-4 text-indigo-300" /> Risk rating</div>
              <p className="mt-2 text-2xl font-semibold">{data.company.riskRating}/5</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Sparkles className="h-4 w-4 text-emerald-300" /> Sentiment</div>
              <p className="mt-2 text-2xl font-semibold">{(data.company.sentimentScore * 100).toFixed(0)}%</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Activity className="h-4 w-4 text-amber-300" /> Growth rating</div>
              <p className="mt-2 text-2xl font-semibold">{data.company.growthRating}/5</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/trade?ticker=${data.company.ticker}`} className={cn(buttonVariants())}>Buy / Sell</Link>
            <Link href="/market" className={cn(buttonVariants({ variant: 'secondary' }))}>Back to market</Link>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Related news</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {data.relatedNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </section>
    </div>
  )
}
