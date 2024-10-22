'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState, useEffect, type ChangeEvent } from 'react'
import { ChevronLeft, ChevronRight, CirclePlus, Edit, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../../commons/tooltip'
import { AddActividadModal } from '../modalAddActividad/AddActividadModal'

import { deleteActividad } from './deleteActividad' // Importa la función

export interface Payment {
  id: string
  nombre: string // Asegúrate de que la propiedad coincide con tu API
}

// Define las columnas aquí
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('id')}</div>
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc')
            }}
          >
            Actividad
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('nombre')}</div>
  }
]

export function CustomTableActividad() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<Payment[]>([]) // Cambiar el estado inicial a un array vacío

  // Función para obtener las actividades desde la API
  const fetchActividades = async () => {
    try {
      const response = await fetch('http://localhost:3000/actividades/obtenerActividades')

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const actividadesData = (await response.json()) as Payment[]

      setData(actividadesData)
    } catch (error) {
      if (error instanceof Error) {
        // Imprimir el mensaje de error
        global.console.error('Error al obtener actividades:', error.message)
      } else {
        global.console.error('Error desconocido al obtener actividades')
      }
    }
  }

  useEffect(() => {
    void fetchActividades()
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleActividadAdded = () => {
    void fetchActividades()
  }

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

  return (
    <>
      <div className="flex flex-col items-center justify-center py-4">
        <h1 className="mb-2">Actividad Principal</h1>
        <div className="flex items-center space-x-2">
          <Input
            className="max-w-sm"
            placeholder="Filtrar..."
            value={table.getColumn('actividad')?.getFilterValue() as string}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('actividad')?.setFilterValue(event.target.value)}
          />
          <CustomTooltip content="Añadir actividad">
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
                    {/* Agregar la columna de acciones aquí */}
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
                            <Button size="icon" variant="ghost" onClick={() => void deleteActividad(row.original.id, row.original.nombre, fetchActividades)}>
                              <Trash className="h-5 w-5 text-red-500" />
                            </Button>
                          </CustomTooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={columns.length + 1}>
                      {' '}
                      {/* Incrementar el colspan aquí */}
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

      <AddActividadModal isOpen={isModalOpen} onActividadAdded={handleActividadAdded} onClose={handleCloseModal} />
    </>
  )
}
