'use client'

import type { Documento } from './interface'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface VisualizarDocumentoProps {
  onClose: () => void
  isOpen: boolean
  documento: Documento | null
}

export function VisualizarDocumento({ documento, isOpen, onClose }: VisualizarDocumentoProps) {
  if (!documento) return null

  const archivo = documento.archivo[0]
  const esPDF = archivo.tipo === 'application/pdf'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{documento.nombre}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-[500px] w-full rounded-md border">
            <div className="flex flex-col items-center p-4">
              {esPDF ? (
                <iframe className="h-[500px] w-full rounded-md border" src={archivo.url} title="Vista previa del documento PDF" />
              ) : (
                <img alt="Vista previa del documento" className="h-auto max-w-full rounded-md border" src={archivo.url || '/placeholder.svg'} />
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {archivo.nombre} ({archivo.tamaño})
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
