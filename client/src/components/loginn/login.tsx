'use client'

import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase/firebase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { Logo } from '../../assets/icons/logo'
import { SonnerProvider } from '../doc-regulares/sonner-provider'

export function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const router = useRouter()
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; vx: number; vy: number; color: string }[]>([])

  // Generate particles for the background
  useEffect(() => {
    const colors = ['#fb923c', '#f97316', '#ea580c', '#fdba74']
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    setParticles(newParticles)

    const updateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          const newX = p.x + p.vx
          const newY = p.y + p.vy

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) p.vx *= -1

          if (newY <= 0 || newY >= window.innerHeight) p.vy *= -1

          return {
            ...p,
            x: newX,
            y: newY
          }
        })
      )
    }

    const intervalId = setInterval(updateParticles, 50)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFormState('submitting')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()

      const response = await fetch('https://servidor-rasing.onrender.com/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })

      const data = (await response.json()) as { token: string; message: string }

      if (response.ok) {
        await setCookie('auth_token', data.token, {
          maxAge: 120 * 120,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        localStorage.setItem('user_email', email)
        setFormState('success')

        // Delay redirect to show success animation
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        setFormState('error')
        toast.error('Error', { description: data.message || 'Los datos son incorrectos' })
      }
    } catch (loginError) {
      setFormState('error')

      if (loginError instanceof Error) {
        toast.error('Error', { description: 'Los datos son incorrectos' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <>
      <SonnerProvider />

      {/* Dynamic background with particles */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light" />
        <svg className="absolute h-full w-full">
          {particles.map((particle) => (
            <circle key={`${particle.x}-${particle.y}-${particle.color}`} cx={particle.x} cy={particle.y} fill={particle.color} fillOpacity={0.2} r={particle.size} />
          ))}
        </svg>
      </div>

      <div className="relative flex h-screen items-center justify-center overflow-hidden p-4">
        {isLoading ? (
          <motion.div animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
            <LoadingSpinner />
          </motion.div>
        ) : null}

        <motion.div animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl" initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          {/* Two-column card with enhanced contrast */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div className="grid md:grid-cols-2">
              {/* Logo Column - Darker background for contrast */}
              <div className="relative bg-slate-900 p-0">
                {/* Animated gradient background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="animate-slow-spin absolute -inset-[10%] opacity-30 blur-3xl">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600" />
                  </div>
                  <div className="absolute inset-0 bg-slate-900/80" />
                </div>

                <div className="relative flex h-full flex-col items-center justify-center p-8 md:p-12">
                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <div className="relative rounded-full bg-gradient-to-br from-orange-400/20 to-amber-600/20 p-8 backdrop-blur-xl">
                      <div className="absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-orange-400 to-amber-600 opacity-30 blur-md" />
                      <Logo className="relative h-32 w-32 drop-shadow-lg" />
                    </div>
                    <motion.h2 animate={{ opacity: 1, y: 0 }} className="mt-8 text-center text-2xl font-bold text-white" initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.4 }}>
                      Bienvenido de nuevo
                    </motion.h2>
                    <motion.p animate={{ opacity: 1, y: 0 }} className="mt-2 text-center text-white/70" initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.5 }}>
                      Me alegra verte otra vez
                    </motion.p>
                  </motion.div>
                </div>
              </div>

              {/* Form Column - Lighter background for contrast */}
              <div className="relative bg-white p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {formState === 'success' ? (
                      <motion.div
                        key="success"
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-6 text-center"
                        exit={{ opacity: 0, scale: 0.8 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      >
                        <motion.div animate={{ scale: 1 }} className="mb-4 rounded-full bg-green-500/20 p-4" initial={{ scale: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                          </svg>
                        </motion.div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">¡Inicio de sesión exitoso!</h3>
                        <p className="text-slate-600">Redirigiendo a la página principal...</p>
                      </motion.div>
                    ) : (
                      <motion.div key="form" animate={{ opacity: 1 }} exit={{ opacity: 0 }} initial={{ opacity: 0 }}>
                        <div className="mb-6">
                          <motion.h1 animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-slate-900" initial={{ opacity: 0, y: 10 }} transition={{ delay: 0.3 }}>
                            Iniciar sesión
                          </motion.h1>
                          <motion.p animate={{ opacity: 1, y: 0 }} className="mt-1 text-slate-600" initial={{ opacity: 0, y: 10 }} transition={{ delay: 0.4 }}>
                            Accede a tu cuenta para continuar
                          </motion.p>
                        </div>

                        <form
                          className="space-y-5"
                          onSubmit={(e) => {
                            void handleLogin(e)
                          }}
                        >
                          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.5 }}>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-900" htmlFor="email">
                                Correo electrónico
                              </Label>
                              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                <Input
                                  required
                                  className="border-none bg-transparent text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/30"
                                  id="email"
                                  placeholder="correo@ejemplo.com"
                                  type="email"
                                  value={email}
                                  onChange={handleEmailChange}
                                />
                              </div>
                            </div>
                          </motion.div>

                          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.6 }}>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-slate-900" htmlFor="password">
                                  Contraseña
                                </Label>
                                <a className="text-xs font-medium text-orange-600 transition-colors hover:text-orange-700" href="/">
                                  ¿Olvidaste tu contraseña?
                                </a>
                              </div>
                              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                <Input
                                  required
                                  className="border-none bg-transparent pr-10 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/30"
                                  id="password"
                                  placeholder="••••••••"
                                  type={showPassword ? 'text' : 'password'}
                                  value={password}
                                  onChange={handlePasswordChange}
                                />
                                <Button
                                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                  className="absolute right-0 top-0 h-full bg-transparent px-3 py-2 hover:bg-slate-50"
                                  size="icon"
                                  type="button"
                                  variant="ghost"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-slate-500 transition-transform hover:scale-110" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-slate-500 transition-transform hover:scale-110" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div animate={{ opacity: 1, y: 0 }} className="pt-2" initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.7 }}>
                            {/* Orange gradient button with blur effect */}
                            <div className="relative">
                              {/* Blurred gradient effect behind button */}
                              <div className="absolute -inset-1 animate-pulse rounded-lg bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 opacity-70 blur-md" />

                              <Button
                                className="relative h-12 w-full overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 font-medium text-white shadow-lg transition-all hover:shadow-xl"
                                disabled={isLoading}
                                type="submit"
                              >
                                <motion.div animate={{ x: 0, opacity: 1 }} className="relative z-10 flex items-center justify-center" initial={{ x: -10, opacity: 0 }} transition={{ delay: 0.8 }}>
                                  <span>Iniciar sesión</span>
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </motion.div>
                                <motion.div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-600 to-orange-500 opacity-0" transition={{ duration: 0.3 }} whileHover={{ opacity: 1 }} />
                              </Button>
                            </div>
                          </motion.div>

                          <motion.div animate={{ opacity: 1 }} className="pt-4 text-center text-sm text-slate-600" initial={{ opacity: 0 }} transition={{ delay: 0.9 }}>
                            ¿No tienes una cuenta?{' '}
                            <a className="font-medium text-orange-600 transition-colors hover:text-orange-700" href="/">
                              Regístrate
                            </a>
                          </motion.div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
