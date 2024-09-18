import { CustomTableActividad } from '@/components/actividad-contratos/actividad'
import { CustomTableContrato } from '@/components/actividad-contratos/documento'

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
