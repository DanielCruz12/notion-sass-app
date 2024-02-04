/* eslint-disable no-unused-vars */
import { useAppState } from '@/lib/providers/state-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

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
}) => {
    const supabase = createClientComponentClient()
    const { state, dispatch, workspaceId } = useAppState()
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    //folder title synced with server data and local
  //fileTitle
  //navigate the user to a different page
  //add a file
  //double click handler
  //blur
  //onChanges
  //move to trash

  return <div>Dropdown</div>
}

export default Dropdown
