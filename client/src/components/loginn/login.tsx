'use client'

import type { FormEvent, ChangeEvent } from 'react'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc' // Icono de Google

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Logo } from '../../assets/icons/logo' // Importamos el componente de Logo

export function Login() {
  // Tipado de los estados del formulario
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // Tipado del evento para el manejo del formulario
  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación, puedes conectarlo a tu API de login.
  }

  // Manejar el inicio de sesión con Google
  const handleGoogleLogin = () => {
    // Aquí deberías agregar la lógica de autenticación con Google.
  }

  // Funciones para manejar los cambios en los inputs (tipadas con ChangeEvent)
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna izquierda: Logo */}
          <div className="flex items-center justify-center bg-gray-100 p-6">
            <Logo className="h-56 w-56" /> {/* Usamos el componente Logo */}
          </div>

          {/* Columna derecha: Formulario */}
          <div className="p-6">
            <CardHeader>
              <CardTitle>Iniciar sesión</CardTitle>
              <CardDescription>Accede a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    required
                    className="mt-2"
                    id="email"
                    placeholder="correo@ejemplo.com"
                    type="email"
                    value={email}
                    onChange={handleEmailChange} // Tipado correctamente
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    required
                    className="mt-2"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange} // Tipado correctamente
                  />
                </div>
                <Button className="w-full" type="submit">
                  Iniciar sesión
                </Button>
              </form>
              <div className="my-4 flex justify-center">
                <p className="text-sm text-muted-foreground">o</p>
              </div>
              <Button className="w-full" variant="outline" onClick={handleGoogleLogin}>
                <FcGoogle className="mr-2 h-5 w-5" />
                Iniciar sesión con Google
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}
