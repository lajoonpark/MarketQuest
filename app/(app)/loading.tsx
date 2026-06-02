import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner label="Syncing your portfolio..." />
    </div>
  )
}
