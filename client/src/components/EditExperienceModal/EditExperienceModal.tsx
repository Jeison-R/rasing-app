import type { Payment, Adicion } from '../experience-table/experience-table'

import { useState, useEffect, type ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { activityOptions } from '../actividad-documentos/actividad-table'
import { documentOptions } from '../actividad-documentos/documento-table'
import { tipoContratoOptions } from '../actividad-documentos/tipoContrato-table'
import { salariosMinimos } from '../salarios-table/salarios'
import { opcionesModalidad } from '../modalAddExperiencia/AddExperienciaModal'

interface EditExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment | null
  onSave: (updatedPayment: Payment) => void
}

export function EditExperienceModal({ isOpen, onClose, payment, onSave }: EditExperienceModalProps): JSX.Element | null {
  const [rup, setRup] = useState<string>('')
  const [entidadContratante, setEntidadContratante] = useState<string>('')
  const [contratoNo, setContratoNo] = useState<string>('')
  const [socio, setSocio] = useState<string>('')
  const [modalidad, setModalidad] = useState<string>('')
  const [objeto, setObjeto] = useState<string>('')
  const [documentoSoporte, setDocumentoSoporte] = useState<string[]>([])
  const [tipoContrato, setTipoContrato] = useState<string[]>([])
  const [actividadPrincipal, setActividadPrincipal] = useState<string[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>('')
  const [fechaTerminacion, setFechaTerminacion] = useState<string>('')
  const [valorInicial, setValorInicial] = useState<number>(0)
  const [partPorcentaje, setPartPorcentaje] = useState<number>(0)
  const [valorFinalAfectado, setValorFinalAfectado] = useState<number>(0)
  const [anioTerminacion, setAnioTerminacion] = useState<number>(new Date().getFullYear())
  const [valorSmmlv, setValorSmmlv] = useState<number>(0)
  const [valorSmmlvPart2, setValorSmmlvPart2] = useState<number>(0)
  const [adiciones, setAdiciones] = useState<Adicion[]>([])
  const [valorActual, setValorActual] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([]) // Para almacenar nuevos archivos cargados
  const [documentoSoporteUrls, setDocumentoSoporteUrls] = useState<{ name: string; url: string }[]>([])

  useEffect(() => {
    if (payment) {
      // Poblar los campos con los datos actuales de 'payment'
      setRup(payment.RUP)
      setEntidadContratante(payment.Entidad)
      setContratoNo(payment.Contrato)
      setSocio(payment.Contratista)
      setModalidad(payment.Modalidad)
      setObjeto(payment.Objeto)
      setTipoContrato(payment.TipoContrato.split(', '))
      setActividadPrincipal(payment.ActividadPrincipal.split(', '))
      setDocumentoSoporte(payment.DocumentoSoporte.split(', '))
      setDocumentoSoporteUrls(
        payment.DocumentoCargado.map((doc) => ({
          name: doc.name,
          url: doc.url
        }))
      )
      setFechaInicio(payment.FechaInicio)
      setFechaTerminacion(payment.FechaTerminacion)
      setValorInicial(payment.ValorInicial)
      setPartPorcentaje(payment.PartPorcentaje)
      setValorFinalAfectado(payment.ValorFinalAfectado)
      setValorSmmlv(payment.ValorSmmlv)
      setValorSmmlvPart2(payment.ValorSmmlvPart2)
      setAnioTerminacion(payment.AnioTerminacion)
      setAdiciones(payment.Adiciones || [])
      setValorActual(payment.ValorActual)
    }
  }, [payment])

  const handleMultipleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) // Convertimos FileList en array

      setFiles([...files, ...selectedFiles]) // Añadir archivos seleccionados a la lista
    }
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)) // Eliminar archivo de la lista de nuevos archivos
  }

  const removeUploadedFile = (index: number) => {
    setDocumentoSoporteUrls((prevUrls) => prevUrls.filter((_, i) => i !== index)) // Eliminar URL de documento subido
  }

  const validateForm = (): boolean => {
    let isValid = true

    // Verificar campos vacíos
    if (!rup.trim()) {
      void Swal.fire('Error', 'El campo Nº RUP no puede estar vacío', 'error')
      isValid = false
    } else if (!entidadContratante.trim()) {
      void Swal.fire('Error', 'El campo Entidad no puede estar vacío', 'error')
      isValid = false
    } else if (!contratoNo.trim()) {
      void Swal.fire('Error', 'El campo Contrato No no puede estar vacío', 'error')
      isValid = false
    } else if (!socio.trim()) {
      void Swal.fire('Error', 'El campo Contratista no puede estar vacío', 'error')
      isValid = false
    } else if (!modalidad.trim()) {
      void Swal.fire('Error', 'El campo Modalidad no puede estar vacío', 'error')
      isValid = false
    } else if (!objeto.trim()) {
      void Swal.fire('Error', 'El campo Objeto no puede estar vacío', 'error')
      isValid = false
    } else if (!documentoSoporte.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos un Documento Soporte', 'error')
      isValid = false
    } else if (!tipoContrato.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos un Tipo Contrato', 'error')
      isValid = false
    } else if (!actividadPrincipal.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos una Actividad Principal', 'error')
      isValid = false
    } else if (!fechaInicio.trim()) {
      void Swal.fire('Error', 'El campo Fecha de Inicio no puede estar vacío', 'error')
      isValid = false
    } else if (!fechaTerminacion.trim()) {
      void Swal.fire('Error', 'El campo Fecha de Terminación no puede estar vacío', 'error')
      isValid = false
    } else if (!valorInicial) {
      void Swal.fire('Error', 'El campo Valor Inicial no puede estar vacío', 'error')
      isValid = false
    } else if (!partPorcentaje) {
      void Swal.fire('Error', 'El campo Part. % no puede estar vacío', 'error')
      isValid = false
    }

    if (documentoSoporteUrls.length === 0 && files.length === 0) {
      void Swal.fire('Error', 'Debe tener al menos un documento cargado', 'error')
      isValid = false
    }

    return isValid
  }

  const handleSave = (): void => {
    if (!payment) return

    // Validar formulario
    if (!validateForm()) {
      return // Si la validación falla, no se procederá con el guardado
    }

    const updatedPayment: Payment = {
      ...payment,
      RUP: rup,
      Entidad: entidadContratante,
      Contrato: contratoNo,
      Contratista: socio,
      Modalidad: modalidad,
      Objeto: objeto,
      TipoContrato: tipoContrato.join(', '),
      ActividadPrincipal: actividadPrincipal.join(', '),
      DocumentoSoporte: documentoSoporte.join(', '),
      DocumentoCargado: [
        ...documentoSoporteUrls.map((doc) => ({
          name: doc.name,
          url: doc.url
        })),
        ...files.map((file) => ({
          name: file.name,
          url: URL.createObjectURL(file)
        }))
      ],
      FechaInicio: fechaInicio,
      FechaTerminacion: fechaTerminacion,
      ValorInicial: valorInicial,
      PartPorcentaje: partPorcentaje,
      ValorFinalAfectado: valorFinalAfectado,
      AnioTerminacion: anioTerminacion,
      ValorSmmlv: valorSmmlv,
      ValorSmmlvPart2: valorSmmlvPart2,
      Adiciones: adiciones,
      ValorActual: valorActual
    }

    onSave(updatedPayment)
    resetForm() // Restablecer el formulario después de guardar
    onClose()

    // Mostrar mensaje de guardado exitoso
    void Swal.fire({
      title: 'Guardado',
      text: 'Los cambios se han guardado exitosamente',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }

  const resetForm = (): void => {
    // Restablecer el formulario
    setRup('')
    setEntidadContratante('')
    setContratoNo('')
    setSocio('')
    setModalidad('')
    setObjeto('')
    setDocumentoSoporte([])
    setTipoContrato([])
    setActividadPrincipal([])
    setFechaInicio('')
    setFechaTerminacion('')
    setValorInicial(0)
    setPartPorcentaje(0)
    setValorFinalAfectado(0)
    setAnioTerminacion(new Date().getFullYear())
    setValorSmmlv(0)
    setValorSmmlvPart2(0)
    setAdiciones([])
    setValorActual(0)
    setDocumentoSoporteUrls([])
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm() // Restablecer el formulario cuando se cierra el modal
    }
  }, [isOpen])

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES') // Formato para español (puntos de miles)
  }

  // Función para quitar los separadores de miles y trabajar con el valor real
  const parseNumber = (formattedNumber: string): number => {
    return Number(formattedNumber.replace(/\./g, '').replace(/,/g, '.')) // Reemplaza puntos y comas correctamente
  }

  const handleValorInicialChange = (value: string) => {
    // Utilizar una expresión regular para permitir solo números
    const cleanedValue = value.replace(/[^0-9]/g, '') // Elimina cualquier carácter que no sea un número

    // Convierte el valor limpio a número y actualiza el estado
    const parsedValue = cleanedValue ? parseNumber(cleanedValue) : 0 // Si está vacío, es 0

    setValorInicial(parsedValue)

    if (!parsedValue) {
      setValorSmmlv(0)
    }
  }

  const addAdicion = (): void => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  const removeAdicion = (id: string): void => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  const updateAdicion = (id: string, value: number): void => {
    setAdiciones(adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value } : adicion)))
  }

  const obtenerSalarioMinimo = (anio: number): number | undefined => {
    const salario = salariosMinimos.find((item) => item.año === anio)

    return salario ? salario.valor : undefined
  }

  const obtenerUltimoSalarioMinimo = (): number => {
    return salariosMinimos[salariosMinimos.length - 1].valor // Último salario mínimo en la tabla
  }

  useEffect(() => {
    const ultimoSalarioMinimo = obtenerUltimoSalarioMinimo()
    const valorCalculado = valorSmmlvPart2 * ultimoSalarioMinimo // Multiplicar por el salario mínimo actual

    setValorActual(valorCalculado)
  }, [valorSmmlvPart2, salariosMinimos])

  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  useEffect(() => {
    const salarioMinimo = obtenerSalarioMinimo(anioTerminacion)

    if (salarioMinimo) {
      const valorEnSmmlv = valorFinalAfectado / salarioMinimo

      setValorSmmlv(valorEnSmmlv)
    }
  }, [anioTerminacion, valorFinalAfectado])

  useEffect(() => {
    const valorSmmlvPart2g = valorSmmlv * (partPorcentaje / 100)

    setValorSmmlvPart2(valorSmmlvPart2g)
  }, [valorSmmlv, partPorcentaje])

  useEffect(() => {
    const totalAdiciones = adiciones.reduce((total, current) => total + current.value, 0)

    setValorFinalAfectado(valorInicial + totalAdiciones)
  }, [adiciones, valorInicial])

  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div>
            <label className="block text-sm font-medium" htmlFor="rup">
              Nº RUP
            </label>
            <Input
              id="rup"
              value={rup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRup(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="entidad">
              Entidad
            </label>
            <Input
              id="entidad"
              value={entidadContratante}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEntidadContratante(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contratoNo">
              Contrato No
            </label>
            <Input
              id="contratoNo"
              value={contratoNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setContratoNo(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Contratista
            </label>
            <Input
              id="socio"
              value={socio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSocio(e.target.value)
              }}
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea
              className="w-full rounded-lg border p-2"
              id="objeto"
              name="objeto"
              placeholder="Descripción del Objeto"
              value={objeto}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setObjeto(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <select
              className="w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)]"
              id="modalidad"
              name="modalidad"
              value={modalidad}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setModalidad(e.target.value)
              }}
            >
              {opcionesModalidad.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contrato">
              Documento Soporte
            </label>
            <Select
              isMulti
              options={documentOptions}
              value={documentoSoporte.map((tc) => ({ value: tc, label: tc }))}
              onChange={(selected) => {
                setDocumentoSoporte(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contrato">
              Tipo Contrato
            </label>
            <Select
              isMulti
              options={tipoContratoOptions}
              value={tipoContrato.map((tc) => ({ value: tc, label: tc }))}
              onChange={(selected) => {
                setTipoContrato(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="actividad">
              Actividad Principal
            </label>
            <Select
              isMulti
              options={activityOptions}
              value={actividadPrincipal.map((ap) => ({ value: ap, label: ap }))}
              onChange={(selected) => {
                setActividadPrincipal(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <Input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFechaInicio(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="fechaFin">
              Fecha de Terminación
            </label>
            <Input
              id="fechaFin"
              type="date"
              value={fechaTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFechaTerminacion(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="anioTerminacion">
              Año de Terminación
            </label>
            <Input
              disabled
              id="anioTerminacion"
              type="number"
              value={anioTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAnioTerminacion(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorInicial">
              Valor Inicial
            </label>
            <Input
              id="valorInicial"
              name="valorInicial"
              placeholder="Valor Inicial"
              type="text"
              value={formatNumber(valorInicial)} // Formatea el valor con separadores de miles
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleValorInicialChange(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="Part">
              Part. %
            </label>
            <Input
              id="Part"
              type="number"
              value={partPorcentaje}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartPorcentaje(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorFinal">
              Valor Final Afectado
            </label>
            <Input disabled type="text" value={formatNumber(valorFinalAfectado)} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorSmmlv">
              Valor en SMMLV
            </label>
            <Input disabled id="valorSmmlv" type="number" value={valorSmmlv.toFixed(2)} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorSmmlvPart2">
              Valor en SMMLV % Part2
            </label>
            <Input disabled id="valorSmmlvPart2" type="number" value={valorSmmlvPart2.toFixed(2)} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="adiciones">
              Adiciones
            </label>
            {adiciones.map((adicion) => (
              <div key={adicion.id} className="mb-2 flex items-center">
                <Input
                  type="text"
                  value={formatNumber(adicion.value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, parseFloat(e.target.value.replace(/\./g, '')) || 0)
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
            <Button type="button" onClick={addAdicion}>
              + Agregar Adición
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorActual">
              Valor Actual
            </label>
            <Input disabled id="valorActual" type="text" value={formatNumber(valorActual)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="documentosCargados">
              Documentos Soporte Cargados
            </label>

            {/* Mostrar documentos subidos previamente */}
            {documentoSoporteUrls.length > 0 && (
              <ul className="mt-2 space-y-2">
                {documentoSoporteUrls.map((doc) => (
                  <li key={doc.name} className="flex items-center justify-between text-sm text-gray-600">
                    <a className="truncate" href={doc.url} rel="noopener noreferrer" target="_blank">
                      {doc.name}
                    </a>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      type="button"
                      onClick={() => {
                        removeUploadedFile(documentoSoporteUrls.indexOf(doc))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{file.name}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  type="button"
                  onClick={() => {
                    removeFile(files.indexOf(file))
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
            {/* Campo para cargar nuevos documentos */}
            <div className="relative flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-400 p-4 transition-colors hover:border-gray-500">
              <input
                multiple
                accept="application/pdf"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="documentosCargados"
                name="documentosCargados"
                type="file"
                onChange={handleMultipleFileUpload}
              />
              <span className="text-xs text-gray-600">{files.length > 0 ? `${files.length} documentos seleccionados` : 'Haz clic aquí para cargar documentos PDF'}</span>
            </div>

            {/* Mostrar nombres de los nuevos archivos seleccionados */}
          </div>
        </form>
        <div className="mt-6 flex justify-end">
          <Button variant="default" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
