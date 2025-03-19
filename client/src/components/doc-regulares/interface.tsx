import { FileIcon, FileText, FileSpreadsheet, ImageIcon, FileArchive, FileCode } from 'lucide-react'

export interface Archivo {
  nombre: string
  tipo: string
  url: string
  tamaño: string
}

export interface Documento {
  id: string
  nombre: string
  tipo: string
  categoria: string
  fechaActualizacion: string
  proximaActualizacion: string
  archivo: Archivo[]
  estado: string
}

export interface Folder {
  id: string
  nombre: string
  descripcion?: string
  documentos: string[] // IDs de documentos
  color?: string
  createdAt: string
}

export const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'application/pdf':
      return <FileIcon className="h-10 w-10 text-red-500" />
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <FileText className="h-10 w-10 text-blue-500" />
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.ms-excel.sheet.macroEnabled.12':
      return <FileSpreadsheet className="h-10 w-10 text-green-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <ImageIcon className="h-10 w-10 text-purple-500" />
    case 'zip':
    case 'rar':
      return <FileArchive className="h-10 w-10 text-amber-500" />
    case 'html':
    case 'css':
    case 'js':
      return <FileCode className="h-10 w-10 text-cyan-500" />
    default:
      return <FileIcon className="h-10 w-10 text-gray-500" />
  }
}
