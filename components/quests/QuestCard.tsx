'use client'

import { Award, CandlestickChart, Eye, Flame, GraduationCap, Newspaper, PieChart, Search, Target, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { claimQuestReward } from '@/app/actions/quests'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { UserQuestRecord } from '@/lib/types'

const iconMap = {
  Flame,
  CandlestickChart,
  TrendingUp,
  Search,
  Eye,
  PieChart,
  Newspaper,
  GraduationCap,
  Award,
} as const

export function QuestCard({ quest }: { quest: UserQuestRecord }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const progress = (quest.progress / quest.quest.target) * 100
  const Icon = iconMap[quest.quest.icon as keyof typeof iconMap] ?? Target

  return (
    <Card className="flex h-full flex-col space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-3">
            <Icon className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{quest.quest.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{quest.quest.description}</p>
          </div>
        </div>
        <Badge variant={quest.claimedAt ? 'info' : quest.completed ? 'positive' : 'neutral'}>
          {quest.claimedAt ? 'Claimed' : quest.completed ? 'Ready' : 'Active'}
        </Badge>
      </div>

      <ProgressBar value={progress} label={`${quest.progress}/${quest.quest.target}`} />

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-400">Reward: <span className="font-medium text-white">{quest.quest.xpReward} XP</span></p>
        {quest.completed && !quest.claimedAt ? (
          <Button
            className="w-full sm:w-auto"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await claimQuestReward(quest.id)
                router.refresh()
              })
            }
          >
            {pending ? 'Claiming...' : 'Claim reward'}
          </Button>
        ) : (
          <Button variant="secondary" className="w-full sm:w-auto" disabled>
            {quest.claimedAt ? 'Reward claimed' : 'In progress'}
          </Button>
        )}
      </div>
    </Card>
  )
}
