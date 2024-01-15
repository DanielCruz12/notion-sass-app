'use client'

import { useAppState } from '@/lib/providers/state-provider'
import { useEffect, useState } from 'react'
import TooltipComponent from '../global/tooltip-component'
import { PlusIcon } from 'lucide-react'

type FoldersDropdownListProps = {
  workspaceFolders: any
  workspaceId: any
}

const FoldersDropdownList: React.FC<FoldersDropdownListProps> = ({
  workspaceFolders,
  workspaceId,
}) => {
  const { state, dispatch } = useAppState()
  const [folders, setFolders] = useState(workspaceFolders)

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
  console.log(folders)

  const addFolderHandler = () => {
    alert('s')
  }

  return (
    <div
      className='group/title text-Neutrals/neutrals-8 sticky top-0 z-20 flex h-10 w-full 
  items-center 
  justify-between 
  bg-background 
  pr-4'
    >
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
    </div>
  )
}

export default FoldersDropdownList
