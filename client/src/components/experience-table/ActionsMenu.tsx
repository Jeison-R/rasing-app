'use client'

import { useState } from 'react'
import { Eye, Pencil, Trash, MoreVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ActionsMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleEdit = () => {
    // Lógica para editar el registro
  }

  const handleDelete = () => {
    // Lógica para eliminar el registro
  }

  const handleView = () => {
    // Lógica para ver el registro
  }

  return (
    <div className="relative">
      <Button variant="ghost" onClick={toggleMenu}>
        <MoreVertical className="h-5 w-5" />
      </Button>
      {isOpen ? (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              type="button"
              onClick={() => {
                handleView()
                setIsOpen(false)
              }}
            >
              <Eye className="mr-2 inline-block h-4 w-4" />
              View
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              type="button"
              onClick={() => {
                handleEdit()
                setIsOpen(false)
              }}
            >
              <Pencil className="mr-2 inline-block h-4 w-4" />
              Edit
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              type="button"
              onClick={() => {
                handleDelete()
                setIsOpen(false)
              }}
            >
              <Trash className="mr-2 inline-block h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
