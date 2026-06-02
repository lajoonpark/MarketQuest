import { AppLayout } from '@/components/layout/AppLayout'
import { getProfileBundle } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, season } = await getProfileBundle()

  return (
    <AppLayout profile={profile} season={season}>
      {children}
    </AppLayout>
  )
}
