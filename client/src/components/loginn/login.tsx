'use client'

import type { ChangeEvent } from 'react'
import type { FormEvent } from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Importar useRouter
import { signInWithEmailAndPassword } from 'firebase/auth'
import Swal from 'sweetalert2' // Importar SweetAlert2

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { auth } from '@/firebase/firebase'

import { Logo } from '../../assets/icons/logo'

export function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter() // Inicializar router

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      })

      const data = (await response.json()) as { token: string; message: string }

      if (response.ok) {
        localStorage.setItem('jwtToken', data.token)
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso.'
        })
        setTimeout(() => {
          router.push('/experiencias')
        }, 500) // Redirigir a /experiencias
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Los datos son incorrectos.'
        })
      }
    } catch (loginError) {
      if (loginError instanceof Error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Los datos son incorrectos'
        })
      }
    } finally {
      return // Add this line to return void
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden">
      <Card className="w-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex items-center justify-center bg-gray-100 p-6">
            <Logo className="h-56 w-56" />
          </div>
          <div className="p-6">
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>Accede a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input required className="mt-2" id="email" placeholder="correo@ejemplo.com" type="email" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input required className="mt-2" id="password" placeholder="••••••••" type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <Button className="w-full" type="submit">
                  Iniciar sesión
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}
