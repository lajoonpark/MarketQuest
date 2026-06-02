import { Crown } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { LeaderboardEntry } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function LeaderboardTable({
  entries,
  currentProfileId,
}: {
  entries: LeaderboardEntry[]
  currentProfileId?: string
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-950/70 text-gray-400">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Trader</th>
              <th className="px-6 py-4">Portfolio Value</th>
              <th className="px-6 py-4">Return</th>
              <th className="px-6 py-4">XP</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isCurrentUser = entry.profile.id === currentProfileId
              return (
                <tr key={entry.id} className={isCurrentUser ? 'bg-indigo-500/10' : 'border-t border-gray-800'}>
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      {entry.rank <= 3 ? <Crown className="h-4 w-4 text-amber-300" /> : null}
                      #{entry.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-semibold text-indigo-200">
                        {entry.profile.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{entry.profile.displayName}</p>
                        <p className="text-xs text-gray-400">@{entry.profile.username}</p>
                      </div>
                      {isCurrentUser ? <Badge variant="info">You</Badge> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{formatCurrency(entry.portfolioValue)}</td>
                  <td className={`px-6 py-4 font-medium ${entry.returnPct >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {formatPercent(entry.returnPct)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{entry.profile.xp}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
