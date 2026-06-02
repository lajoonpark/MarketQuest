import { Award, Flame, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getProfilePageData } from '@/lib/data'
import { formatCurrency, formatPercent, xpProgress } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const data = await getProfilePageData()

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-2xl font-semibold text-indigo-100">
              {data.profile.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{data.profile.displayName}</h2>
              <p className="text-sm text-gray-400">@{data.profile.username}</p>
            </div>
            <Badge variant="info" className="ml-auto">Level {data.profile.level}</Badge>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
              <span>XP progress</span>
              <span>{data.profile.xp} XP</span>
            </div>
            <ProgressBar value={xpProgress(data.profile.xp)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Flame className="h-4 w-4 text-amber-300" /> Current streak</div>
              <p className="mt-2 text-2xl font-semibold">{data.profile.currentStreak} days</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Trophy className="h-4 w-4 text-indigo-300" /> Longest streak</div>
              <p className="mt-2 text-2xl font-semibold">{data.profile.longestStreak} days</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><Award className="h-4 w-4 text-emerald-300" /> Completed lessons</div>
              <p className="mt-2 text-2xl font-semibold">{data.completedLessons}</p>
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Season stats</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Portfolio value</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(data.metrics.portfolioValue)}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Season return</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">{formatPercent(data.metrics.seasonReturn)}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Open holdings</p>
              <p className="mt-2 text-2xl font-semibold">{data.portfolio.holdings.length}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Closed trades</p>
              <p className="mt-2 text-2xl font-semibold">{data.profitableTrades}</p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Achievements</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.achievements.map((item) => (
            <Card key={item.id} className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-lg font-semibold text-indigo-200">
                {item.achievement.title.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-white">{item.achievement.title}</h4>
                <p className="mt-1 text-sm text-gray-400">{item.achievement.description}</p>
              </div>
              <Badge variant="positive">Unlocked</Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
