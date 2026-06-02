import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { MiniSparkline } from '@/components/market/MiniSparkline'
import type { CompanyRecord } from '@/lib/types'
import { formatCurrency, formatPercent, getPriceChangePercent } from '@/lib/utils'

export function CompanyCard({ company }: { company: CompanyRecord }) {
  const change = getPriceChangePercent(company.currentPrice, company.previousPrice)
  const positive = change >= 0

  return (
    <Card className="group overflow-hidden p-0">
      <Link href={`/company/${company.ticker}`} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 shrink-0"
              dangerouslySetInnerHTML={{ __html: company.logoSvg }}
            />
            <div>
              <h3 className="font-semibold text-white group-hover:text-indigo-200">{company.name}</h3>
              <p className="text-sm text-gray-400">{company.ticker} · {company.sector}</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-indigo-300" />
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold">{formatCurrency(company.currentPrice)}</p>
            <Badge variant={positive ? 'positive' : 'negative'} className="mt-2">
              {formatPercent(change)}
            </Badge>
          </div>
          <MiniSparkline data={company.priceHistory} positive={positive} />
        </div>
        <p className="mt-4 line-clamp-2 text-sm text-gray-400">{company.description}</p>
      </Link>
    </Card>
  )
}
