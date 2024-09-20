import { CustomTableActividad } from '@/components/actividad-documentos/actividad-table'
import { CustomTableContrato } from '@/components/actividad-documentos/documento-table'

export default function ActividadContratoPage() {
  return (
    <>
      <div className="w-1/2">
        <CustomTableActividad />
      </div>
      <div className="w-1/2">
        <CustomTableContrato />
      </div>
    </>
  )
}
