'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Logo } from '@/assets/icons/logo'
import { ROUTES } from '@/consts/routes'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="hidden w-full flex-col justify-between gap-6 py-2 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link className="flex items-center gap-4" href="/">
        <Logo width={40} />
        <span className="text-xl font-bold">Rasing S.A.S</span>
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
