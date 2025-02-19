'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { Logo } from '@/assets/icons/logo'
import { ROUTES } from '@/consts/routes'

import { RasingCabeDark } from '../../assets/icons/rasing-CabeDark'
import { RasingCabe } from '../../assets/icons/rasing-Cabe'

export function MainNav() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    updateTheme() // Verificar tema al montar el componente

    // Escuchar cambios en el tema
    const observer = new MutationObserver(updateTheme)

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
    } // Limpiar el observer al desmontar
  }, [])

  return (
    <div className="hidden w-full flex-col justify-between gap-6 py-2 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link className="flex items-center gap-4" href="/">
        <Logo width={40} />
        {isDark ? <RasingCabeDark width={150} /> : <RasingCabe width={150} />}
      </Link>
      <nav className="flex items-center justify-end gap-4 text-sm lg:gap-6">
        <Link className={cn('transition-colors hover:text-foreground/80', pathname.startsWith(ROUTES.EXPERIENCES) ? 'text-foreground' : 'text-foreground/60')} href={ROUTES.EXPERIENCES}>
          Experiencias
        </Link>
        <Link className={cn('transition-colors hover:text-foreground/80', pathname.startsWith(ROUTES.MINIMUIM_WAGE) ? 'text-foreground' : 'text-foreground/60')} href={ROUTES.MINIMUIM_WAGE}>
          Salarios mínimos
        </Link>
        <Link className={cn('transition-colors hover:text-foreground/80', pathname.startsWith(ROUTES.ACTIVIDAD) ? 'text-foreground' : 'text-foreground/60')} href={ROUTES.ACTIVIDAD}>
          Act, doc, Con
        </Link>
      </nav>
    </div>
  )
}
