'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { signIn, signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <Card className="w-full max-w-md space-y-6 border-gray-800 bg-gray-900/90 shadow-glow">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 font-bold text-indigo-200">
          MQ
        </div>
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create your MarketQuest account'}</h1>
        <p className="text-sm text-gray-400">
          {mode === 'login'
            ? 'Jump back into the fictional market and keep your streak going.'
            : 'Start with $10,000 fake cash and climb the weekly leaderboard.'}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          setError(null)
          setMessage(null)
          const formData = new FormData(event.currentTarget)
          startTransition(async () => {
            const result = mode === 'login' ? await signIn(formData) : await signUp(formData)
            if (!result.success) {
              setError(result.message)
              return
            }
            setMessage(result.message)
            router.push('/dashboard')
            router.refresh()
          })
        }}
      >
        {mode === 'signup' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-300">
              <span>Display name</span>
              <input name="displayName" required className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
            </label>
            <label className="space-y-2 text-sm text-gray-300">
              <span>Username</span>
              <input name="username" required className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
            </label>
          </div>
        ) : null}
        <label className="space-y-2 text-sm text-gray-300">
          <span>Email</span>
          <input name="email" type="email" required className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
        </label>
        <label className="space-y-2 text-sm text-gray-300">
          <span>Password</span>
          <input name="password" type="password" minLength={6} required className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white outline-none focus:border-indigo-500" />
        </label>
        {error ? <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
        {message ? <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
        <Button className="w-full" size="lg" disabled={pending}>
          {pending ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-400">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <Link href={mode === 'login' ? '/signup' : '/login'} className="text-indigo-300 hover:text-indigo-200">
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </Link>
      </p>
    </Card>
  )
}
