/* eslint-disable no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import { useAppState } from '@/lib/providers/state-provider'
import { workspace } from '@/lib/supabase/supabase.types'
import SelectedWorkspace from './selected-workspace'

type WorkSpaceDropdrownProps = {
  sharedWorkspaces?: any
  privateWorkspaces?: any
  collaboratingWorkspaces?: any
  defaultValue?: any
}
const WorkspaceDropdown: React.FC<WorkSpaceDropdrownProps> = ({
  sharedWorkspaces,
  privateWorkspaces,
  collaboratingWorkspaces,
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
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      })
    }
  }, [
    sharedWorkspaces,
    privateWorkspaces,
    collaboratingWorkspaces,
    state.workspaces.length,
    dispatch,
  ])

  const handleSelected = (option: workspace) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block text-left'>
      <div>
        <span
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          {selectedOption ? (
            <SelectedWorkspace
              workspace={selectedOption}
              onClick={() => handleSelected}
            />
          ) : null}
        </span>
      </div>
      {isOpen && (
        <div className='bordeer-[1px] group absolute z-50 h-[190px] w-full origin-top-right overflow-scroll rounded-md border-muted bg-black/10 shadow-md backdrop-blur-lg'>
           
        </div>
      )}
    </div>
  )
}

export default WorkspaceDropdown
