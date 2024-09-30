import { CustomTableActividad } from '@/components/actividad-documentos/actividad-table'
import { CustomTableDocumento } from '@/components/actividad-documentos/documento-table'
import { CustomTableTipoContrato } from '@/components/actividad-documentos/tipoContrato-table'

export default function ActividadContratoPage() {
  return (
    <>
      <div className="w-1/3">
        <CustomTableActividad />
      </div>
      <div className="w-1/3">
        <CustomTableDocumento />
      </div>
      <div className="w-1/3">
        <CustomTableTipoContrato />
      </div>
    </>
  )
}
