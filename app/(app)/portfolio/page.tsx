import { PieChart } from 'lucide-react'

import { HoldingRow } from '@/components/portfolio/HoldingRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard } from '@/components/ui/StatCard'
import { getPortfolioPageData } from '@/lib/data'
import { formatCurrency, formatPercent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const data = await getPortfolioPageData()

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Portfolio Value" value={formatCurrency(data.metrics.portfolioValue)} icon={PieChart} hint="Cash + holdings" trend="positive" />
        <StatCard title="Holdings Value" value={formatCurrency(data.metrics.holdingsValue)} icon={PieChart} hint="Live market value" />
        <StatCard title="Unrealized P&L" value={formatCurrency(data.metrics.unrealizedPnl)} icon={PieChart} hint={formatPercent((data.metrics.unrealizedPnl / data.metrics.investedValue) * 100 || 0)} trend={data.metrics.unrealizedPnl >= 0 ? 'positive' : 'negative'} />
        <StatCard title="Cash" value={formatCurrency(data.portfolio.cash)} icon={PieChart} hint="Available buying power" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Holdings</h2>
            <p className="text-sm text-gray-400">{data.portfolio.holdings.length} open positions</p>
          </div>
          {data.portfolio.holdings.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-3 pr-4">Company</th>
                    <th className="py-3 pr-4">Sector</th>
                    <th className="py-3 pr-4">Shares</th>
                    <th className="py-3 pr-4">Avg Cost</th>
                    <th className="py-3 pr-4">Market Value</th>
                    <th className="py-3 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {data.portfolio.holdings.map((holding) => (
                    <HoldingRow key={holding.id} holding={holding} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState icon={PieChart} title="No holdings yet" description="Open your first fictional position to start building a portfolio." actionLabel="Go to market" actionHref="/market" />
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Sector allocation</h2>
          <div className="mt-4 space-y-4">
            {data.sectorAllocation.map((item) => {
              const pct = (item.value / data.metrics.holdingsValue) * 100
              return (
                <div key={item.sector}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white">{item.sector}</span>
                    <span className="text-gray-400">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold">Trade history</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Ticker</th>
                <th className="py-3 pr-4">Shares</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-800 last:border-0">
                  <td className="py-4 pr-4 text-gray-300">{new Date(trade.createdAt).toLocaleString()}</td>
                  <td className={`py-4 pr-4 font-medium ${trade.type === 'buy' ? 'text-emerald-300' : 'text-rose-300'}`}>{trade.type}</td>
                  <td className="py-4 pr-4 text-white">{trade.company.ticker}</td>
                  <td className="py-4 pr-4 text-gray-300">{trade.shares.toFixed(2)}</td>
                  <td className="py-4 pr-4 text-gray-300">{formatCurrency(trade.price)}</td>
                  <td className="py-4 text-gray-300">{formatCurrency(trade.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
