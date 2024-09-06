'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CustomTooltip } from '@/components/commons/tooltip'

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme('light')
    }
  }, [])

  const applyTheme = (selectedTheme: 'light' | 'dark') => {
    if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  return (
    <div className="relative">
      <CustomTooltip content={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}>
        <Button className="group rounded-full border-input/10 bg-border/10 hover:bg-transparent" size="icon" type="button" variant="outline" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Sun className="h-5 w-5 text-muted-foreground group-hover:text-secondary" strokeWidth={1.5} />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground group-hover:text-secondary" strokeWidth={1.5} />
          )}
        </Button>
      </CustomTooltip>
    </div>
  )
}

export default ThemeToggle
