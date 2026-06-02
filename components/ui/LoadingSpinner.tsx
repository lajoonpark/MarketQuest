import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
      {label ? <p className="text-sm text-gray-400">{label}</p> : null}
    </div>
  )
}
