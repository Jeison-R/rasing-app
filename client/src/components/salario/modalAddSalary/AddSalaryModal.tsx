import type { ChangeEvent, FormEvent } from 'react'

import { X } from 'lucide-react'
import { useState } from 'react'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { agregarSalario } from '../../services/salario/salarioService' // Importa la función aquí

interface AddSalaryModalProps {
  isOpen: boolean
  onClose: () => void
  onSalaryAdded: () => void // Callback para manejar la lógica después de agregar un salario
}

export function AddSalaryModal({ isOpen, onClose, onSalaryAdded }: Readonly<AddSalaryModalProps>) {
  const [year, setYear] = useState<number | ''>('') // Para guardar el año
  const [value, setValue] = useState<number | ''>('') // Para guardar el valor del salario
  const [isLoading, setIsLoading] = useState<boolean>(false) // Para controlar el estado de carga

  const handleSave = (event: FormEvent) => {
    event.preventDefault()

    const saveSalary = async () => {
      if (year !== '' && value !== '') {
        setIsLoading(true) // Iniciar la carga

        try {
          // Llamamos a la función `agregarSalario` en lugar de hacer el fetch manualmente
          await agregarSalario({
            id: '',
            año: year,
            valor: value
          }) // Enviar el año y el valor

          // Mostrar SweetAlert de éxito
          await Swal.fire({
            title: 'Éxito',
            text: `Salario guardado con éxito. Año: ${year}, Valor: ${value}`,
            icon: 'success',
            confirmButtonText: 'OK'
          })

          onSalaryAdded() // Actualizar la lista de salarios
        } catch (error) {
          // Manejar errores de red o cualquier otro error
          await Swal.fire({
            title: 'Error',
            text: `Error de red: ${(error as Error).message}`,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        } finally {
          setIsLoading(false) // Terminar la carga
          setYear('') // Limpiar el campo de año
          setValue('') // Limpiar el campo de valor
          onClose() // Cerrar el modal
        }
      } else {
        await Swal.fire({
          title: 'Error',
          text: 'Por favor, completa todos los campos.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    }

    void saveSalary()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Salario</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="año">
              Año
            </label>
            <Input
              required
              className="mt-1"
              name="año"
              placeholder="Ingresa el año"
              type="number"
              value={year}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setYear(Number(e.target.value))
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium" htmlFor="valor">
              Valor
            </label>
            <Input
              required
              className="mt-1"
              name="valor"
              placeholder="Ingresa el valor del salario"
              type="number"
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValue(Number(e.target.value))
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
