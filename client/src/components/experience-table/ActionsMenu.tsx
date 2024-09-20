import type { Payment } from './experience-table'

import { useState, useEffect, useRef } from 'react'
import { Eye, Pencil, Trash, MoreVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ViewExperienceModal } from '../modalViewExperience/modalViewExperience'
import { EditExperienceModal } from '../EditExperienceModal/EditExperienceModal'

import { deleteExperience } from './deleteExperience'

interface ActionsMenuProps {
  row: {
    original: Payment
  }
  onDelete: () => void
}

export function ActionsMenu({ row, onDelete }: ActionsMenuProps) {
  const handleDelete = async () => {
    const payment: Payment = row.original

    await deleteExperience(payment).then((result) => {
      if (result.isConfirmed) {
        onDelete() // Llamada para eliminar la fila si se confirma
      }
    })
  }

  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // Estado para el modal de edición
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null) // Para almacenar el pago seleccionado
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleEdit = (data: Payment) => {
    setSelectedPayment(data)
    setIsEditModalOpen(true) // Abre el modal de edición
  }

  const handleView = (data: Payment) => {
    setSelectedPayment(data)
    setIsModalOpen(true) // Abre el modal de visualización
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditModalOpen(false) // Cierra el modal de edición también si está abierto
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  const handleSaveEdit = () => {
    // Aquí puedes manejar la lógica de guardado de los datos editados

    setIsEditModalOpen(false) // Cierra el modal una vez guardado
  }

  return (
    <>
      <div ref={menuRef} className="relative">
        <Button variant="ghost" onClick={toggleMenu}>
          <MoreVertical className="h-5 w-5" />
        </Button>
        {isOpen ? (
          <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                type="button"
                onClick={() => {
                  handleView(row.original)
                  setIsOpen(false)
                }}
              >
                <Eye className="mr-2 inline-block h-4 w-4" />
                Visualizar
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                type="button"
                onClick={() => {
                  handleEdit(row.original)
                  setIsOpen(false)
                }}
              >
                <Pencil className="mr-2 inline-block h-4 w-4" />
                Editar
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                type="button"
                onClick={() => {
                  void handleDelete()
                }}
              >
                <Trash className="mr-2 inline-block h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Modal para ver los detalles del pago */}
      <ViewExperienceModal isOpen={isModalOpen} payment={selectedPayment} onClose={closeModal} />

      {/* Modal para editar el pago */}
      <EditExperienceModal
        isOpen={isEditModalOpen}
        payment={selectedPayment}
        onClose={closeModal}
        onSave={handleSaveEdit} // Función para manejar el guardado de datos editados
      />
    </>
  )
}
