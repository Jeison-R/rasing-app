'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../commons/tooltip'
import { AddExperienciaModal } from '../modalAddExperiencia/AddExperienciaModal'

import { ActionsMenu } from './ActionsMenu'

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    Entidad: 'Ministerio de Salud',
    Contrato: '1234',
    Contratista: 'Salud Vida SAS',
    Modalidad: 'Licitación Pública',
    TipoContrato: 'Prestación de Servicios',
    ActividadPrincipal: 'Suministro de medicamentos',
    FechaInicio: '2023-01-15',
    FechaTerminacion: '2023-12-31'
  },
  {
    id: '3u1reuv4',
    Entidad: 'Gobernación de Cundinamarca',
    Contrato: '2345',
    Contratista: 'Construcciones Cundinamarca',
    Modalidad: 'Concurso de Méritos',
    TipoContrato: 'Obra Pública',
    ActividadPrincipal: 'Construcción de hospital',
    FechaInicio: '2022-06-10',
    FechaTerminacion: '2024-06-10'
  },
  {
    id: 'derv1ws0',
    Entidad: 'Alcaldía de Bogotá',
    Contrato: '3456',
    Contratista: 'Tecnologías Modernas',
    Modalidad: 'Contratación Directa',
    TipoContrato: 'Suministro',
    ActividadPrincipal: 'Suministro de equipos de cómputo',
    FechaInicio: '2023-03-01',
    FechaTerminacion: '2023-12-01'
  },
  {
    id: 'plow56tf',
    Entidad: 'Ministerio de Transporte',
    Contrato: '4567',
    Contratista: 'Transporte Nacional SAS',
    Modalidad: 'Licitación Pública',
    TipoContrato: 'Obra Pública',
    ActividadPrincipal: 'Construcción de carretera',
    FechaInicio: '2022-09-01',
    FechaTerminacion: '2025-09-01'
  },
  {
    id: 'qwerty98',
    Entidad: 'Gobernación del Valle',
    Contrato: '5678',
    Contratista: 'Agua Limpia SAS',
    Modalidad: 'Concurso de Méritos',
    TipoContrato: 'Consultoría',
    ActividadPrincipal: 'Estudios para acueducto',
    FechaInicio: '2023-02-15',
    FechaTerminacion: '2024-02-15'
  },
  {
    id: 'jkf78m9l',
    Entidad: 'Alcaldía de Medellín',
    Contrato: '6789',
    Contratista: 'Desarrollo Urbano Ltda',
    Modalidad: 'Licitación Pública',
    TipoContrato: 'Obra Pública',
    ActividadPrincipal: 'Construcción de parque',
    FechaInicio: '2022-11-01',
    FechaTerminacion: '2024-11-01'
  },
  {
    id: 'vpo8l2kn',
    Entidad: 'Secretaría de Educación',
    Contrato: '7890',
    Contratista: 'Educación Futuro SAS',
    Modalidad: 'Contratación Directa',
    TipoContrato: 'Prestación de Servicios',
    ActividadPrincipal: 'Capacitación de docentes',
    FechaInicio: '2023-05-10',
    FechaTerminacion: '2024-05-10'
  },
  {
    id: 'loi9f2d3',
    Entidad: 'Ministerio de Agricultura',
    Contrato: '8901',
    Contratista: 'AgroProductivo SAS',
    Modalidad: 'Licitación Pública',
    TipoContrato: 'Suministro',
    ActividadPrincipal: 'Suministro de insumos agrícolas',
    FechaInicio: '2023-04-01',
    FechaTerminacion: '2023-12-31'
  },
  {
    id: 'xz8p7vqr',
    Entidad: 'Alcaldía de Cali',
    Contrato: '9012',
    Contratista: 'Urbanismo Cali SAS',
    Modalidad: 'Concurso de Méritos',
    TipoContrato: 'Obra Pública',
    ActividadPrincipal: 'Mejoramiento de vías urbanas',
    FechaInicio: '2023-06-01',
    FechaTerminacion: '2024-06-01'
  },
  {
    id: 'mnbv3rty',
    Entidad: 'Gobernación de Antioquia',
    Contrato: '0123',
    Contratista: 'Infraestructura Antioquia',
    Modalidad: 'Contratación Directa',
    TipoContrato: 'Consultoría',
    ActividadPrincipal: 'Estudios para puentes',
    FechaInicio: '2023-08-01',
    FechaTerminacion: '2024-08-01'
  }
]

export interface Payment {
  id: string
  Entidad: string
  Contrato: string
  Contratista: string
  Modalidad: string
  TipoContrato: string
  ActividadPrincipal: string
  FechaInicio: string
  FechaTerminacion: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'Contrato',
    header: 'Contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Contrato')}</div>
  },
  {
    accessorKey: 'Entidad',
    header: 'Contratante',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Entidad')}</div>
  },
  {
    accessorKey: 'Contratista',
    header: 'Contratista',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Contratista')}</div>
  },
  {
    accessorKey: 'Modalidad',
    header: 'Modalidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Modalidad')}</div>
  },
  {
    accessorKey: 'TipoContrato',
    header: 'Tipo de contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('TipoContrato')}</div>
  },
  {
    accessorKey: 'ActividadPrincipal',
    header: 'Actividad Principal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('ActividadPrincipal')}</div>
  },
  {
    accessorKey: 'FechaInicio',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Fecha Inicio
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('FechaInicio')}</div>
  },
  {
    accessorKey: 'FechaTerminacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Fecha fin
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('FechaTerminacion')}</div>
  },
  {
    accessorKey: 'actions',
    header: 'Acciones',
    cell: ({ row }) => <ActionsMenu row={row} />
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
        <CustomTooltip content="Añadir experiencia">
          <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
            <CirclePlus className="h-5 w-5" />
          </Button>
        </CustomTooltip>
      </div>
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
      <AddExperienciaModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
