'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { executeTrade } from '@/app/actions/trade'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { CompanyRecord, PortfolioRecord, ProfileRecord } from '@/lib/types'
import { formatCurrency, formatPercent, getPriceChangePercent } from '@/lib/utils'

export function TradeForm({
  companies,
  profile,
  portfolio,
  selectedCompany,
}: {
  companies: CompanyRecord[]
  profile: ProfileRecord
  portfolio: PortfolioRecord
  selectedCompany: CompanyRecord
}) {
  const router = useRouter()
  const [selectedTicker, setSelectedTicker] = useState(selectedCompany.ticker)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('1')
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [tradeSuccess, setTradeSuccess] = useState<boolean | null>(null)
  const [pending, startTransition] = useTransition()

  const activeCompany = useMemo(
    () => companies.find((company) => company.ticker === selectedTicker) ?? selectedCompany,
    [companies, selectedCompany, selectedTicker]
  )
  const ownedHolding = portfolio.holdings.find((holding) => holding.company.ticker === activeCompany.ticker)
  const ownedShares = ownedHolding?.shares ?? 0
  const numericShares = Number(shares || '0')
  const estimatedTotal = activeCompany.currentPrice * numericShares
  const change = getPriceChangePercent(activeCompany.currentPrice, activeCompany.previousPrice)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Place a fictional trade</h2>
            <p className="mt-1 text-sm text-gray-400">Server-side validation locks the live simulated price before every order.</p>
          </div>
          <Badge variant="warning">Educational game · not real money</Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-gray-300">
            <span>Company</span>
            <select value={selectedTicker} onChange={(event) => setSelectedTicker(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500">
              {companies.map((company) => (
                <option key={company.id} value={company.ticker}>
                  {company.ticker} · {company.name}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-2 text-sm text-gray-300">
            <span>Order type</span>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant={tradeType === 'buy' ? 'primary' : 'secondary'} onClick={() => setTradeType('buy')}>
                Buy
              </Button>
              <Button type="button" variant={tradeType === 'sell' ? 'danger' : 'secondary'} onClick={() => setTradeType('sell')}>
                Sell
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12" dangerouslySetInnerHTML={{ __html: activeCompany.logoSvg }} />
            <div>
              <h3 className="font-semibold text-white">{activeCompany.name}</h3>
              <p className="text-sm text-gray-400">{activeCompany.ticker} · {activeCompany.sector}</p>
            </div>
            <Badge variant={change >= 0 ? 'positive' : 'negative'} className="ml-auto">
              {formatPercent(change)}
            </Badge>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Current price</p>
              <p className="mt-1 font-semibold text-white">{formatCurrency(activeCompany.currentPrice)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Available cash</p>
              <p className="mt-1 font-semibold text-white">{formatCurrency(portfolio.cash)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Owned shares</p>
              <p className="mt-1 font-semibold text-white">{ownedShares.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <label className="space-y-2 text-sm text-gray-300">
          <span>Shares</span>
          <input type="number" step="0.01" min="0" value={shares} onChange={(event) => setShares(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
        </label>

        <div className="grid gap-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-400">Trader</p>
            <p className="mt-1 font-medium text-white">{profile.displayName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Estimated total</p>
            <p className="mt-1 font-medium text-white">{formatCurrency(estimatedTotal || 0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Price source</p>
            <p className="mt-1 font-medium text-white">Live simulated quote</p>
          </div>
        </div>

        {message ? (
          <p className={`rounded-lg border px-3 py-2 text-sm ${tradeSuccess ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-red-500/20 bg-red-500/10 text-red-300'}`}>
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-gray-400">Orders use the current simulated price and execute server-side. Client-side totals are previews only.</p>
          <Button type="button" size="lg" onClick={() => setConfirming(true)} disabled={!numericShares || numericShares <= 0}>
            Review order
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Order checklist</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>• Buy orders must fit within your available fake cash.</li>
          <li>• Sell orders cannot exceed the number of shares you own.</li>
          <li>• XP is awarded for completing valid trades and select achievements.</li>
          <li>• Prices are fictional and refreshed by the simulation engine.</li>
        </ul>
      </Card>

      {confirming ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-lg space-y-5">
            <div>
              <h3 className="text-xl font-semibold">Confirm {tradeType} order</h3>
              <p className="mt-1 text-sm text-gray-400">This order will execute at the current server-side simulated price.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Company</p>
                <p className="mt-1 font-medium text-white">{activeCompany.name} ({activeCompany.ticker})</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shares</p>
                <p className="mt-1 font-medium text-white">{numericShares.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Execution price</p>
                <p className="mt-1 font-medium text-white">{formatCurrency(activeCompany.currentPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estimated total</p>
                <p className="mt-1 font-medium text-white">{formatCurrency(estimatedTotal)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant={tradeType === 'sell' ? 'danger' : 'primary'}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await executeTrade(portfolio.id, activeCompany.id, tradeType, numericShares)
                    setMessage(result.message)
                    setTradeSuccess(result.success)
                    setConfirming(false)
                    if (result.success) {
                      router.refresh()
                    }
                  })
                }
              >
                {pending ? 'Executing...' : `Confirm ${tradeType}`}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
