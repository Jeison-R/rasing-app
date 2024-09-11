import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddExperenciaModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Adicion {
  id: string
  value: number
}

export function AddExperienciaModal({ isOpen, onClose }: Readonly<AddExperenciaModalProps>) {
  const [adiciones, setAdiciones] = useState<Adicion[]>([])
  const [valorInicial, setValorInicial] = useState<number>(0)
  const [partPorcentaje, setPartPorcentaje] = useState<number>(0)
  const [valorFinalAfectado, setValorFinalAfectado] = useState<number>(0)
  const [fechaTerminacion, setFechaTerminacion] = useState<string>('')
  const [anioTerminacion, setAnioTerminacion] = useState<number>(new Date().getFullYear())

  // Calcular el valor afectado en base al valor inicial y las adiciones
  useEffect(() => {
    const totalAdiciones = adiciones.reduce((acc, curr) => acc + curr.value, 0)
    const valorFinal = valorInicial + totalAdiciones

    setValorFinalAfectado(valorFinal)
  }, [valorInicial, adiciones])

  // Agregar adición
  const addAdicion = () => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  // Eliminar adición
  const removeAdicion = (id: string) => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  // Actualizar valor de adición
  const updateAdicion = (id: string, valor: number) => {
    const newAdiciones = adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value: valor } : adicion))

    setAdiciones(newAdiciones)
  }

  // Actualizar año de terminación basado en la fecha seleccionada
  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form
          className="grid grid-cols-4 gap-4"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
          }}
        >
          <div>
            <label className="block text-sm font-medium" htmlFor="rup">
              Nº RUP
            </label>
            <Input id="rup" name="rup" placeholder="Nº RUP" />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="entidadContratante">
              Entidad Contratante
            </label>
            <Input id="entidadContratante" name="entidadContratante" placeholder="Entidad Contratante" />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contratoNo">
              Contrato No.
            </label>
            <Input id="contratoNo" name="contratoNo" placeholder="Contrato No." />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Socio Aportante / Propio
            </label>
            <Input id="socio" name="socio" placeholder="Socio Aportante / Propio" />
          </div>

          {/* Objeto como un textarea */}
          <div className="col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea className="w-full rounded-lg border p-2 dark:bg-black" id="objeto" name="objeto" placeholder="Descripción del Objeto" />
          </div>

          {/* Modalidad como select */}
          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <select className="w-full rounded-lg border p-2 dark:bg-black" id="modalidad" name="modalidad">
              <option value="">Seleccione una modalidad</option>
              <option value="Modalidad 1">Modalidad 1</option>
              <option value="Modalidad 2">Modalidad 2</option>
            </select>
          </div>

          {/* Tipo de Contrato como select */}
          <div>
            <label className="block text-sm font-medium" htmlFor="tipoContrato">
              Tipo de Contrato
            </label>
            <select className="w-full rounded-lg border p-2 dark:bg-black" id="tipoContrato" name="tipoContrato">
              <option value="">Seleccione el tipo de contrato</option>
              <option value="Tipo 1">Tipo 1</option>
              <option value="Tipo 2">Tipo 2</option>
            </select>
          </div>

          {/* Actividad Principal como select */}
          <div>
            <label className="block text-sm font-medium" htmlFor="actividadPrincipal">
              Actividad Principal
            </label>
            <select className="w-full rounded-lg border p-2 dark:bg-black" id="actividadPrincipal" name="actividadPrincipal">
              <option value="">Seleccione la actividad</option>
              <option value="Actividad 1">Actividad 1</option>
              <option value="Actividad 2">Actividad 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <Input id="fechaInicio" name="fechaInicio" type="date" />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaTerminacion">
              Fecha de Terminación
            </label>
            <Input
              id="fechaTerminacion"
              name="fechaTerminacion"
              type="date"
              value={fechaTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFechaTerminacion(e.target.value)
              }}
            />
          </div>

          {/* Año de Terminación, calculado automáticamente */}
          <div>
            <label className="block text-sm font-medium" htmlFor="anioTerminacion">
              Año de Terminación
            </label>
            <Input disabled id="anioTerminacion" name="anioTerminacion" type="number" value={anioTerminacion || ''} />
          </div>

          {/* Part. % */}
          <div>
            <label className="block text-sm font-medium" htmlFor="partPorcentaje">
              Part. %
            </label>
            <Input
              id="partPorcentaje"
              name="partPorcentaje"
              placeholder="Part. %"
              type="number"
              value={partPorcentaje}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartPorcentaje(Number(e.target.value))
              }}
            />
          </div>

          {/* Valor Inicial */}
          <div>
            <label className="block text-sm font-medium" htmlFor="valorInicial">
              Valor Inicial
            </label>
            <Input
              id="valorInicial"
              name="valorInicial"
              placeholder="Valor Inicial"
              type="number"
              value={valorInicial}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValorInicial(Number(e.target.value))
              }}
            />
          </div>

          {/* Sección de Adiciones */}
          <div className="col-span-4">
            <h4 className="mb-2">Adiciones</h4>
            {adiciones.map((adicion, index) => (
              <div key={adicion.id} className="mb-2 flex items-center">
                <Input
                  placeholder={`Adición ${index + 1}`}
                  type="number"
                  value={adicion.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, Number(e.target.value))
                  }}
                />
                <Button
                  className="ml-2"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeAdicion(adicion.id)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button className="mt-2" type="button" variant="default" onClick={addAdicion}>
              + Agregar Adición
            </Button>
          </div>

          {/* Valor Final Afectado (%) */}
          <div>
            <label className="block text-sm font-medium" htmlFor="valorFinalAfectado">
              Valor Final Afectado (%) de Part.
            </label>
            <Input disabled id="valorFinalAfectado" name="valorFinalAfectado" placeholder="Valor Final Afectado" type="number" value={valorFinalAfectado} />
          </div>

          <div className="col-span-4 flex justify-end">
            <Button type="submit" variant="default">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
