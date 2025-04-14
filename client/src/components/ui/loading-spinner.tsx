'use client'

// import { CircleDot } from 'lucide-react'
import { Logo } from '../../assets/icons/logo' // Tu logo SVG

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col items-center">
        {/* Efecto de sombra pulsante */}
        <div
          className="absolute h-16 w-16 rounded-full"
          style={{
            boxShadow: '0 0 20px 5px rgba(238, 152, 32, 0.5)',
            animation: 'pulse 2s infinite ease-in-out'
          }}
        />

        {/* Logo con animación mejorada */}
        <Logo
          className="h-16 w-16 text-[#EE9820]"
          style={{
            animation: 'logoSpin 3s infinite ease-in-out',
            filter: 'drop-shadow(0 0 8px rgba(238, 152, 32, 0.7))'
          }}
        />

        {/* Texto de cargando con animación */}
        <div className="mt-4 text-sm text-white">Cargando...</div>
      </div>

      {/* Estilos de animación inline */}
      <style>{`
        @keyframes logoSpin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            transform: rotate(180deg) scale(1);
          }
          75% {
            transform: rotate(270deg) scale(0.95);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}
