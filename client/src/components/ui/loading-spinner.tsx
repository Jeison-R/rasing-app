import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  )
}
