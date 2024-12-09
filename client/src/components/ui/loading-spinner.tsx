// import { CircleDot } from 'lucide-react'
import { Logo } from '../../assets/icons/logo' // Tu logo SVG

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Logo className="h-16 w-16 animate-spin text-[#EE9820]" />
    </div>
  )
}
