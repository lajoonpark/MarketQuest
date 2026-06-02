import type { HoldingRecord } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function HoldingRow({ holding }: { holding: HoldingRecord }) {
  const marketValue = holding.company.currentPrice * holding.shares
  const pnl = marketValue - holding.totalInvested
  const pnlPct = holding.totalInvested ? (pnl / holding.totalInvested) * 100 : 0

  return (
    <tr className="border-b border-gray-800 text-sm last:border-0">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10" dangerouslySetInnerHTML={{ __html: holding.company.logoSvg }} />
          <div>
            <p className="font-medium text-white">{holding.company.name}</p>
            <p className="text-xs text-gray-400">{holding.company.ticker}</p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4 text-gray-300">{holding.company.sector}</td>
      <td className="py-4 pr-4 text-gray-300">{holding.shares.toFixed(2)}</td>
      <td className="py-4 pr-4 text-gray-300">{formatCurrency(holding.avgBuyPrice)}</td>
      <td className="py-4 pr-4 text-gray-300">{formatCurrency(marketValue)}</td>
      <td className={`py-4 text-right font-medium ${pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
        {formatCurrency(pnl)} ({formatPercent(pnlPct)})
      </td>
    </tr>
  )
}
