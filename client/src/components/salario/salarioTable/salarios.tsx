'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState, type ChangeEvent } from 'react'
import { ChevronLeft, ChevronRight, CirclePlus, Edit, Trash } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

import { CustomTooltip } from '../../commons/tooltip'
import { AddSalaryModal } from '../modalAddSalary/AddSalaryModal'
import { obtenerSalarios } from '../../services/salario/salarioService'

import { deleteSalario } from './deleteSalario'

export interface Salario {
  id: string
  año: number
  valor: number
}

export const columns: ColumnDef<Salario>[] = [
  {
    accessorKey: 'año',
    header: ({ column }) => {
      return (
        <Button
          className="justify-center"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Año
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue('año')}</div>
  },
  {
    accessorKey: 'valor',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc')
            }}
          >
            Valor
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('valor'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className="text-center font-medium">{formatted}</div>
    }
  }
]

export function CustomTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<Salario[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener las actividades desde la API
  const fetchSalario = async () => {
    try {
      const SalarioData = await obtenerSalarios() // Usar la función importada

      setData(SalarioData)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        global.console.error('Error al obtener los salarios:', error.message)
      } else {
        global.console.error('Error desconocido al obtener los salarios')
      }
    }
  }

  const ultimoSalario = data.length > 0 ? data.reduce((prev, current) => (prev.año > current.año ? prev : current)) : null

  useEffect(() => {
    void fetchSalario()
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSalariodAdded = () => {
    void fetchSalario()
  }

  const table = useReactTable({
    data: data,
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
        pageSize: 10
      }
    }
  })

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          className="max-w-sm"
          placeholder="Filtrar por año"
          value={table.getColumn('año')?.getFilterValue() as string}
          onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('año')?.setFilterValue(event.target.value)}
        />
        <CustomTooltip content="Añadir salario">
          <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
            <CirclePlus className="h-5 w-5" />
          </Button>
        </CustomTooltip>
      </div>
      <div className="flex flex-col items-start space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
        <div className="w-full lg:w-96">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    })}
                    <TableHead className="justify-center text-center">Acciones</TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loader
                  Array.from({ length: 10 }).map(() => (
                    <TableRow key={uuidv4()}>
                      {Array.from({ length: columns.length + 1 }).map(() => (
                        <TableCell key={uuidv4()}>
                          <Skeleton className="h-8 w-full dark:bg-gray-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
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
                            <Button size="icon" variant="ghost" onClick={() => void deleteSalario(row.original.id, `${row.original.año}`, fetchSalario)}>
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
        <div className="flex w-full justify-center lg:w-96">
          <div className="text-center">
            <h4>Salario Actual</h4>
            {ultimoSalario ? (
              <>
                <p>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(ultimoSalario.valor)}</p>
                <p>(Año {ultimoSalario.año})</p>
              </>
            ) : (
              <p>No hay datos de salario.</p>
            )}
          </div>
        </div>
      </div>

      <AddSalaryModal isOpen={isModalOpen} onClose={handleCloseModal} onSalaryAdded={handleSalariodAdded} />
    </>
  )
}
