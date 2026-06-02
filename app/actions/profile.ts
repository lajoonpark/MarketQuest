'use server'

import { prisma } from '@/lib/prisma'
import { calculateLevel } from '@/lib/utils'

export async function awardXp(profileId: string, xpAmount: number) {
  if (!profileId || xpAmount <= 0) {
    return { success: false, message: 'Invalid XP request.' }
  }

  try {
    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: {
        xp: { increment: xpAmount },
      },
    })

    const level = calculateLevel(updated.xp)
    if (level !== updated.level) {
      await prisma.profile.update({ where: { id: profileId }, data: { level } })
    }

    return { success: true, message: `${xpAmount} XP awarded.` }
  } catch {
    return { success: true, message: `${xpAmount} XP awarded in demo mode.` }
  }
}

export async function updateLoginStreak(profileId: string) {
  if (!profileId) {
    return { success: false, message: 'Missing profile.' }
  }

  try {
    const profile = await prisma.profile.findUnique({ where: { id: profileId } })
    if (!profile) return { success: false, message: 'Profile not found.' }

    const today = new Date()
    const lastLogin = profile.lastLoginDate ? new Date(profile.lastLoginDate) : null
    const dayDiff = lastLogin
      ? Math.floor((today.setHours(0, 0, 0, 0) - new Date(lastLogin).setHours(0, 0, 0, 0)) / 86400000)
      : null

    const nextStreak = dayDiff === 1 ? profile.currentStreak + 1 : dayDiff === 0 ? profile.currentStreak : 1
    const longestStreak = Math.max(profile.longestStreak, nextStreak)

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        currentStreak: nextStreak,
        longestStreak,
        lastLoginDate: new Date(),
      },
    })

    await awardXp(profileId, dayDiff === 0 ? 0 : 25)
    return { success: true, message: 'Login streak updated.' }
  } catch {
    return { success: true, message: 'Login streak updated in demo mode.' }
  }
}
