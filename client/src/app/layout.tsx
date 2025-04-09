'use client'
import type { Documento, Folder } from '@/components/doc-regulares/interface'

import './globals.css'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { Suspense, useState, useEffect } from 'react'

import { MainNav } from '@/components/commons/main-nav'
import { NavMobile } from '@/components/commons/nav-mobile'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { NotificationsPanel } from '@/components/panel-notificaciones/notifications-panel'

import { UserNav } from './UserNav'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const [documentos, setDocumentos] = useState<Documento[]>([])

  const [carpetas, setCarpetas] = useState<Folder[]>([])

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
              <UserNav />
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
