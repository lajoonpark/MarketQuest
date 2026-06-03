import type { User } from '@supabase/supabase-js'

import { prisma } from '@/lib/prisma'
import { calculateLevel } from '@/lib/utils'

type AuthUser = Pick<User, 'id' | 'email' | 'user_metadata'>

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18)
}

function toTitleCase(value: string) {
  const words = value
    .trim()
    .replace(/[._-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)

  if (!words.length) return 'MarketQuest Trader'

  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

export function getUserIdentity(user: AuthUser) {
  const metadata = user.user_metadata ?? {}
  const metadataDisplayName =
    typeof metadata.display_name === 'string'
      ? metadata.display_name
      : typeof metadata.full_name === 'string'
        ? metadata.full_name
        : ''
  const metadataUsername =
    typeof metadata.username === 'string' ? metadata.username : ''
  const emailPrefix = user.email?.split('@')[0] ?? ''
  const avatarUrl =
    typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null

  const username =
    normalizeUsername(metadataUsername || metadataDisplayName || emailPrefix) ||
    `trader${user.id.replace(/-/g, '').slice(0, 6)}`
  const displayName = toTitleCase(
    metadataDisplayName || metadataUsername || emailPrefix
  )

  return { username, displayName, avatarUrl }
}

async function getAvailableUsername(baseUsername: string, userId: string) {
  const exactMatch = await prisma.profile.findUnique({
    where: { username: baseUsername },
    select: { id: true },
  })
  if (!exactMatch) return baseUsername

  const suffix = userId.replace(/-/g, '').slice(0, 6)
  const fallback = normalizeUsername(`${baseUsername}${suffix}`) || `trader${suffix}`
  const fallbackMatch = await prisma.profile.findUnique({
    where: { username: fallback },
    select: { id: true },
  })

  if (!fallbackMatch) return fallback

  for (let index = 1; index <= 9; index += 1) {
    const candidate =
      normalizeUsername(`${baseUsername}${suffix}${index}`) ||
      `trader${suffix}${index}`
    const candidateMatch = await prisma.profile.findUnique({
      where: { username: candidate },
      select: { id: true },
    })

    if (!candidateMatch) return candidate
  }

  return `trader${suffix}`
}

export async function ensureProfileForUser(user: AuthUser) {
  const existing = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: {
      portfolios: {
        include: {
          season: true,
          holdings: { include: { company: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (existing) return existing

  const { username: baseUsername, displayName, avatarUrl } = getUserIdentity(user)
  const username = await getAvailableUsername(baseUsername, user.id)
  const season = await prisma.season.findFirst({
    where: { status: 'active' },
    orderBy: { startDate: 'desc' },
  })
  const quests = await prisma.quest.findMany({
    orderBy: { id: 'asc' },
    take: 3,
  })

  return prisma.profile.create({
    data: {
      userId: user.id,
      username,
      displayName,
      avatarUrl,
      xp: 0,
      level: calculateLevel(0),
      portfolios: season
        ? {
            create: {
              seasonId: season.id,
              cash: season.startingCash,
            },
          }
        : undefined,
      userQuests: {
        create: quests.map((quest) => ({
          questId: quest.id,
          progress: 0,
          completed: false,
        })),
      },
    },
    include: {
      portfolios: {
        include: {
          season: true,
          holdings: { include: { company: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })
}
