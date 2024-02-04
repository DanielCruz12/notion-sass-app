'use client'

import { useAppState } from '@/lib/providers/state-provider'
import { useEffect, useState } from 'react'
import TooltipComponent from '../global/tooltip-component'
import { PlusIcon } from 'lucide-react'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { Folder } from '@/lib/supabase/supabase.types'
import { v4 } from 'uuid'
import { createFolder } from '@/lib/supabase/queries'
import { useToast } from '../ui/use-toast'
import { Accordion } from '../ui/accordion'

type FoldersDropdownListProps = {
  workspaceFolders: any
  workspaceId: any
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  const { state, dispatch, folderId } = useAppState()
  const [folders, setFolders] = useState(workspaceFolders)
  const { subscription } = useSupabaseUser()
  const { toast } = useToast()

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: 'SET_FOLDERS',
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder: any) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id)?.files || [],
          })),
        },
      })
    }
  }, [dispatch, state.workspaces, workspaceFolders, workspaceId])

  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    )
  }, [state.workspaces, workspaceId])

  const addFolderHandler = async () => {
    if (folders.length >= 3 && !subscription) {
    }
    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      iconId: '📄',
      inTrash: null,
      workspaceId,
      bannerUrl: '',
    }
    dispatch({
      type: 'ADD_FOLDER',
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    })
    const { error } = await createFolder(newFolder)
    if (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Could not create the folder',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Created folder.',
      })
    }
  }

  return (
    <div
      className='group/title text-Neutrals/neutrals-8 sticky top-0 z-20 flex h-10 w-full 
  items-center 
  justify-between 
  bg-background 
  '
    >
      <>
      <span className='text-xs font-bold'>Folders</span>
        <TooltipComponent message='Create folder'>
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className='hidden
            cursor-pointer 
            group-hover/title:inline-block
          '
          />
        </TooltipComponent>
      <Accordion
        type='multiple'
        defaultValue={[folderId || '']}
        className='pb-20'
      >
        {folders
          .filter((folder: Folder) => !folder.inTrash)
          .map((folder: Folder) => (
            <div key={folder.id}></div>
          ))}
      </Accordion>
      </>
    </div>
  )
}

export default FoldersDropdownList
