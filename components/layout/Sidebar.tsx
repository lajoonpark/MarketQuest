'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, BookOpen, Briefcase, LayoutDashboard, Menu, Newspaper, Trophy, User, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/market', label: 'Market', icon: BarChart3 },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/trade', label: 'Trade', icon: BarChart3 },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/quests', label: 'Quests', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/learn', label: 'Learn', icon: BookOpen },
]

export function Sidebar({
  profile,
}: {
  profile: { displayName: string; level: number }
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const content = (
    <div className="flex h-full flex-col gap-6 rounded-r-2xl border-r border-gray-800 bg-gray-950/95 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg font-bold text-indigo-200">
            MQ
          </div>
          <div>
            <p className="font-semibold text-white">MarketQuest</p>
            <p className="text-xs text-gray-400">Fictional trading league</p>
          </div>
        </Link>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
        <p className="text-sm text-gray-300">{profile.displayName}</p>
        <p className="mt-1 text-lg font-semibold text-white">Level {profile.level}</p>
        <p className="mt-2 text-xs text-indigo-200">Climb the season leaderboard with smart fictional trades.</p>
      </div>

      <nav className="space-y-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-900 hover:text-white',
                active && 'bg-indigo-500/15 text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm font-medium text-emerald-300">Educational game</p>
        <p className="mt-1 text-xs text-emerald-100/80">MarketQuest uses fictional companies and simulated prices. Not real financial advice.</p>
      </div>
    </div>
  )

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3 md:hidden">
        <Link href="/dashboard" className="font-semibold text-white">
          MarketQuest
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <aside className="hidden h-screen w-72 shrink-0 md:block">{content}</aside>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden">
          <div className="h-full w-72">{content}</div>
        </div>
      ) : null}
    </>
  )
}
