/* eslint-disable no-unused-vars */
'use client'

import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { useToast } from '../ui/use-toast'
import { useAppState } from '@/lib/providers/state-provider'
import { useRef, useState } from 'react'
import { User, workspace } from '@/lib/supabase/supabase.types'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Briefcase } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'

const SettingsForm = () => {
  const { toast } = useToast()
  const { user } = useSupabaseUser()
  const router = useRouter()
  const { state, workspaceId, dispatch } = useAppState()
  const [permission, setPermissions] = useState('private')
  const [collaborators, setCollaborators] = useState<User[] | []>([])
  const supabase = createClientComponentClient()
  const [openAlertMessage, setOpenAlertMessage] = useState(false)
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace | null>(
    null
  )
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [uploadingPictureProfile, setUploadingPictureProfile] = useState(false)

  const handleWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    if (!workspaceId || !e.target.value) return
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: { workspace: { title: e.target.value }, workspaceId },
    })
  }
  return (
    <div className='flex flex-col gap-4'>
      <p className='mt-6 flex items-center gap-2'>
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className='flex flex-col gap-2'>
        <label className='text-sm' htmlFor='workspaceName'>
          Name
        </label>
        <input
          type='text'
          className='rounded-md py-2'
          value={workspaceDetails ? workspaceDetails.title : ''}
          name='workspaceName'
          placeholder='Workspace name'
          onChange={handleWorkspace}
        />
      </div>
    </div>
  )
}

export default SettingsForm
