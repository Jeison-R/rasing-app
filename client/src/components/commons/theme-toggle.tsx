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
        <Button className="h-8 w-8 rounded-full" size="icon" variant="ghost" onClick={toggleTheme}>
          {theme === 'light' ? <Sun className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /> : <Moon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />}
        </Button>
      </CustomTooltip>
    </div>
  )
}

export default ThemeToggle
