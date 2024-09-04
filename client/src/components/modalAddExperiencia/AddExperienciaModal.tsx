// AddSalaryModal.tsx
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddExperenciaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddExperienciaModal({ isOpen, onClose }: AddExperenciaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">Añadir Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black" htmlFor="año">
              Año
            </label>
            <Input className="mt-1 text-black" name="año" placeholder="Ingresa el año" type="number" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black" htmlFor="valor">
              Valor
            </label>
            <Input className="mt-1 text-black" name="valor" placeholder="Ingresa el valor del salario" type="number" />
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
