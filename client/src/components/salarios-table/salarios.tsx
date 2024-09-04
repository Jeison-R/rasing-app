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
import { AddSalaryModal } from '../modalAddSalary/AddSalaryModal'

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    valor: 11298,
    año: 1984
  },
  {
    id: '3u1reuv4',
    valor: 13558,
    año: 1985
  },
  {
    id: 'derv1ws0',
    valor: 16811,
    año: 1986
  },
  {
    id: '5kma53ae',
    valor: 20510,
    año: 1987
  },
  {
    id: 'abc123',
    valor: 25637,
    año: 1988
  },
  {
    id: 'def456',
    valor: 32560,
    año: 1989
  },
  {
    id: 'ghi789',
    valor: 41025,
    año: 1990
  },
  {
    id: 'jkl012',
    valor: 51716,
    año: 1991
  },
  {
    id: 'mno345',
    valor: 65190,
    año: 1992
  },
  {
    id: 'pqr678',
    valor: 81510,
    año: 1993
  },
  {
    id: 'stu901',
    valor: 98700,
    año: 1994
  },
  {
    id: 'vwx234',
    valor: 118934,
    año: 1995
  },
  {
    id: 'yz1234',
    valor: 142125,
    año: 1996
  },
  {
    id: 'abc567',
    valor: 172005,
    año: 1997
  },
  {
    id: 'def890',
    valor: 203826,
    año: 1998
  },
  {
    id: 'ghi123',
    valor: 236460,
    año: 1999
  },
  {
    id: 'jkl456',
    valor: 260100,
    año: 2000
  },
  {
    id: 'mno789',
    valor: 286000,
    año: 2001
  },
  {
    id: 'pqr012',
    valor: 309000,
    año: 2002
  },
  {
    id: 'stu345',
    valor: 332000,
    año: 2003
  },
  {
    id: 'vwx678',
    valor: 358000,
    año: 2004
  },
  {
    id: 'yz9012',
    valor: 381500,
    año: 2005
  },
  {
    id: 'abc345',
    valor: 408000,
    año: 2006
  },
  {
    id: 'def678',
    valor: 433700,
    año: 2007
  },
  {
    id: 'ghi901',
    valor: 461500,
    año: 2008
  },
  {
    id: 'jkl234',
    valor: 496900,
    año: 2009
  },
  {
    id: 'mno567',
    valor: 515000,
    año: 2010
  },
  {
    id: 'pqr890',
    valor: 535600,
    año: 2011
  },
  {
    id: 'stu123',
    valor: 566700,
    año: 2012
  },
  {
    id: 'vwx456',
    valor: 589500,
    año: 2013
  },
  {
    id: 'yz7890',
    valor: 616000,
    año: 2014
  },
  {
    id: 'abc901',
    valor: 644350,
    año: 2015
  },
  {
    id: 'def234',
    valor: 689455,
    año: 2016
  },
  {
    id: 'ghi567',
    valor: 737717,
    año: 2017
  },
  {
    id: 'jkl890',
    valor: 781242,
    año: 2018
  },
  {
    id: 'mno123',
    valor: 828116,
    año: 2019
  },
  {
    id: 'pqr456',
    valor: 877803,
    año: 2020
  },
  {
    id: 'stu789',
    valor: 908526,
    año: 2021
  },
  {
    id: 'vwx012',
    valor: 1000000,
    año: 2022
  },
  {
    id: 'yz3456',
    valor: 1160000,
    año: 2023
  },
  {
    id: 'abc789',
    valor: 1300000,
    año: 2024
  }
]

export interface Payment {
  id: string
  año: number
  valor: number
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'año',
    header: ({ column }) => {
      return (
        <Button
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
    cell: ({ row }) => <div className="lowercase">{row.getValue('año')}</div>
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

      return <div className="text-right font-medium">{formatted}</div>
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
        pageSize: 10
      }
    }
  })

  const ultimoSalario = data[data.length - 1]

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between py-4">
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
        <div className="flex w-full justify-center lg:w-96">
          <div className="text-center">
            <h4>Salario Actual</h4>
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(ultimoSalario.valor)} (Año {ultimoSalario.año})
          </div>
        </div>
      </div>

      <AddSalaryModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
