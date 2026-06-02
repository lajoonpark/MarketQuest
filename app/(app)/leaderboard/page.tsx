import { Crown } from 'lucide-react'

import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getLeaderboardPageData } from '@/lib/data'
import { formatCurrency, formatPercent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const data = await getLeaderboardPageData()

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">{data.season.name}</h2>
            <p className="mt-1 text-sm text-gray-400">Season-based rankings reset weekly so every player starts on equal footing.</p>
          </div>
          {data.userEntry ? <Badge variant="info">Your rank #{data.userEntry.rank}</Badge> : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {data.podium.map((entry, index) => (
          <Card key={entry.id} className={index === 0 ? 'border-amber-500/20 bg-amber-500/5' : ''}>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-950 p-3">
                <Crown className={`h-5 w-5 ${index === 0 ? 'text-amber-300' : 'text-indigo-300'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">#{entry.rank}</p>
                <h3 className="text-lg font-semibold">{entry.profile.displayName}</h3>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-sm text-gray-300">
              <p>Portfolio: {formatCurrency(entry.portfolioValue)}</p>
              <p>Return: <span className="text-emerald-300">{formatPercent(entry.returnPct)}</span></p>
              <p>XP: {entry.profile.xp}</p>
            </div>
          </Card>
        ))}
      </section>

      <LeaderboardTable entries={data.entries} currentProfileId={data.userEntry?.profile.id} />
    </div>
  )
}
