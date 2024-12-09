import type { ChangeEvent, FormEvent } from 'react'

import { X } from 'lucide-react'
import { useState } from 'react'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { agregarTipoContrato } from '../../services/tipoContrato/contratoService'

interface AdEDocumentoModalProps {
  isOpen: boolean
  onClose: () => void
  onContratoAdded: () => void
}

export function AddContratoModal({ isOpen, onClose, onContratoAdded }: Readonly<AdEDocumentoModalProps>) {
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSave = (event: FormEvent) => {
    event.preventDefault()

    const saveActividad = async () => {
      if (name.trim() !== '') {
        setIsLoading(true)

        try {
          // Hacemos la solicitud POST al servidor
          await agregarTipoContrato({
            id: '',
            nombre: name
          })

          // Mostrar SweetAlert de éxito usando el nombre directamente
          void Swal.fire({
            title: 'Éxito',
            text: `Contrato guardado con éxito. Nombre: ${name}`, // Usamos el nombre directamente del estado
            icon: 'success',
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false
          })

          onContratoAdded() // Llama a la función para actualizar la lista
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
          <h3 className="text-lg font-semibold">Añadir Contrato</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="nombre">
              Nombre del contrato
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
            <Button disabled={isLoading} type="submit" variant="default">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
