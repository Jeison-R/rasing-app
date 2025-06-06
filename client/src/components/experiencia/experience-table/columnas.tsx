import type { ColumnDef } from '@tanstack/react-table'
import type { Experiencia } from './interface'
import type { CheckedState } from '@radix-ui/react-checkbox'
import type { Contrato } from '@/components/tipoContrato/tipoContratoTable/tipoContrato-table'
import type { Actividad } from '@/components/actividad/actividadTable/actividad-table'

import { CaretSortIcon } from '@radix-ui/react-icons'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<Experiencia>[] = [
  {
    id: 'select',
    cell: ({ row }) => (
      <Checkbox
        aria-label="Seleccionar fila"
        checked={row.getIsSelected()}
        onCheckedChange={(checked: CheckedState) => {
          row.toggleSelected(!!checked)
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'Empresa',
    header: 'Empresa',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Empresa')}</div>
  },
  {
    accessorKey: 'rup',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Rup
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('rup')}</div>
  },
  {
    accessorKey: 'entidad',
    header: 'Entidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('entidad')}</div>
  },
  {
    accessorKey: 'contrato',
    header: 'Contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('contrato')}</div>
  },
  {
    accessorKey: 'socio',
    header: 'Socio',
    cell: ({ row }) => <div className="capitalize">{row.getValue('socio')}</div>
  },
  {
    accessorKey: 'contratista',
    header: 'Contratista',
    cell: ({ row }) => <div className="capitalize">{row.getValue('contratista')}</div>
  },
  {
    accessorKey: 'modalidad',
    header: 'Modalidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('modalidad')}</div>
  },
  {
    accessorKey: 'tipoContrato',
    header: 'Tipo de Contrato',
    cell: ({ row }) => {
      const tiposContrato: Contrato[] = row.getValue('tipoContrato')

      return (
        <div>
          {tiposContrato.map((tipo, index) => (
            <span key={tipo.id} className="mr-2">
              {tipo.nombre}
              {index < tiposContrato.length - 1 && ', '}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, filterValue: string[]) => {
      const tiposContrato: Contrato[] = row.getValue(id)

      return filterValue.length === 0 || filterValue.some((filter: string) => tiposContrato.some((tipo: Contrato) => tipo.nombre === filter))
    }
  },
  {
    accessorKey: 'actividadPrincipal',
    header: 'Actividad Principal',
    cell: ({ row }) => {
      const actividad: Actividad[] = row.getValue('actividadPrincipal')

      return (
        <div>
          {actividad.map((tipo, index) => (
            <span key={tipo.id} className="mr-2">
              {tipo.nombre}
              {index < actividad.length - 1 && ', '}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, filterValue: string[]) => {
      const actividad: Actividad[] = row.getValue(id)

      return filterValue.length === 0 || filterValue.some((filter: string) => actividad.some((tipo: Actividad) => tipo.nombre === filter))
    }
  },
  {
    accessorKey: 'valorSmmlvPart2',
    header: 'Valor en SMMLV*%PART2',
    cell: ({ row }) => {
      const value = row.getValue('valorSmmlvPart2')
      const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(typeof value === 'number' ? value : parseFloat(value as string))
      const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

      return <div className="capitalize">{formattedWithoutSymbol}</div>
    }
  },
  {
    accessorKey: 'valorSmmlv',
    header: 'Valor en SMMLV',
    cell: ({ row }) => {
      const value = row.getValue('valorSmmlv')
      const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(typeof value === 'number' ? value : parseFloat(value as string))
      const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

      return <div className="capitalize">{formattedWithoutSymbol}</div>
    }
  },
  {
    accessorKey: 'valorNumerico',
    header: 'Valor Numérico',
    cell: ({ row }) => {
      const informacion = row.original.informacion || []
      const numericInfo = informacion.filter((item) => item.type === 'numeric')

      return (
        <div className="min-w-[100px] whitespace-normal text-center">
          {numericInfo.map((item, index) => (
            <div key={item.id} className="text-sm">
              {index > 0 && <hr className="my-1 border-gray-200" />}
              <span className="font-medium">{item.label}:</span> {item.calculatedValue} {item.unit}
            </div>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: 'informacionGeneral',
    header: 'Información',
    cell: ({ row }) => {
      const informacion = row.original.informacion || []
      const generalInfo = informacion.filter((item) => item.type === 'informative')

      return (
        <div className="min-w-[210px] whitespace-normal">
          {generalInfo.map((item, index) => (
            <div key={item.id} className="text-sm">
              {(index === 0 ? '- ' : ' - ') + item.value}
            </div>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: 'objeto',
    header: 'Objeto',
    cell: ({ row }) => {
      const value = row.getValue('objeto')
      const formattedValue = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value

      return <div>{formattedValue as string}</div>
    }
  },
  {
    accessorKey: 'fechaInicio',
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
    cell: ({ row }) => {
      const fecha = row.getValue('fechaInicio')
      const [year, month, day] = (fecha as string).split('-') // Dividimos la fecha en partes
      const fechaFormateada = `${day}/${month}/${year}`

      return <div>{fechaFormateada}</div>
    }
  },
  {
    accessorKey: 'fechaTerminacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Fecha Fin
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = row.getValue('fechaTerminacion')
      const [year, month, day] = (fecha as string).split('-') // Dividimos la fecha en partes
      const fechaFormateada = `${day}/${month}/${year}`

      return <div>{fechaFormateada}</div>
    }
  }
]
