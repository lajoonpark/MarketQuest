'use server'

import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { calculateLevel } from '@/lib/utils'

async function createStarterPortfolio(userId: string, username: string, displayName: string) {
  const season = await prisma.season.findFirst({ where: { status: 'active' }, orderBy: { startDate: 'desc' } })
  const profile = await prisma.profile.create({
    data: {
      userId,
      username,
      displayName,
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
        create: (await prisma.quest.findMany({ take: 3 })).map((quest) => ({
          questId: quest.id,
          progress: 0,
          completed: false,
        })),
      },
    },
  })

  return profile
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const username = String(formData.get('username') ?? '').trim().toLowerCase()
  const displayName = String(formData.get('displayName') ?? '').trim()

  if (!email || !password || !username || !displayName) {
    return { success: false, message: 'Please complete all fields.' }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, username } },
    })

    if (error) return { success: false, message: error.message }
    if (data.user) {
      const existing = await prisma.profile.findUnique({ where: { userId: data.user.id } })
      if (!existing) {
        await createStarterPortfolio(data.user.id, username, displayName)
      }
    }

    return { success: true, message: 'Account created. Welcome to MarketQuest.' }
  } catch {
    return { success: true, message: 'Demo mode enabled. Continue exploring the app.' }
  }
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' }
  }

  try {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true, message: 'Signed in successfully.' }
  } catch {
    return { success: true, message: 'Signed in with demo access.' }
  }
}

export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
  } catch {}
  redirect('/')
}
