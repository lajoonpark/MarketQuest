import { BookOpenCheck } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { getLearnPageData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function LearnPage() {
  const data = await getLearnPageData()
  const completed = new Set(data.completedLessons.map((lesson) => lesson.lessonId))

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-500/10 p-3">
            <BookOpenCheck className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Learning hub</h2>
            <p className="mt-1 text-sm text-gray-400">Short lessons reward XP and help turn market intuition into repeatable strategy.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {data.lessons.map((lesson) => {
          const isComplete = completed.has(lesson.id)
          return (
            <Card key={lesson.id} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Lesson {lesson.orderIndex}</p>
                  <h3 className="mt-1 text-xl font-semibold">{lesson.title}</h3>
                </div>
                <Badge variant={isComplete ? 'positive' : 'info'}>{isComplete ? 'Completed' : `${lesson.xpReward} XP`}</Badge>
              </div>
              <p className="text-sm leading-6 text-gray-400">{lesson.content}</p>
            </Card>
          )
        })}
      </section>
    </div>
  )
}
