'use client'
import Link from 'next/link'
import { useState } from 'react'

import { ROUTES } from '@/consts/routes'
import { Logo } from '@/assets/icons/logo'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

export function NavMobile() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="shrink-0 bg-transparent text-muted-foreground md:hidden" size="icon" variant="secondary">
          <svg className="h-5 w-5" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M3 12H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M3 19H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent className="border-r border-border/10" side="left">
        <ScrollArea className="h-full w-full overflow-auto [&_.bg-border]:bg-border/10">
          <nav className="grid gap-8 !pl-4 text-lg font-medium">
            <section className="flex flex-col gap-2 text-base text-white">
              <Link
                className="mb-4 flex items-center gap-2 text-lg font-semibold"
                href={ROUTES.EXPERIENCES}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                <Logo width={50} />
                <span className="text-2xl font-bold">Rasing S.A.S</span>
              </Link>
              <Link
                className="text-black dark:text-white"
                href={ROUTES.EXPERIENCES}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Experiencias
              </Link>
              <Link
                className="text-black dark:text-white"
                href={ROUTES.DOCREGULADRES}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Documento Regulares
              </Link>
              <Link
                className="text-black dark:text-white"
                href={ROUTES.MINIMUIM_WAGE}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Salarios mínimos
              </Link>{' '}
              <Link
                className="text-black dark:text-white"
                href={ROUTES.ACTIVIDAD}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Act, doc, Con
              </Link>
            </section>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
