import type { ChangeEvent, FormEvent } from 'react'

import { X } from 'lucide-react'
import { useState } from 'react'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddExperenciaModalProps {
  isOpen: boolean
  onClose: () => void
  onDocumentoAdded: () => void
}

interface ErrorData {
  error: string
  // Add other properties here if needed
}

export function AddDocumentoModal({ isOpen, onClose, onDocumentoAdded }: Readonly<AddExperenciaModalProps>) {
  const [name, setName] = useState<string>('')

  const handleSave = (event: FormEvent) => {
    event.preventDefault()

    const saveActividad = async () => {
      if (name.trim() !== '') {
        try {
          // Hacemos la solicitud POST al servidor
          const response = await fetch('http://localhost:3000/tiposDocumentos/crearTipoDocumento', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: name }) // Enviamos el nombre de la actividad
          })

          // Mostrar SweetAlert de éxito usando el nombre directamente
          void Swal.fire({
            title: 'Éxito',
            text: `Documento guardado con éxito. Nombre: ${name}`, // Usamos el nombre directamente del estado
            icon: 'success',
            confirmButtonText: 'OK'
          })

          if (response.ok) {
            onDocumentoAdded() // Llama a la función para actualizar la lista
          } else {
            const errorData = (await response.json()) as ErrorData

            // Mostrar SweetAlert de error
            void Swal.fire({
              title: 'Error',
              text: `Error al guardar el documento: ${errorData.error}`,
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        } catch (error) {
          // Manejar errores de red o cualquier otro error
          void Swal.fire({
            title: 'Error',
            text: `Error de red: ${(error as Error).message}`,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }

        setName('') // Limpiar el campo después de guardar
        onClose() // Cerrar el modal
      }
    }

    void saveActividad()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Documento</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="nombre">
              Nombre del documento
            </label>
            <Input
              required
              className="mt-1"
              name="nombre"
              placeholder="Ingresa el nombre del documento"
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value)
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="default">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
