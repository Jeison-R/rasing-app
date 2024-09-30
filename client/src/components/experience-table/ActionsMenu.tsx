import type { Payment } from './experience-table'

import { useState, useEffect, useRef } from 'react'
import { Eye, Pencil, Trash, MoreVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ViewExperienceModal } from '../modalViewExperience/modalViewExperience'

import { deleteExperience } from './deleteExperience'

interface ActionsMenuProps {
  row: {
    original: Payment
  }
  onDelete: () => void
  onEdit: (data: Payment) => void
}

export function ActionsMenu({ row, onDelete, onEdit }: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleDelete = async () => {
    const payment: Payment = row.original

    await deleteExperience(payment).then((result) => {
      if (result.isConfirmed) {
        onDelete()
      }
    })
  }

  const handleView = (data: Payment) => {
    setSelectedPayment(data)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
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
                  onEdit(row.original) // Pasar el pago al componente padre
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
    </>
  )
}
