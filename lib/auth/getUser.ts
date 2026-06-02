import { createSupabaseServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null
  return user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const profile = await prisma.profile.findUnique({
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

  return profile
}
