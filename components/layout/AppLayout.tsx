import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import type { ProfileRecord, SeasonRecord } from '@/lib/types'

export function AppLayout({
  children,
  profile,
  season,
}: {
  children: React.ReactNode
  profile: ProfileRecord
  season: SeasonRecord
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white md:flex">
      <Sidebar profile={{ displayName: profile.displayName, level: profile.level }} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar profile={profile} season={season} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
