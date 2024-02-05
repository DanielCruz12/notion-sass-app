'use client'

/* eslint-disable no-unused-vars */
import { useAppState } from '@/lib/providers/state-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { updateFolder } from '@/lib/supabase/queries'
import React, { useMemo, useState } from 'react'
import { AccordionItem, AccordionTrigger } from '../ui/accordion'
import clsx from 'clsx'
import EmojiPicker from '../global/emoji-picker'
import TooltipComponent from '../global/tooltip-component'
import { PlusIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

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
  const { toast } = useToast()
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
  const folderTitle: string | undefined = useMemo(() => {
    if (listType === 'folder') {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === id)?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  }, [id, listType, state.workspaces, title, workspaceId])

  //fileTitle
  const fileTitle: string | undefined = useMemo(() => {
    if (listType === 'file') {
      const fileAndFolderId = id.split('folder')
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title
      if (title === stateTitle || !stateTitle) return title
      return stateTitle
    }
  }, [state, listType, workspaceId, id, title])

  //* navigate the user to a different page
  const navigateToPage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`)
    }
    if (type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`)
    }
  }

  //* double click handler
  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  //* blur
  const handleBlur = async () => {
    setIsEditing(false)
    const fId = id.split('folder')
    if (fId?.length === 1) {
      if (!folderTitle) return
      await updateFolder({ title }, fId[0])
    }

    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return
    }
  }

  //* onChanges
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return
    if (listType === 'folder') {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          workspaceId,
          folderId: id,
          folder: { iconId: selectedEmoji },
        },
      })
      const { data, error } = await updateFolder({ iconId: selectedEmoji }, id)
      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Could not update the emoji for this folder',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Update emoji for the folder',
        })
      }
    }
  }

  //* move to trash
  const handleMoveToTrash = () => {}

  const folderTitleChange = (e: any) => {
    if (!workspaceId) return
    const fid = id.split('folder')
    if (fid.length === 1) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { title: e.target.value },
          folderId: fid[0],
          workspaceId,
        },
      })
    }
  }

  //* add a file
  const fileTitleChange = (e: any) => {
    if (!workspaceId || !folderId) return
    const fid = id.split('folder')
    if (fid.length === 2 && fid[1]) {
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          file: { title: e.target.value },
          folderId,
          workspaceId,
          fileId: fid[1],
        },
      })
    }
  }

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
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type='text'
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'text-Neutrals/neutrals-7 w-[140px] overflow-hidden outline-none',
                {
                  'cursor-text bg-muted': isEditing,
                  'cursor-pointer bg-transparent': !isEditing,
                }
              )}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === 'folder' ? folderTitleChange : fileTitleChange
              }
              readOnly={!isEditing}
            />
          </div>
          <div className='group-hover:/file:block absolute right-0 hidden h-full items-center justify-center gap-2 rounded-sm'>
            <TooltipComponent message='Delete folder'>
              <Trash
                size={15}
                className='dark:text-Neutrals/neutrals-7 transition-colors hover:dark:text-white'
              />
            </TooltipComponent>
            {listType === 'folder' && !isEditing && (
              <TooltipComponent message='Add file'>
                <PlusIcon
                  size={15}
                  className='dark:text-Neutrals/neutrals-7 transition-colors hover:dark:text-white'
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown
