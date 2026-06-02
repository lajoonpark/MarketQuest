import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { TradeForm } from '@/components/trade/TradeForm'
import { getTradePageData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function TradePage({ searchParams }: { searchParams?: { ticker?: string } }) {
  const data = await getTradePageData(searchParams?.ticker)

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Trade simulator</h2>
            <p className="mt-1 text-sm text-gray-400">Practice execution with live fictional prices and server-side order checks.</p>
          </div>
          <Badge variant="warning">No real assets · no brokerage connectivity</Badge>
        </div>
      </section>
      <TradeForm {...data} />
      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <h3 className="text-lg font-semibold">Before you trade</h3>
        <p className="mt-2 text-sm text-gray-300">Fictional trading still rewards discipline. Review risk rating, diversify across sectors, and keep some cash available for future opportunities.</p>
      </Card>
    </div>
  )
}
