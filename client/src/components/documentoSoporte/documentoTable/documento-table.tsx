'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState, type ChangeEvent } from 'react'
import { ChevronLeft, ChevronRight, CirclePlus, Edit, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../../commons/tooltip'
import { AddDocumentoModal } from '../modalAddDocumento/AddDocumentoModal'

import { deleteDocumento } from './deleteDocumento'

export interface Payment {
  id: string
  nombre: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc')
            }}
          >
            ID
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('id')}</div>
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc')
            }}
          >
            Tipo de Documentos
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('nombre')}</div>
  }
]

export function CustomTableDocumento() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<Payment[]>([])

  const fetchDocumentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/tiposDocumentos/obtenerTiposDocumentos') // Cambia esta URL según tu entorno

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`) // Proporciona más información sobre el error
      }

      const documentosData = (await response.json()) as Payment[] // Cambiar 'actividadesData' a 'documentosData' para claridad

      setData(documentosData) // Cambia 'actividadesData' a 'documentosData'
    } catch (error) {
      if (error instanceof Error) {
        global.console.error('Error al obtener documentos:', error.message) // Mensaje de error más específico
      } else {
        global.console.error('Error desconocido al obtener documentos') // Manejo de errores no específico
      }
    }
  }

  // Usar useEffect para cargar los datos al montar el componente
  useEffect(() => {
    void fetchDocumentos() // Llama a la función sin .catch aquí, el manejo de errores está dentro de la función
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: 9
      }
    }
  })

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDocumentoAdded = () => {
    void fetchDocumentos() // Llama a la función para obtener la lista actualizada
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-4">
        <h2 className="mb-2">Tipos de documentos</h2>
        <div className="flex items-center space-x-2">
          <Input
            className="max-w-sm"
            placeholder="Filtrar..."
            value={table.getColumn('email')?.getFilterValue() as string}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('email')?.setFilterValue(event.target.value)}
          />
          <CustomTooltip content="Añadir salario">
            <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
              <CirclePlus className="h-5 w-5" />
            </Button>
          </CustomTooltip>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
        <div className="w-full lg:w-96">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    })}
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                      {/* Renderizar los botones de editar y eliminar aquí */}
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          {/* Botón Editar */}
                          <CustomTooltip content="Editar">
                            <Button size="icon" variant="ghost">
                              <Edit className="h-5 w-5" />
                            </Button>
                          </CustomTooltip>

                          {/* Botón Eliminar */}
                          <CustomTooltip content="Eliminar">
                            <Button size="icon" variant="ghost" onClick={() => void deleteDocumento(row.original.id, row.original.nombre, fetchDocumentos)}>
                              <Trash className="h-5 w-5 text-red-500" />
                            </Button>
                          </CustomTooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={columns.length}>
                      Sin resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {currentPage + 1} de {table.getPageCount()} páginas
            </div>
            <div className="space-x-2">
              <CustomTooltip content="Anterior">
                <Button
                  disabled={!table.getCanPreviousPage()}
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    table.previousPage()
                    setCurrentPage(table.getState().pagination.pageIndex - 1)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </CustomTooltip>
              <CustomTooltip content="Siguiente">
                <Button
                  disabled={!table.getCanNextPage()}
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    table.nextPage()
                    setCurrentPage(table.getState().pagination.pageIndex + 1)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>

      <AddDocumentoModal isOpen={isModalOpen} onClose={handleCloseModal} onDocumentoAdded={handleDocumentoAdded} />
    </>
  )
}
