import Link from 'next/link'
import { ArrowRight, BadgeCheck, BookOpen, Trophy } from 'lucide-react'

import { CompanyCard } from '@/components/market/CompanyCard'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { mockCompanies } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Trophy,
    title: 'Season leaderboards',
    description: 'Compete in weekly seasons where every trader starts with the same fictional cash balance.',
  },
  {
    icon: BadgeCheck,
    title: 'Quests, XP, and streaks',
    description: 'Daily missions keep momentum high while levels and achievements reward disciplined play.',
  },
  {
    icon: BookOpen,
    title: 'Learn while you play',
    description: 'Short lessons explain diversification, volatility, and sentiment without slowing the game down.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-grid px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-16">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gray-950/70 px-6 py-10 shadow-glow md:px-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="info">Educational game · fictional companies only</Badge>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-xl font-bold text-indigo-100">MQ</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">MarketQuest</p>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">The ultimate fictional stock market game</h1>
                  </div>
                </div>
                <p className="max-w-2xl text-lg text-gray-300">
                  Build a fake portfolio, react to simulated market news, complete daily quests, and climb the leaderboard in a polished strategy game inspired by trading dashboards.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }))}>
                  Start your season <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/login" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
                  Log in
                </Link>
              </div>
              <p className="text-sm text-gray-400">Educational game - not real financial advice. No live market data, no real money, and no brokerage functionality.</p>
            </div>
            <Card className="grid gap-4 bg-gray-900/80">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                  <p className="text-sm text-gray-400">Starting cash</p>
                  <p className="mt-2 text-3xl font-semibold text-white">$10,000</p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                  <p className="text-sm text-gray-400">Company universe</p>
                  <p className="mt-2 text-3xl font-semibold text-white">30 stocks</p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                  <p className="text-sm text-gray-400">Daily system</p>
                  <p className="mt-2 text-3xl font-semibold text-white">10 quests</p>
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                  <p className="text-sm text-gray-400">Learning track</p>
                  <p className="mt-2 text-3xl font-semibold text-white">6 lessons</p>
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                <p className="text-sm text-indigo-100">How it works</p>
                <ol className="mt-3 space-y-2 text-sm text-indigo-100/80">
                  <li>1. Sign up and join the active weekly season.</li>
                  <li>2. Research fictional companies, news, and sector trends.</li>
                  <li>3. Buy and sell fake shares while earning XP and achievements.</li>
                  <li>4. Climb the leaderboard with smart risk management.</li>
                </ol>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="space-y-4">
              <div className="inline-flex rounded-xl bg-indigo-500/10 p-3">
                <Icon className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-gray-400">{description}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Explore the fictional market</h2>
              <p className="mt-1 text-sm text-gray-400">Every company has a simulated price path, sector identity, and handcrafted logo.</p>
            </div>
            <Link href="/signup" className={cn(buttonVariants({ variant: 'secondary' }))}>
              Create an account
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {mockCompanies.slice(0, 3).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
