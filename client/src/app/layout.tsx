'use client'
import type { Documento, Folder } from '@/components/doc-regulares/interface'

import './globals.css'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Inter } from 'next/font/google'
import { deleteCookie } from 'cookies-next'
import { Suspense, useState, useEffect } from 'react'

import { MainNav } from '@/components/commons/main-nav'
import { NavMobile } from '@/components/commons/nav-mobile'
import { Button } from '@/components/ui/button'
import { CustomTooltip } from '@/components/commons/tooltip'
import ThemeToggle from '@/components/commons/theme-toggle'
import { ROUTES } from '@/consts/routes'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { NotificationsPanel } from '@/components/panel-notificaciones/notifications-panel'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()
  const [documentos, setDocumentos] = useState<Documento[]>([])

  const [carpetas, setCarpetas] = useState<Folder[]>([])

  const handleLogout = () => {
    void deleteCookie('auth_token')
    router.push(ROUTES.LOGIN)
  }

  // Fetch documents and folders for notifications
  useEffect(() => {
    const fetchData = async () => {
      if (pathname === '/login') return

      try {
        const [documentosResponse, carpetasResponse] = await Promise.all([
          fetch('https://servidor-rasing.onrender.com/documentos/ConsultarDocumentos', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          }),
          fetch('https://servidor-rasing.onrender.com/carpetas/obtenerCarpetas', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          })
        ])

        if (documentosResponse.ok && carpetasResponse.ok) {
          const documentosData = (await documentosResponse.json()) as Documento[]
          const carpetasData = (await carpetasResponse.json()) as Folder[]

          setDocumentos(documentosData)
          setCarpetas(carpetasData)
        }
      } catch (error) {}
    }

    void fetchData()

    // Set up a refresh interval (every 30 minutes)
    const intervalId = setInterval(() => void fetchData(), 30 * 60 * 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [pathname])

  if (pathname === '/login') {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 w-full items-center justify-between gap-4 px-4 md:px-6">
            <MainNav />
            <NavMobile />
            <div className="flex w-fit items-center gap-4">
              {pathname !== '/login' && <NotificationsPanel carpetas={carpetas} documentos={documentos} />}
              <ThemeToggle />
              <CustomTooltip content="Cerrar sesión">
                <Button className="group rounded-full border-input/10 bg-border/10 hover:bg-transparent" size="icon" type="button" variant="outline" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-secondary" strokeWidth={1.5} />
                </Button>
              </CustomTooltip>
            </div>
          </div>
        </header>
        <main className="mx-auto flex min-h-[calc(100vh-4rem-1px)] w-full max-w-[auto] px-4 pt-2">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
      </body>
    </html>
  )
}
