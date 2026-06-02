import Link from 'next/link'

import { CompanyCard } from '@/components/market/CompanyCard'
import { Badge } from '@/components/ui/Badge'
import { getMarketData } from '@/lib/data'
import { getPriceChangePercent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const sectors = ['All', 'Technology', 'Food & Retail', 'Energy', 'Healthcare', 'Entertainment', 'Logistics']

export default async function MarketPage({
  searchParams,
}: {
  searchParams?: { q?: string; sector?: string; sort?: string }
}) {
  const { companies, topGainers, topLosers } = await getMarketData()
  const query = searchParams?.q?.toLowerCase() ?? ''
  const sector = searchParams?.sector ?? 'All'
  const sort = searchParams?.sort ?? 'change'

  const filtered = companies
    .filter((company) =>
      (sector === 'All' || company.sector === sector) &&
      (query === '' || `${company.name} ${company.ticker}`.toLowerCase().includes(query))
    )
    .sort((a, b) => {
      if (sort === 'price') return b.currentPrice - a.currentPrice
      if (sort === 'name') return a.name.localeCompare(b.name)
      return getPriceChangePercent(b.currentPrice, b.previousPrice) - getPriceChangePercent(a.currentPrice, a.previousPrice)
    })

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Market overview</h2>
            <p className="mt-1 text-sm text-gray-400">Search fictional companies, sort by price or performance, and compare sector leaders.</p>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_160px_140px_auto]">
            <input name="q" defaultValue={searchParams?.q} placeholder="Search company or ticker" className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
            <select name="sector" defaultValue={sector} className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500">
              {sectors.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select name="sort" defaultValue={sort} className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500">
              <option value="change">Sort by change</option>
              <option value="price">Sort by price</option>
              <option value="name">Sort by name</option>
            </select>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">Apply</button>
          </form>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sectors.map((item) => (
            <Link key={item} href={`/market?sector=${encodeURIComponent(item)}&sort=${sort}${query ? `&q=${encodeURIComponent(query)}` : ''}`}>
              <Badge variant={item === sector ? 'info' : 'neutral'}>{item}</Badge>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top gainers</h3>
            <Badge variant="positive">Bullish</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {topGainers.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top losers</h3>
            <Badge variant="negative">Pullback</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {topLosers.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold">All companies</h3>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>
    </div>
  )
}
