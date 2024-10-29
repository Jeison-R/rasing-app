import { ListFilter, Plus } from 'lucide-react'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { CustomTooltip } from '@/components/commons/tooltip'

export function Filters() {
  return (
    <div className="flex w-full items-center justify-between border-b py-4">
      <div className="flex gap-2">
        <Input className="w-64" placeholder="Buscar..." type="text" />
        <CustomTooltip content="Filtrar por...">
          <Button size="icon" type="button" variant="default">
            <ListFilter className="h-4 w-4" />
          </Button>
        </CustomTooltip>
      </div>
      <CustomTooltip content="Añadir experiencia">
        <Button size="icon" type="button" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </CustomTooltip>
    </div>
  )
}
