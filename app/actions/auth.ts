'use server'

import { redirect } from 'next/navigation'

import { ensureProfileForUser } from '@/lib/profile'
import { createSupabaseServerClient } from '@/lib/supabase/server'

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
      await ensureProfileForUser({
        ...data.user,
        user_metadata: {
          ...data.user.user_metadata,
          display_name: displayName,
          username,
        },
      })
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
