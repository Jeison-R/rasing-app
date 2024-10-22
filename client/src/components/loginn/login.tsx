'use client'

import type { FormEvent } from 'react'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación, puedes conectarlo a tu API de login.
    console.log('Email:', email)
    console.log('Password:', password)
  }

  // Manejar el inicio de sesión con Google
  const handleGoogleLogin = () => {
    console.log('Iniciar sesión con Google')
    // Aquí deberías agregar la lógica de autenticación con Google.
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
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
                id="email"
                placeholder="correo@ejemplo.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                required
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
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
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <a className="underline" href="/register">
              Regístrate
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
