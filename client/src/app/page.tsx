import type { Metadata } from 'next'

import { Dashboard } from '@/components/home/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard' // Título específico para la página de login
}

export default function Home() {
  return (
    <div className="w-full">
      <Dashboard />
    </div>
  )
}
