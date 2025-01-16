'use client'

import './globals.css'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Inter } from 'next/font/google'
import { deleteCookie } from 'cookies-next'
import { Suspense } from 'react'

import { MainNav } from '@/components/commons/main-nav'
import { NavMobile } from '@/components/commons/nav-mobile'
import { Button } from '@/components/ui/button'
import { CustomTooltip } from '@/components/commons/tooltip'
import ThemeToggle from '@/components/commons/theme-toggle'
import { ROUTES } from '@/consts/routes'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    void deleteCookie('auth_token')
    router.push(ROUTES.LOGIN)
  }

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
          <Toaster />
        </main>
      </body>
    </html>
  )
}
