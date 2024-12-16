import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from 'react-router-dom'

export function TruncatedText({ text, maxLength = 30 }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (text.length <= maxLength) {
    return <span>{text}</span>
  }

  const displayText = isExpanded ? text : `${text.slice(0, maxLength)}...`

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal"
            // onClick={() => setIsExpanded(!isExpanded)}
          >
            {displayText}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p><Link className='cursor-pointer' to={text} > {text} </Link> </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

