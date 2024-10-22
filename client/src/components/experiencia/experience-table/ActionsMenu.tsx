import type { Payment } from './experience-table'

import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

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
  const payment = row.original
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const handleView = (data: Payment) => {
    setSelectedPayment(data)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    await deleteExperience(payment).then((result) => {
      if (result.isConfirmed) {
        onDelete()
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              handleView(payment)
            }}
          >
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onEdit(payment)
            }}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleDelete()}>Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal para ver los detalles del pago */}
      <ViewExperienceModal isOpen={isModalOpen} payment={selectedPayment} onClose={closeModal} />
    </>
  )
}
