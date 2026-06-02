import Link from 'next/link'

import { AuthForm } from '@/components/auth/AuthForm'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-gray-400">
          New here? <Link href="/signup" className="text-indigo-300 hover:text-indigo-200">Create an account</Link>
        </p>
      </div>
    </main>
  )
}
