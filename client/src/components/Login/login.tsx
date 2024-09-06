'use client'

import React, { useState } from 'react'

export function Login() {
  const [showForm, setShowForm] = useState(false)

  const handleLoginClick = () => {
    setShowForm(true)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {!showForm ? (
        <>
          <h1 className="mb-6 text-3xl font-bold">Bienvenido Ingeniero</h1>
          <button className="rounded-lg px-6 py-2 text-lg transition" type="button" onClick={handleLoginClick}>
            Loguearse
          </button>
        </>
      ) : (
        <form className="rounded-lg p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Iniciar sesión</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="email">
              Email:
            </label>
            <input required className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2" id="email" name="email" type="email" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="password">
              Contraseña:
            </label>
            <input required className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2" id="password" name="password" type="password" />
          </div>
          <button className="w-full rounded-lg py-2 transition" type="submit">
            Entrar
          </button>
        </form>
      )}
    </div>
  )
}
