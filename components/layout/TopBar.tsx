import { Flame, Trophy } from 'lucide-react'

import { signOut } from '@/app/actions/auth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { ProfileRecord, SeasonRecord } from '@/lib/types'

export function TopBar({
  profile,
  season,
}: {
  profile: ProfileRecord
  season: SeasonRecord
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/80 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-400">Welcome back</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
            <Badge variant="info">{season.name}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Card className="flex items-center gap-3 px-4 py-3">
            <Flame className="h-4 w-4 text-amber-300" />
            <div>
              <p className="text-xs text-gray-400">Streak</p>
              <p className="text-sm font-semibold">{profile.currentStreak} days</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3 px-4 py-3">
            <Trophy className="h-4 w-4 text-indigo-300" />
            <div>
              <p className="text-xs text-gray-400">Level</p>
              <p className="text-sm font-semibold">{profile.level}</p>
            </div>
          </Card>
          <form action={signOut}>
            <Button variant="secondary" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
