'use client'

import type { Documento, Folder } from '../doc-regulares/interface'

import { useState, useEffect } from 'react'
import { Bell, X, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationsPanelProps {
  documentos: Documento[]
  carpetas: Folder[]
}

// Determine document status
const determinarEstadoDocumento = (documento: Documento) => {
  if (documento.tipo === 'permanente') {
    return 'Permanente'
  }

  const hoy = new Date()
  const proximaActualizacion = documento.proximaActualizacion ? new Date(documento.proximaActualizacion) : null

  if (!proximaActualizacion || hoy > proximaActualizacion) {
    return 'Por actualizar'
  }

  const diferenciaDias = Math.ceil((proximaActualizacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

  if (diferenciaDias <= 10) {
    return 'Próximo a vencer'
  }

  return 'Vigente'
}

// Get folder name by document ID
const getFolderNameByDocumentId = (documentId: string, carpetas: Folder[]) => {
  for (const carpeta of carpetas) {
    if (carpeta.documentos.includes(documentId)) {
      return carpeta.nombre
    }
  }

  return 'Carpeta desconocida'
}

export function NotificationsPanel({ documentos, carpetas }: NotificationsPanelProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [notifications, setNotifications] = useState<
    {
      id: string
      documentId: string
      title: string
      message: string
      type: 'update' | 'expiring'
      read: boolean
      folderName: string
    }[]
  >([])

  // Generate notifications based on document status
  useEffect(() => {
    const newNotifications: {
      id: string
      documentId: string
      title: string
      message: string
      type: 'update' | 'expiring'
      read: boolean
      folderName: string
    }[] = []

    for (const doc of documentos) {
      const estado = determinarEstadoDocumento(doc)
      const folderName = getFolderNameByDocumentId(doc.id, carpetas)

      if (estado === 'Por actualizar') {
        newNotifications.push({
          id: `update-${doc.id}`,
          documentId: doc.id,
          title: 'Documento por actualizar',
          message: `"${doc.nombre}" requiere actualización inmediata`,
          type: 'update' as const, // <-- Asegura que 'type' sea del tipo correcto
          read: false,
          folderName
        })
      } else if (estado === 'Próximo a vencer') {
        const proximaActualizacion = doc.proximaActualizacion ? new Date(doc.proximaActualizacion) : null
        const hoy = new Date()
        const diferenciaDias = proximaActualizacion ? Math.ceil((proximaActualizacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)) : 0

        newNotifications.push({
          id: `expiring-${doc.id}`,
          documentId: doc.id,
          title: 'Documento próximo a vencer',
          message: `"${doc.nombre}" vence en ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''}`,
          type: 'expiring' as const, // <-- Asegura que 'type' sea del tipo correcto
          read: false,
          folderName
        })
      }
    }

    setNotifications(newNotifications)
    setNotificationCount(newNotifications.length)
  }, [documentos, carpetas])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)))
    setNotificationCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setNotificationCount(0)
  }

  const handleNotificationClick = (notification: { id: string; documentId: string; type: 'update' | 'expiring' }) => {
    markAsRead(notification.id)
    setIsOpen(false)

    // Navegar a la página de documentos regulares con el ID del documento como parámetro de consulta
    router.push(`/documentos-regulares?documentId=${notification.documentId}&action=${notification.type === 'update' ? 'actualizar' : 'ver'}`)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="relative rounded-full border-input/10 bg-border/10 hover:bg-transparent" size="icon" variant="outline">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-secondary" strokeWidth={1.5} />
          {notificationCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white" variant="destructive">
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notificaciones</h3>
          {notificationCount > 0 && (
            <Button className="h-auto p-1 text-xs" size="sm" variant="ghost" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No hay notificaciones pendientes</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative p-3 transition-colors hover:bg-muted/50 ${notification.read ? 'opacity-60' : ''} cursor-pointer`}
                  onClick={() => {
                    handleNotificationClick(notification)
                  }}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 rounded-full p-1 ${notification.type === 'update' ? 'bg-red-100' : 'bg-amber-100'}`}>
                      {notification.type === 'update' ? <AlertCircle className="h-4 w-4 text-red-600" /> : <Clock className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <Button
                          className="-mr-1 -mt-1 h-5 w-5 rounded-full p-0"
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent the parent onClick from firing
                            markAsRead(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Cerrar</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Carpeta: {notification.folderName}</p>
                    </div>
                  </div>
                  {!notification.read && <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
