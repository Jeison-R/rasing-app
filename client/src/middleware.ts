import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Lista de rutas protegidas
  const protectedRoutes = ['/dashboard', '/experiencias', '/salarios-minimos', '/actividad-documentos']

  // Verifica si la ruta actual está en la lista de rutas protegidas
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    // Si es una ruta protegida y no hay token, redirige al login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si no es una ruta protegida o hay un token, permite el acceso
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
