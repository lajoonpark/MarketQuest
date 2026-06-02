import { Sparkles } from 'lucide-react'

import { QuestCard } from '@/components/quests/QuestCard'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getQuestsPageData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function QuestsPage() {
  const data = await getQuestsPageData()

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <Sparkles className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Daily quests</h2>
              <p className="text-sm text-gray-400">Finish objectives to bank XP and reinforce smart trading habits.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">XP earned today</p>
              <p className="mt-2 text-3xl font-semibold">{data.xpEarnedToday}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Trader level</p>
              <p className="mt-2 text-3xl font-semibold">{data.profile.level}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-400">Quest status</p>
              <p className="mt-2 text-3xl font-semibold">{data.quests.filter((quest) => quest.completed).length}/{data.quests.length}</p>
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Reward cadence</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>• Login, trade, and research quests encourage daily consistency.</li>
            <li>• Claimed rewards feed directly into your overall XP total.</li>
            <li>• Completing lessons and streak objectives unlocks larger gains.</li>
          </ul>
          <Badge variant="warning">Quest progress resets with new daily assignments</Badge>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {data.quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </section>
    </div>
  )
}
