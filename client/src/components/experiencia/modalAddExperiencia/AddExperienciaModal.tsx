import type { MultiValue } from 'react-select'
import type { Experiencia } from '../experience-table/interface'
import type { Salario } from '../../services/salario/salarioService'
import type { Actividad } from '../../actividad/actividadTable/actividad-table'
import type { Documento } from '../../documentoSoporte/documentoTable/documento-table'
import type { Contrato } from '../../tipoContrato/tipoContratoTable/tipoContrato-table'

import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { storage } from '../../../firebase/firebase'
import { obtenerSalarios } from '../../services/salario/salarioService'
import { obtenerDocumentosSoporte } from '../../services/documento/documentoService'
import { obtenerActividades } from '../../services/actividad/actividadService'
import { obtenerTiposContrato } from '../../services/tipoContrato/contratoService'
import { getCustomSelectStyles } from '../../custom-select/customSelectStyles'

interface AddExperenciaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Experiencia) => void
  onExperienciaAdded: () => void
}

export interface OptionDocument {
  value: string
  label: string
}

export interface OptionActivity {
  value: string
  label: string
}

export interface OptionTipoContrato {
  value: string
  label: string
}

interface Adicion {
  id: string
  value: number
}

export const opcionesModalidad = [
  { value: '', label: 'Seleccione una modalidad' },
  { value: 'Individual', label: 'Individual' },
  { value: 'Consorcio', label: 'Consorcio' },
  { value: 'Unión Temporal', label: 'Unión Temporal' }
]

export function AddExperienciaModal({ isOpen, onClose, onExperienciaAdded }: Readonly<AddExperenciaModalProps>) {
  const [adiciones, setAdiciones] = useState<Adicion[]>([])
  const [valorInicial, setValorInicial] = useState<number>(0)
  const [partPorcentaje, setPartPorcentaje] = useState<number>(0)
  const [valorSmmlvPart2, setValorSmmlvPart2] = useState<number>(0) // Para almacenar el valor en SMMLV % PART2
  const [valorFinalAfectado, setValorFinalAfectado] = useState<number>(0)
  const [fechaTerminacion, setFechaTerminacion] = useState<string>('')
  const [anioTerminacion, setAnioTerminacion] = useState<number>(new Date().getFullYear())
  const [rup, setRup] = useState<string>('')

  const [empresa, setEmpresa] = useState<string>('')
  const [entidadContratante, setEntidadContratante] = useState<string>('')
  const [contratoNo, setContratoNo] = useState<string>('')
  const [socio, setSocio] = useState<string>('')
  const [contratista, setContratista] = useState<string>('')
  const [objeto, setObjeto] = useState<string>('')
  const [modalidad, setModalidad] = useState<string>('')
  const [documentoSoporte, setDocumentoSoporte] = useState<Documento[]>([])
  const [tipoContrato, setTipoContrato] = useState<Contrato[]>([])
  const [actividadPrincipal, setActividadPrincipal] = useState<Actividad[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>('')
  const [valorSmmlv, setValorSmmlv] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [valorActual, setValorActual] = useState<number>(0) // Para almacenar el valor actual basado en el año actual
  const [files, setFiles] = useState<File[]>([])
  const [salariosMinimos, setSalariosMinimos] = useState<Salario[]>([])
  const [opcionesDocumentoSoporte, setOpcionesDocumentoSoporte] = useState<OptionDocument[]>([])
  const [opcionesActividadPrincipal, setOpcionesActividadPrincipal] = useState<OptionActivity[]>([])
  const [opcionesTipoContrato, setOpcionesTipoContrato] = useState<OptionTipoContrato[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        // Cargar opciones de documento soporte
        const documentos = await obtenerDocumentosSoporte()

        setOpcionesDocumentoSoporte(
          documentos.map((doc: Documento) => ({ value: doc.id, label: doc.nombre })) // Ajusta según los campos reales
        )

        // Cargar opciones de actividad principal
        const actividades = await obtenerActividades()

        setOpcionesActividadPrincipal(actividades.map((act: Actividad) => ({ value: act.id, label: act.nombre })))

        // Cargar opciones de tipo de contrato
        const tiposContratos = await obtenerTiposContrato()

        setOpcionesTipoContrato(
          tiposContratos.map((contrato: Contrato) => ({ value: contrato.id, label: contrato.nombre })) // Ajusta según los campos reales
        )
      } catch (error) {
        global.console.error('Error al cargar opciones:', error)
      }
    }

    void cargarOpciones()
  }, [])

  useEffect(() => {
    const cargarSalarios = async () => {
      try {
        const salarios = await obtenerSalarios() // Llamada a tu servicio API

        setSalariosMinimos(salarios) // Almacena los salarios en el estado
      } catch (error) {
        global.console.error('Error al cargar salarios mínimos:', error)
      }
    }

    void cargarSalarios()
  }, [])

  const valorFinalCalculado = useMemo(() => {
    const totalAdiciones = adiciones.reduce((acc, curr) => acc + curr.value, 0)

    return valorInicial + totalAdiciones
  }, [valorInicial, adiciones])

  useEffect(() => {
    setValorFinalAfectado(valorFinalCalculado)
  }, [valorFinalCalculado])

  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  useEffect(() => {
    const ultimoSalarioMinimo = obtenerUltimoSalarioMinimo()
    const valorCalculado = valorSmmlvPart2 * ultimoSalarioMinimo

    setValorActual(valorCalculado)
  }, [valorSmmlvPart2, salariosMinimos])

  useEffect(() => {
    if (valorSmmlv && partPorcentaje) {
      const valorSmmlvPart2g = valorSmmlv * (partPorcentaje / 100) // Multiplicar el valor en SMMLV por el porcentaje

      setValorSmmlvPart2(valorSmmlvPart2g)
    } else {
      setValorSmmlvPart2(0) // Si no hay valor o porcentaje, el resultado es 0
    }
  }, [valorSmmlv, partPorcentaje])

  // Actualizar el valor en SMMLV cuando cambia el año de terminación o el valor final afectado
  useEffect(() => {
    if (anioTerminacion && valorFinalAfectado) {
      const salarioMinimo = obtenerSalarioMinimo(anioTerminacion)

      if (salarioMinimo) {
        const valorEnSmmlv = valorFinalAfectado / salarioMinimo

        setValorSmmlv(valorEnSmmlv)
      } else {
        setValorSmmlv(0) // Manejar si no se encuentra el salario mínimo para ese año
      }
    }
  }, [anioTerminacion, valorFinalAfectado])

  const obtenerSalarioMinimo = (anio: number): number | undefined => {
    const salario = salariosMinimos.find((item) => item.año === anio) // Asegúrate de que 'anio' coincida con la clave correcta de tu respuesta

    return salario ? salario.valor : undefined
  }

  const obtenerUltimoSalarioMinimo = (): number => {
    if (salariosMinimos.length === 0) return 0

    // Encontrar el salario mínimo con el año más reciente
    const salarioUltimoAno = salariosMinimos.reduce((max, salario) => (salario.año > max.año ? salario : max))

    return salarioUltimoAno.valor
  }

  const handleSelectDocument = (selectedOptions: MultiValue<OptionDocument>) => {
    const values = selectedOptions.map((option) => ({
      id: option.value,
      nombre: option.label // O el campo que contiene el nombre
    }))

    setDocumentoSoporte(values)

    if (values.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, documentoSoporte: false }))
    }
  }

  const handleSelectActivity = (selectedOptions: MultiValue<OptionActivity>) => {
    const values = selectedOptions.map((option) => ({
      id: option.value,
      nombre: option.label // O el campo que contiene el nombre
    }))

    setActividadPrincipal(values)

    if (values.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, actividadPrincipal: false }))
    }
  }

  const handleSelectTipoContrato = (selectedOptions: MultiValue<OptionTipoContrato>) => {
    const values = selectedOptions.map((option) => ({
      id: option.value,
      nombre: option.label // O el campo que contiene el nombre
    }))

    setTipoContrato(values)

    if (values.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, tipoContrato: false }))
    }
  }

  const addAdicion = () => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  const removeAdicion = (id: string) => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  const updateAdicion = (id: string, valor: number) => {
    const newAdiciones = adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value: valor } : adicion))

    setAdiciones(newAdiciones)
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}

    if (!empresa) newErrors.empresa = true

    if (!rup) newErrors.rup = true

    if (!entidadContratante) newErrors.entidadContratante = true

    if (!contratoNo) newErrors.contratoNo = true

    if (!socio) newErrors.socio = true

    if (!objeto) newErrors.objeto = true

    if (!modalidad) newErrors.modalidad = true

    if (documentoSoporte.length === 0) newErrors.documentoSoporte = true

    if (actividadPrincipal.length === 0) newErrors.actividadPrincipal = true

    if (tipoContrato.length === 0) newErrors.tipoContrato = true

    if (!fechaInicio) newErrors.fechaInicio = true

    if (!fechaTerminacion) newErrors.fechaTerminacion = true

    if (!valorInicial) newErrors.valorInicial = true

    if (!partPorcentaje) newErrors.partPorcentaje = true

    if (files.length === 0) {
      newErrors.files = true
    }

    if (fechaInicio && fechaTerminacion) {
      const startDate = new Date(fechaInicio)
      const endDate = new Date(fechaTerminacion)

      if (startDate > endDate) {
        // Mostrar alerta de error con SweetAlert2
        void Swal.fire({
          title: 'Error de Fechas',
          text: 'La fecha de inicio no puede ser mayor que la fecha de terminación',
          icon: 'error',
          confirmButtonText: 'OK'
        })

        // Retornar false para indicar que el formulario no es válido
        setErrors(newErrors)

        return false
      }
    }

    // Validar adiciones si existen
    adiciones.forEach((adicion, index) => {
      if (!adicion.value || adicion.value === 0) {
        newErrors[`adicion_${index}`] = true
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Subimos los archivos a Firebase Storage de forma paralela
      const storageDirRef = ref(storage, 'documentos')
      const existingFiles = await listAll(storageDirRef)

      const uploadPromises = files.map(async (file) => {
        const duplicateFile = existingFiles.items.find((item) => item.name.startsWith(file.name))

        if (duplicateFile) {
          // Obtener la URL existente si el archivo ya está en Firebase Storage
          const existingUrl = await getDownloadURL(duplicateFile)

          return { name: file.name, url: existingUrl }
        } else {
          // Subir el archivo si no existe
          const storageRef = ref(storage, `documentos/${file.name}-${uuidv4()}`)

          await uploadBytes(storageRef, file)

          const url = await getDownloadURL(storageRef)

          return { name: file.name, url }
        }
      })

      const documentosSubidos = await Promise.all(uploadPromises)

      // Continuar con el envío de los datos de la experiencia
      const newData: Omit<Experiencia, 'id'> = {
        // Datos de la experiencia
        Empresa: empresa,
        rup: rup,
        entidad: entidadContratante,
        contrato: contratoNo,
        socio: socio,
        contratista: contratista,
        objeto: objeto,
        modalidad: modalidad,
        documentoSoporte: documentoSoporte,
        tipoContrato: tipoContrato,
        actividadPrincipal: actividadPrincipal,
        fechaInicio: fechaInicio,
        fechaTerminacion: fechaTerminacion,
        valorInicial: valorInicial,
        partPorcentaje: partPorcentaje,
        valorFinalAfectado: valorFinalAfectado,
        anioTerminacion: anioTerminacion,
        valorSmmlv: valorSmmlv,
        valorActual: valorActual,
        valorSmmlvPart2: valorSmmlvPart2,
        adiciones: adiciones.map((adicion) => ({
          id: adicion.id,
          value: adicion.value
        })),
        documentoCargado: documentosSubidos
      }

      const response = await fetch('https://servidor-rasing.onrender.com/experiencias/CrearExperiencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newData)
      })

      if (!response.ok) {
        throw new Error('Error al guardar la experiencia')
      }

      // Mostrar alerta de éxito
      void Swal.fire({
        title: 'Guardado',
        text: 'La experiencia se ha guardado exitosamente',
        icon: 'success',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
      onExperienciaAdded()
      handleClose()
    } catch (error) {
      global.console.error('Error:', error)
      void Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al guardar la experiencia',
        icon: 'error',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void handleSave(e) // Usar void para ignorar el valor devuelto
  }

  const handleClose = () => {
    setEmpresa('')
    setRup('')
    setEntidadContratante('')
    setContratoNo('')
    setSocio('')
    setObjeto('')
    setContratista('')
    setModalidad('')
    setDocumentoSoporte([])
    setTipoContrato([])
    setActividadPrincipal([])
    setFechaInicio('')
    setFechaTerminacion('')
    setValorSmmlv(0)
    setAdiciones([])
    setValorInicial(0)
    setPartPorcentaje(0)
    setValorFinalAfectado(0)
    setAnioTerminacion(new Date().getFullYear())
    setFiles([])
    setErrors({})

    onClose() // Llama a la función pasada como prop para cerrar el modal
  }

  const handleFieldChange = (field: string, value: string | number | { id: string; nombre: string }) => {
    switch (field) {
      case 'empresa':
        setEmpresa(value as string)
        break
      case 'rup':
        setRup(value as string)
        break
      case 'entidadContratante':
        setEntidadContratante(value as string)
        break
      case 'contratoNo':
        setContratoNo(value as string)
        break
      case 'socio':
        setSocio(value as string)
        break
      case 'objeto':
        setObjeto(value as string)
        break
      case 'contratista':
        setContratista(value as string)
        break
      case 'modalidad':
        setModalidad(value as string)
        break
      case 'documentoSoporte':
        setDocumentoSoporte((prevDocs) => [...prevDocs, value as { id: string; nombre: string }])
        break
      case 'tipoContrato':
        setTipoContrato((prevTipos) => [...prevTipos, value as { id: string; nombre: string }])
        break
      case 'actividadPrincipal':
        setActividadPrincipal((prevActividades) => [...prevActividades, value as { id: string; nombre: string }])
        break
      case 'fechaInicio':
        setFechaInicio(value as string)
        break
      case 'fechaTerminacion':
        setFechaTerminacion(value as string)
        break
      case 'valorInicial':
        setValorInicial(value as number)
        break
      case 'valorSmmlv':
        setValorSmmlv(value as number)
        break
      case 'partPorcentaje':
        setPartPorcentaje(value as number)
        break
      case 'valorFinalAfectado':
        setValorFinalAfectado(value as number)
        break
      case 'anioTerminacion':
        setAnioTerminacion(value as number)
        break
      case 'adicion': // Este es un ejemplo de cómo manejar las adiciones si necesitas una adición individual
        setAdiciones((prevAdiciones) => prevAdiciones.map((adicion) => (adicion.id === field ? { ...adicion, value: value as number } : adicion)))
        break
      default:
        break
    }

    // Eliminar el error cuando el usuario comienza a escribir
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES') // Formato para español (puntos de miles)
  }

  // Función para quitar los separadores de miles y trabajar con el valor real
  const parseNumber = (formattedNumber: string): number => {
    return Number(formattedNumber.replace(/\./g, '').replace(/,/g, '.')) // Reemplaza puntos y comas correctamente
  }

  // Actualiza el valor del input mientras se escribe
  const handleValorInicialChange = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '')

    // Convierte el valor limpio a número y actualiza el estado
    const parsedValue = cleanedValue ? parseNumber(cleanedValue) : 0 // Si está vacío, es 0

    setValorInicial(parsedValue)

    if (!parsedValue) {
      setValorSmmlv(0)
    }

    if (parsedValue > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, valorInicial: false }))
    }
  }

  const handleValorFinalAfectadoChange = (value: string) => {
    const parsedValue = parseNumber(value) // Convierte a número real sin separadores

    setValorFinalAfectado(parsedValue)
  }

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files

    if (selectedFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {isLoading ? (
          <div className="z-60 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingSpinner />
          </div>
        ) : null}
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium" htmlFor="empresa">
              Empresa
            </label>
            <Input
              className={errors.empresa ? 'border-red-500' : ''}
              id="empresa"
              name="empresa"
              placeholder="Nombre empresa"
              value={empresa}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('empresa', e.target.value)
              }}
            />
            {errors.empresa ? <span className="text-red-500">Campo requerido</span> : null}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="rup">
              Nº RUP
            </label>
            <Input
              className={errors.rup ? 'border-red-500' : ''}
              id="rup"
              name="rup"
              placeholder="Nº RUP"
              value={rup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('rup', e.target.value)
              }}
            />
            {errors.rup ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="entidadContratante">
              Entidad Contratante
            </label>
            <Input
              className={errors.entidadContratante ? 'border-red-500' : ''}
              id="entidadContratante"
              name="entidadContratante"
              placeholder="Entidad Contratante"
              value={entidadContratante}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('entidadContratante', e.target.value)
              }}
            />
            {errors.entidadContratante ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="contratoNo">
              Contrato No.
            </label>
            <Input
              className={errors.contratoNo ? 'border-red-500' : ''}
              id="contratoNo"
              name="contratoNo"
              placeholder="Contrato No."
              value={contratoNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('contratoNo', e.target.value)
              }}
            />
            {errors.contratoNo ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Socio Aportante / Propio
            </label>
            <Input
              className={errors.socio ? 'border-red-500' : ''}
              id="socio"
              name="socio"
              placeholder="Socio Aportante / Propio"
              value={socio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('socio', e.target.value)
              }}
            />
            {errors.socio ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="contratista">
              Contratista
            </label>
            <Input
              className={errors.contratista ? 'border-red-500' : ''}
              id="contratista"
              name="contratista"
              placeholder="Contratista"
              value={contratista}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('contratista', e.target.value)
              }}
            />
            {errors.contratista ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tipoContrato">
              Documentos de soporte
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={opcionesDocumentoSoporte} // Aquí se usan las opciones dinámicas obtenidas del API
              styles={getCustomSelectStyles}
              value={opcionesDocumentoSoporte.filter((option) => documentoSoporte.some((documento) => documento.id === option.value))}
              onChange={handleSelectDocument}
            />
            {errors.documentoSoporte ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <select
              className={`w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)] ${errors.modalidad ? 'border-red-500' : ''}`}
              id="modalidad"
              name="modalidad"
              value={modalidad}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleFieldChange('modalidad', e.target.value)
              }}
            >
              {opcionesModalidad.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
            {errors.modalidad ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea
              className={`w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)] ${errors.objeto ? 'border-red-500' : ''}`}
              id="objeto"
              name="objeto"
              placeholder="Descripción del Objeto"
              value={objeto}
              onChange={(e) => {
                handleFieldChange('objeto', e.target.value)
              }}
            />
            {errors.objeto ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tipoContrato">
              Tipo Contrato
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={opcionesTipoContrato} // Aquí se usan las opciones dinámicas obtenidas del API
              styles={getCustomSelectStyles}
              value={opcionesTipoContrato.filter((option) => tipoContrato.some((contrato) => contrato.id === option.value))}
              onChange={handleSelectTipoContrato}
            />
            {errors.tipoContrato ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="actividadPrincipal">
              Actividad Principal
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={opcionesActividadPrincipal} // Aquí se usan las opciones dinámicas obtenidas del API
              styles={getCustomSelectStyles}
              value={opcionesActividadPrincipal.filter((option) => actividadPrincipal.some((actividad) => actividad.id === option.value))} // Muestra los valores seleccionados
              onChange={handleSelectActivity}
            />
            {errors.actividadPrincipal ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <Input
              className={errors.fechaInicio ? 'border-red-500' : ''}
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('fechaInicio', e.target.value)
              }}
            />
            {errors.fechaInicio ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaTerminacion">
              Fecha de Terminación
            </label>
            <Input
              className={errors.fechaTerminacion ? 'border-red-500' : ''}
              id="fechaTerminacion"
              name="fechaTerminacion"
              type="date"
              value={fechaTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('fechaTerminacion', e.target.value)
              }}
            />
            {errors.fechaTerminacion ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="anioTerminacion">
              Año de Terminación
            </label>
            <Input disabled id="anioTerminacion" name="anioTerminacion" type="number" value={anioTerminacion || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="partPorcentaje">
              Part. %
            </label>
            <Input
              className={errors.partPorcentaje ? 'border-red-500' : ''}
              id="partPorcentaje"
              name="partPorcentaje"
              placeholder="Part. %"
              type="number"
              value={partPorcentaje}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('partPorcentaje', Number(e.target.value))
              }}
            />
            {errors.partPorcentaje ? <span className="text-red-500">Campo requerido</span> : null}
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
            {errors.valorInicial ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorFinalAfectado">
              Valor Final Afectado (%) de Part.
            </label>
            <Input
              disabled
              id="valorFinalAfectado"
              name="valorFinalAfectado"
              placeholder="Valor Final Afectado"
              type="text"
              value={formatNumber(valorFinalAfectado)} // Mostrar con separadores de miles
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleValorFinalAfectadoChange(e.target.value)
              }} // Manejar el cambio del input
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorSmmlv">
              Valor en SMMLV
            </label>
            <Input disabled id="valorSmmlv" name="valorSmmlv" placeholder="Valor en SMMLV" type="text" value={formatNumber(valorSmmlv)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorSmmlvPart2">
              Valor en SMMLV % PART2
            </label>
            <Input
              disabled
              id="valorSmmlvPart2"
              name="valorSmmlvPart2"
              placeholder="Valor en SMMLV % PART2"
              type="text"
              value={formatNumber(valorSmmlvPart2)} // Formatea el valor con separadores de miles
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorActual">
              Valor Actual
            </label>
            <Input disabled id="valorActual" name="valorActual" placeholder="Valor Actual" type="text" value={formatNumber(valorActual)} />
          </div>

          <br />

          <div>
            <h4 className="mb-1">Adiciones</h4>
            {adiciones.map((adicion, index) => (
              <div key={adicion.id} className="mb-2 flex flex-col items-center lg:flex-row">
                <Input
                  className={errors[`adicion_${index}`] ? 'border-red-500' : ''}
                  placeholder={`Adición ${index + 1}`}
                  type="text"
                  value={formatNumber(adicion.value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, parseFloat(e.target.value.replace(/\./g, '')) || 0)
                  }}
                />
                <Button
                  className="ml-0 mt-2 lg:ml-2 lg:mt-0"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeAdicion(adicion.id)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
                {errors[`adicion_${index}`] ? <span className="ml-2 text-red-500">Valor requerido</span> : null}
              </div>
            ))}
            <Button className="mt-2" type="button" variant="default" onClick={addAdicion}>
              + Agregar Adición
            </Button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="documentosCargados">
              Cargar Documentos Soporte (PDF)
            </label>

            <div className="relative flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-400 p-4 transition-colors hover:border-gray-500">
              <input
                multiple
                accept="application/pdf"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="documentosCargados"
                name="documentosCargados"
                type="file"
                onChange={handleFileChange}
              />
              <span className="text-xs text-gray-600">{files.length > 0 ? `${files.length} documentos seleccionados` : 'Haz clic aquí para cargar documentos PDF'}</span>
            </div>

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

            {/* Mensaje de error si es necesario */}
            {errors.files ? <span className="text-red-500">Debes cargar al menos un documento</span> : null}
          </div>

          <div className="col-span-1 flex justify-end md:col-span-2 lg:col-span-4">
            <Button disabled={isLoading} type="submit" variant="default">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
