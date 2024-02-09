/* eslint-disable no-unused-vars */
'use client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ScrollArea } from '../ui/scroll-area'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { useToast } from '../ui/use-toast'
import { useAppState } from '@/lib/providers/state-provider'
import { useEffect, useRef, useState } from 'react'
import { User, workspace } from '@/lib/supabase/supabase.types'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Briefcase, Lock, Plus, Share } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'
import { Input } from '../ui/input'
import { v4 } from 'uuid'
import {
  addCollaborators,
  deleteWorkspace,
  getCollaborators,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  removeCollaborators,
  updateWorkspace,
} from '@/lib/supabase/queries'
import CollaboratorSearch from '../global/collaborators-search'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'

const SettingsForm = () => {
  const { toast } = useToast()
  const { user, subscription } = useSupabaseUser()
  const router = useRouter()
  const { state, workspaceId, dispatch } = useAppState()
  const [collaborators, setCollaborators] = useState<User[] | []>([])
  const supabase = createClientComponentClient()
  const [permissions, setPermissions] = useState('private')
  const [openAlertMessage, setOpenAlertMessage] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const [uploadingPictureProfile, setUploadingPictureProfile] = useState(false)
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace | null>(
    null
  )

  const handleWorkspace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: { workspace: { title: e.target.value }, workspaceId },
    })
  }

  const redirectCustomPortals = async () => {
    setLoadingPortal(true)
    try {
      /*  const { url, error } = await postData({
        url: 'api/create-portal-link',
      }) */
      window.location.assign('url') /* pass correct url */
    } catch (error) {
      setLoadingPortal(false)
      console.log(error)
    }
    setLoadingPortal(false)
  }

  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return
    if (collaborators.length === 1) {
      setPermissions('private')
    }
    await removeCollaborators([user], workspaceId)
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    )
    router.refresh()
  }

  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return
    if (subscription?.status !== 'active' && collaborators.length >= 2) {
      setOpenAlertMessage(true)
      return
    }
    await addCollaborators([profile], workspaceId)
    setCollaborators([...collaborators, profile])
  }

  const onClickAlertConfirm = async () => {
    if (!workspaceId) return
    if (collaborators.length > 0) {
      await removeCollaborators(collaborators, workspaceId)
    }
    setPermissions('private')
    setOpenAlertMessage(false)
  }

  const onPermissionsChange = (val: string) => {
    if (val === 'private') {
      setOpenAlertMessage(true)
    } else setPermissions(val)
  }

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return
    dispatch({
      type: 'UPDATE_WORKSPACE',
      payload: { workspace: { title: e.target.value }, workspaceId },
    })
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current)
    titleTimerRef.current = setTimeout(async () => {
      console.log('do something')
    }, 500)
  }

  const handleDeleteWorkspace = async () => {
    if (!workspaceId) return
    await deleteWorkspace(workspaceId)
    toast({ title: 'Successfully deleted your workspace' })
    dispatch({ type: 'DELETE_WORKSPACE', payload: workspaceId })
    router.replace('/dashboard')
  }

  useEffect(() => {
    const showingWorkspace = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )
    if (showingWorkspace) setWorkspaceDetails(showingWorkspace)
   /*  if (!user?.id) return
    getPrivateWorkspaces(user.id)
    getSharedWorkspaces(user.id) */
  }, [workspaceId, state, user?.id])

  useEffect(() => {
    if (!workspaceId) return
    const fetchCollaborators = async () => {
      const response = await getCollaborators(workspaceId)
      if (response.length) {
        setPermissions('shared')
        setCollaborators(response)
      }
    }
    fetchCollaborators()
   /*  if (!user?.id) return
    getPrivateWorkspaces(user.id)
    getSharedWorkspaces(user.id) */
  }, [workspaceId, user])

  const onChangeWorkspaceLogo = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!workspaceId) return
    const file = e.target.files?.[0]
    if (!file) return
    const uuid = v4()
    setUploadingPictureProfile(true)
    const { data, error } = await supabase.storage
      .from('workspace-logos')
      .upload(`workspaceLogo.${uuid}`, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (!error) {
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: { workspace: { logo: data.path }, workspaceId },
      })
      await updateWorkspace({ logo: data.path }, workspaceId)
      setUploadingPictureProfile(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <p className='mt-6 flex items-center gap-2 text-white'>
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className='flex flex-col gap-2'>
        <label className='text-sm text-white' htmlFor='workspaceName'>
          Name
        </label>
        <Input
          type='text'
          value={workspaceDetails ? workspaceDetails.title : ''}
          name='workspaceName'
          placeholder='Workspace name'
          onChange={handleWorkspace}
        />

        <label className='pt-3 text-sm text-white' htmlFor='workspaceLogo'>
          Workspace Logo
        </label>
        <Input
          type='file'
          name='workspaceName'
          accept='image/*'
          placeholder='Workspace logo'
          onChange={onChangeWorkspaceLogo}
          disabled={uploadingPictureProfile}
        />

        {subscription?.status !== 'active' && (
          <small>
            To customize your workspace, you need to be on a Pro Plan
          </small>
        )}
      </div>
      <Label htmlFor='permissions' className='pb-2 pt-3 text-sm text-white '>
        Permission
      </Label>
      <Select
        onValueChange={(val) => {
          setPermissions(val)
        }}
        defaultValue={permissions}
      >
        <SelectTrigger className='h-26 w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='private'>
              <div
                className='flex
                  items-center
                  justify-center
                  gap-4
                  p-2
                '
              >
                <Lock />
                <article className='flex flex-col text-left'>
                  <span>Private</span>
                  <p>
                    Your workspace is private to you. You can choose to share it
                    later.
                  </p>
                </article>
              </div>
            </SelectItem>
            <SelectItem value='shared'>
              <div className='flex items-center justify-center gap-4 p-2'>
                <Share />
                <article className='flex flex-col text-left'>
                  <span>Shared</span>
                  <span>You can invite collaborators.</span>
                </article>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {permissions === 'shared' && (
        <div>
          <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborator={(user) => {
              addCollaborator(user)
            }}
          >
            <Button type='button' className='mt-4 text-sm'>
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch>
          <div className='mt-4'>
            <span className='text-sm text-muted-foreground'>
              Collaborators {collaborators.length || ''}
            </span>
            <ScrollArea
              className='
            h-[120px]
            w-full
            overflow-y-scroll
            rounded-md
            border
            border-muted-foreground/20'
            >
              {collaborators.length ? (
                collaborators.map((c) => (
                  <div
                    className='flex items-center
                      justify-between
                      p-4
                '
                    key={c.id}
                  >
                    <div className='flex items-center gap-4'>
                      <Avatar>
                        <AvatarImage src='/avatars/7.png' />
                        <AvatarFallback>PJ</AvatarFallback>
                      </Avatar>
                      <div
                        className='w-[140px] 
                          gap-2
                          overflow-hidden
                          overflow-ellipsis
                          text-sm
                          text-muted-foreground
                          sm:w-[300px]
                        '
                      >
                        {c.email}
                      </div>
                    </div>
                    <Button
                      variant='secondary'
                      onClick={() => {
                        removeCollaborator(c)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  className='absolute
                  bottom-0 left-0
                  right-0
                  top-0
                  flex
                  items-center
                  justify-center
                '
                >
                  <span className='text-sm text-muted-foreground'>
                    You have no collaborators
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}

      {/* alert */}
      <Alert variant={'destructive'}>
        <AlertDescription>
          <Button
            type='submit'
            size={'sm'}
            variant={'destructive'}
            className='mt-4  border-2
            border-destructive 
            bg-destructive/40 
            text-sm'
            onClick={handleDeleteWorkspace}
          >
            Delete workspace
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default SettingsForm
