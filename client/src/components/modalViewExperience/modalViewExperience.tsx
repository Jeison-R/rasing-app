import type { Payment } from '../experience-table/experience-table'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ViewExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment | null
}

export function ViewExperienceModal({ isOpen, onClose, payment }: ViewExperienceModalProps) {
  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalles</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium">Entidad:</h4>
            <p>{payment.Entidad}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Contrato:</h4>
            <p>{payment.Contrato}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Contratista:</h4>
            <p>{payment.Contratista}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Modalidad:</h4>
            <p>{payment.Modalidad}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Tipo de Contrato:</h4>
            <p>{payment.TipoContrato}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Actividad Principal:</h4>
            <p>{payment.ActividadPrincipal}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fecha de Inicio:</h4>
            <p>{payment.FechaInicio}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fecha de Terminación:</h4>
            <p>{payment.FechaTerminacion}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="default" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
