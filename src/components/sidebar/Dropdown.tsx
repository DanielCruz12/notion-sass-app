'use client'

/* eslint-disable no-unused-vars */
import { useAppState } from '@/lib/providers/state-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { AccordionItem, AccordionTrigger } from '../ui/accordion'
import clsx from 'clsx'
import EmojiPicker from '../global/emoji-picker'

type DropDownProps = {
  title: string
  id: string
  listType: 'folder' | 'file'
  iconId: string
  children?: React.ReactNode
  disabled?: boolean
  customIcon?: React.ReactNode
}

const Dropdown: React.FC<DropDownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  customIcon,
  ...props
}) => {
  const supabase = createClientComponentClient()
  const { state, dispatch, workspaceId, folderId } = useAppState()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const isFolder = listType === 'folder'
  const groupIdentifies = useMemo(() => {
    return clsx(
      'dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',
      {
        'group/folder': isFolder,
        'group/file': !isFolder,
      }
    )
  }, [isFolder])
  const listStyles = useMemo(() => {
    return clsx('relative', {
      'border-none': isFolder,
      'border-none m-6 text-[16px] py-1': !isFolder,
    })
  }, [isFolder])
  //folder title synced with server data and local
  //fileTitle
  //navigate the user to a different page
  const navigateToPage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`)
    }
    if (type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`)
    }
  }

  const onchangeEmoji = async (selectedEmoji: string) => {
    if (listType === 'folder') {
    }
  }
  //add a file
  //double click handler
  //blur
  //onChanges
  //move to trash

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation()
        navigateToPage(id, listType)
      }}
    >
      <AccordionTrigger
        id={listType}
        className='p-2 
        text-sm 
        hover:no-underline 
        dark:text-muted-foreground'
        disabled={listType === 'file'}
      >
        <div className={groupIdentifies}>
          <div
            className='flex 
          items-center 
          justify-center 
          gap-4 
          overflow-hidden'
          >
            <div className='relative'>
              <EmojiPicker getValue={onchangeEmoji}>{iconId}</EmojiPicker>
            </div>
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown
