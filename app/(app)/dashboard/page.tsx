import { ArrowUpRight, Briefcase, DollarSign, Flame, Sparkles, Trophy } from 'lucide-react'

import { CompanyCard } from '@/components/market/CompanyCard'
import { NewsCard } from '@/components/news/NewsCard'
import { QuestCard } from '@/components/quests/QuestCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
import { getDashboardData } from '@/lib/data'
import { formatCurrency, formatPercent, xpProgress } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Portfolio Value" value={formatCurrency(data.metrics.portfolioValue)} icon={Briefcase} hint="Cash + live holdings" trend="positive" />
        <StatCard title="Cash Balance" value={formatCurrency(data.portfolio.cash)} icon={DollarSign} hint="Ready for new entries" />
        <StatCard title="Daily Change" value={formatCurrency(data.metrics.dailyChange)} icon={ArrowUpRight} hint={formatPercent((data.metrics.dailyChange / data.metrics.portfolioValue) * 100)} trend={data.metrics.dailyChange >= 0 ? 'positive' : 'negative'} />
        <StatCard title="Season Return" value={formatPercent(data.metrics.seasonReturn)} icon={Sparkles} hint="Since season start" trend={data.metrics.seasonReturn >= 0 ? 'positive' : 'negative'} />
        <StatCard title="Current Rank" value={`#${data.currentRank}`} icon={Trophy} hint="Season leaderboard" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">XP and progression</h2>
              <p className="mt-1 text-sm text-gray-400">Level up through trading, quests, lessons, and streaks.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-200">
              <Flame className="h-4 w-4" /> {data.profile.currentStreak} day streak
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-400">Current level</p>
              <p className="mt-2 text-4xl font-semibold">{data.profile.level}</p>
              <p className="mt-2 text-sm text-gray-400">{data.profile.xp} XP earned</p>
            </div>
            <ProgressBar value={xpProgress(data.profile.xp)} label="Progress to next level" className="self-center" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Holdings summary</h2>
          <div className="mt-4 space-y-3">
            {data.holdings.slice(0, 4).map((holding) => (
              <div key={holding.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-950 p-3">
                <div>
                  <p className="font-medium text-white">{holding.company.ticker}</p>
                  <p className="text-xs text-gray-400">{holding.shares.toFixed(2)} shares · {holding.company.sector}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{formatCurrency(holding.company.currentPrice * holding.shares)}</p>
                  <p className="text-xs text-gray-400">at {formatCurrency(holding.company.currentPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Daily quests</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {data.dailyQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Top movers</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {data.topMovers.slice(0, 4).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Latest news</h2>
          <div className="mt-4 space-y-4">
            {data.latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
