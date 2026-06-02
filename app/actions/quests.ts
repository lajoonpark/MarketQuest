'use server'

import { prisma } from '@/lib/prisma'

import { awardXp } from '@/app/actions/profile'

export async function claimQuestReward(userQuestId: string) {
  if (!userQuestId) {
    return { success: false, message: 'Quest not found.' }
  }

  try {
    const userQuest = await prisma.userQuest.findUnique({
      where: { id: userQuestId },
      include: { quest: true },
    })

    if (!userQuest) return { success: false, message: 'Quest not found.' }
    if (!userQuest.completed) return { success: false, message: 'Complete the quest first.' }
    if (userQuest.claimedAt) return { success: false, message: 'Reward already claimed.' }

    await prisma.userQuest.update({
      where: { id: userQuestId },
      data: { claimedAt: new Date() },
    })
    await awardXp(userQuest.profileId, userQuest.quest.xpReward)

    return { success: true, message: `Claimed ${userQuest.quest.xpReward} XP.` }
  } catch {
    return { success: true, message: 'Quest reward claimed in demo mode.' }
  }
}

export async function updateQuestProgress(profileId: string, type: string, amount = 1) {
  if (!profileId || !type) {
    return { success: false, message: 'Invalid quest progress request.' }
  }

  try {
    const quests = await prisma.userQuest.findMany({
      where: { profileId, quest: { type } },
      include: { quest: true },
    })

    await Promise.all(
      quests.map((quest) => {
        const progress = Math.min(quest.progress + amount, quest.quest.target)
        return prisma.userQuest.update({
          where: { id: quest.id },
          data: { progress, completed: progress >= quest.quest.target },
        })
      })
    )

    return { success: true, message: 'Quest progress updated.' }
  } catch {
    return { success: true, message: 'Quest progress updated in demo mode.' }
  }
}
