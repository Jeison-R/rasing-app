'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState, type ChangeEvent } from 'react'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../commons/tooltip'
import { AddActividadModal } from '../modalAddActividad/AddActividadModal'

export const data: { id: string; tipoContrato: string }[] = [
  { id: '1', tipoContrato: 'ACUEDUCTO' },
  { id: '2', tipoContrato: 'ADECUACION' },
  { id: '3', tipoContrato: 'ALCANTARILLADO' },
  { id: '4', tipoContrato: 'AMBIENTAL' },
  { id: '5', tipoContrato: 'BATERIAS' },
  { id: '6', tipoContrato: 'CAÑO' },
  { id: '7', tipoContrato: 'CERRAMIENTO' },
  { id: '8', tipoContrato: 'CIC' },
  { id: '9', tipoContrato: 'CONSULTORIA' },
  { id: '10', tipoContrato: 'CUBIERTAS' },
  { id: '11', tipoContrato: 'DE' },
  { id: '12', tipoContrato: 'DEPORTIVO' },
  { id: '13', tipoContrato: 'EDIFICACION' },
  { id: '14', tipoContrato: 'EDIFICACIONES' },
  { id: '15', tipoContrato: 'ELECTRICO' },
  { id: '16', tipoContrato: 'EN' },
  { id: '17', tipoContrato: 'ESCENARIO' },
  { id: '18', tipoContrato: 'GAVIONES' },
  { id: '19', tipoContrato: 'INTERVENTORIA' },
  { id: '20', tipoContrato: 'MANTENIMIENTO' },
  { id: '21', tipoContrato: 'METALICA' },
  { id: '22', tipoContrato: 'MOVIMIENTO' },
  { id: '23', tipoContrato: 'PARQUES' },
  { id: '24', tipoContrato: 'PONTONES' },
  { id: '25', tipoContrato: 'POZOS' },
  { id: '26', tipoContrato: 'PUENTE' },
  { id: '27', tipoContrato: 'PUENTES' },
  { id: '28', tipoContrato: 'RELLENOS' },
  { id: '29', tipoContrato: 'SANITARIAS' },
  { id: '30', tipoContrato: 'SUMINISTRO' },
  { id: '31', tipoContrato: 'TANQUE' },
  { id: '32', tipoContrato: 'TANQUES' },
  { id: '33', tipoContrato: 'TIERRAS' },
  { id: '34', tipoContrato: 'UNIDADES' },
  { id: '35', tipoContrato: 'VIAS' }
]

export const tipoContratoOptions = data.map((doc) => ({
  value: doc.tipoContrato,
  label: doc.tipoContrato
}))

export interface Payment {
  id: string
  tipoContrato: string
}

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
    accessorKey: 'tipoContrato',
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc')
            }}
          >
            Tipo Contrato
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('tipoContrato')}</div>
  }
]

export function CustomTableTipoContrato() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  return (
    <>
      <div className="flex flex-col items-center justify-center py-4">
        <h1 className="mb-2">Tipo de Contrato</h1>
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

      <AddActividadModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
