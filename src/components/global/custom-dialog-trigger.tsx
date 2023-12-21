import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import clsx from 'clsx'
import { ScrollArea } from '../ui/scroll-area'

type CustomDialogTriggerProps = {
  header?: string
  content?: React.ReactNode
  children: React.ReactNode
  description?: string
  className?: string
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  header,
  content,
  children,
  description,
  className,
}) => {
  return (
    <Dialog>
      <DialogTrigger className={clsx('', className)}>{children}</DialogTrigger>
      <ScrollArea
        className='
            w-full
            overflow-y-scroll
            rounded-md
            border
            border-muted-foreground/20'
      >
        <DialogContent className='w-full'>
          <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </ScrollArea>
    </Dialog>
  )
}

export default CustomDialogTrigger
