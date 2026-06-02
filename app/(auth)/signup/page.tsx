import Link from 'next/link'

import { AuthForm } from '@/components/auth/AuthForm'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-indigo-300 hover:text-indigo-200">Log in</Link>
        </p>
      </div>
    </main>
  )
}
