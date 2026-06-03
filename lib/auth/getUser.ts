import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ensureProfileForUser } from '@/lib/profile'

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

  return ensureProfileForUser(user)
}
