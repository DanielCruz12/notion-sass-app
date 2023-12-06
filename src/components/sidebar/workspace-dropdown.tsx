/* eslint-disable no-unused-vars */
'use client'

import { useAppState } from '@/lib/providers/state-provider'
import React, { useEffect, useState } from 'react'

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

  return <div>WorkspaceDropdown</div>
}

export default WorkspaceDropdown
