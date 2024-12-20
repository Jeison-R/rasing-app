import type { ChangeEvent, FormEvent } from 'react'

import { X } from 'lucide-react'
import { useState } from 'react'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { agregarActividad } from '../../services/actividad/actividadService' // Importa la función aquí

interface AddActividadModalProps {
  isOpen: boolean
  onClose: () => void
  onActividadAdded: () => Promise<void>
}

export function AddActividadModal({ isOpen, onClose, onActividadAdded }: Readonly<AddActividadModalProps>) {
  const [name, setName] = useState<string>('') // Para guardar el nombre de la actividad
  const [isLoading, setIsLoading] = useState<boolean>(false) // Para controlar el estado de carga

  const handleSave = (event: FormEvent) => {
    event.preventDefault()

    const saveActividad = async () => {
      if (name.trim() !== '') {
        setIsLoading(true) // Iniciar la carga

        try {
          // Llamamos a la función `agregarActividad` en lugar de hacer el fetch manualmente
          await agregarActividad({
            nombre: name,
            id: ''
          }) // Enviar solo el nombre de la actividad

          // Mostrar SweetAlert de éxito
          await Swal.fire({
            title: 'Éxito',
            text: `Actividad guardada con éxito. Nombre: ${name}`,
            icon: 'success',
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false
          })

          await onActividadAdded() // Actualizar la lista de actividades
        } catch (error) {
          // Manejar errores de red o cualquier otro error
          await Swal.fire({
            title: 'Error',
            text: `Error de red: ${(error as Error).message}`,
            icon: 'error',
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false
          })
        } finally {
          setIsLoading(false) // Terminar la carga
          setName('') // Limpiar el campo después de guardar
          onClose() // Cerrar el modal
        }
      }
    }

    void saveActividad()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Actividad</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="nombre">
              Nombre de la Actividad
            </label>
            <Input
              required
              className="mt-1"
              name="nombre"
              placeholder="Ingresa el nombre de la actividad"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button disabled={isLoading} type="submit" variant="default">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
