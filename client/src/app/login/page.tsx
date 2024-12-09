import type { Metadata } from 'next'

import { Login } from '@/components/loginn/login'

export const metadata: Metadata = {
  title: 'Login' // Título específico para la página de login
}

export default function LoginPage() {
  return (
    <div className="w-full">
      <Login />
    </div>
  )
}
