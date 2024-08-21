import type { ReactNode } from 'react'

import { TooltipProvider, TooltipTrigger, Tooltip, TooltipContent } from '../ui/tooltip'

export function CustomTooltip({ children, content }: Readonly<{ children: ReactNode; content: string }>) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <span>{content}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
