'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Briefcase, FileText, Wallet, FileArchive } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from '@/assets/icons/logo'
import { ROUTES } from '@/consts/routes'

import { RasingCabeDark } from '../../assets/icons/rasing-CabeDark'
import { RasingCabe } from '../../assets/icons/rasing-Cabe'

// Íconos de Lucide

export function MainNav() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  const navItems = [
    {
      href: ROUTES.EXPERIENCES,
      label: 'Experiencias',
      icon: Briefcase
    },
    {
      href: ROUTES.DOCREGULADRES,
      label: 'Documentos Regulares',
      icon: FileText
    },
    {
      href: ROUTES.MINIMUIM_WAGE,
      label: 'Salarios mínimos',
      icon: Wallet
    },
    {
      href: ROUTES.ACTIVIDAD,
      label: 'Act, doc, Con',
      icon: FileArchive
    }
  ]

  return (
    <div className="hidden w-full flex-col justify-between gap-6 py-2 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link className="flex items-center gap-4" href="/">
        <Logo width={40} />
        {isDark ? <RasingCabeDark width={150} /> : <RasingCabe width={150} />}
      </Link>

      <nav className="flex items-center justify-end gap-4 lg:gap-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)

          return (
            <Link
              key={href}
              className={cn('flex items-center gap-2 rounded-md p-2 transition-colors hover:text-foreground/80', isActive ? 'bg-muted text-foreground' : 'text-foreground/60')}
              href={href}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
