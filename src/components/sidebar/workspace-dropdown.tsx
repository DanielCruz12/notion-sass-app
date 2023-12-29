'use client'
import { useAppState } from '@/lib/providers/state-provider'
import { workspace } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedWorkspace from './selected-workspace'
import CustomDialogTrigger from '../global/custom-dialog-trigger'
import WorkspaceCreator from '../global/workspace-creator'

interface WorkspaceDropdownProps {
  privateWorkspaces: any
  sharedWorkspaces: any
  collaboratingWorkspaces: any
  defaultValue?: any
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  collaboratingWorkspaces,
  sharedWorkspaces,
  defaultValue,
}) => {
  const { dispatch, state } = useAppState()
  const [selectedOption, setSelectedOption] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: 'SET_WORKSPACES',
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      })
    }
  }, [
    privateWorkspaces,
    collaboratingWorkspaces,
    sharedWorkspaces,
    state.workspaces.length,
    dispatch,
  ])

  const handleSelect = (option: workspace) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  useEffect(() => {
    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultValue?.id
    )
    if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace)
  }, [state, defaultValue])

  return (
    <div className='text-center'>
      <div>
        <div onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            <span>Select a workspaces</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className='group
          z-50
          mt-4
          rounded-md
          border-[1px] border-muted
          bg-black/10
          shadow-md
      '
        >
          <div className=' flex h-[300px] w-full flex-col rounded-md '>
            <div className='overflow-y-scroll'>
              {!!privateWorkspaces.length && (
                <div className='px-3'>
                  <p className='text-gray-300'>Private</p>
                  <hr></hr>
                  {privateWorkspaces.map((option: workspace) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              )}
              {!!sharedWorkspaces.length && (
                <div className='px-3'>
                  <p className='text-muted-foreground'>Shared</p>
                  <hr />
                  {sharedWorkspaces.map((option: workspace) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              )}
              {!!collaboratingWorkspaces.length && (
                <div className='px-3'>
                  <p className='text-muted-foreground'>Collaborating</p>
                  <hr />
                  {collaboratingWorkspaces.map((option: workspace) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              )}
            </div>
            <CustomDialogTrigger
              header='Create A Workspace'
              content={<WorkspaceCreator />}
              description='Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too.'
            >
              <div
                className='flex 
              w-full 
              items-center 
              justify-center gap-2
              p-2 
              transition-all 
              hover:bg-muted '
              >
                <article
                  className='flex 
                h-4
                 w-4 
                 items-center 
                 justify-center 
                 rounded-full 
                 bg-slate-800 
                 '
                >
                  +
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkspaceDropdown
