'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { User, workspace } from '@/lib/supabase/supabase.types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
/* import { SelectGroup } from '@radix-ui/react-select';
 */ import { Lock, Share } from 'lucide-react'
import { Button } from '../ui/button'
import { v4 } from 'uuid'
/* import { addCollaborators, createWorkspace } from '@/lib/supabase/queries';
import CollaboratorSearch from './collaborator-search';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '../ui/use-toast'; */
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { createWorkspace } from '@/lib/supabase/queries'

const WorkspaceCreator = () => {
  const { user } = useSupabaseUser()
  /*   const { toast } = useToast();
   */ const router = useRouter()
  const [permissions, setPermissions] = useState('private')
  const [title, setTitle] = useState('')
  const [collaborators, setCollaborators] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /*   const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user])
  } */

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id))
  }

  const createItem = async () => {
    setIsLoading(true)
    const uuid = v4()
    if (user?.id) {
      const newWorkspace: workspace = {
        data: '',
        banner: '',
        createdAt: new Date().toISOString(),
        iconId: '💼',
        id: uuid,
        inTrash: '',
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: '',
      }
      if (permissions === 'private') {
        /*         toast({ title: 'Success', description: 'Created the workspace' });
         */ await createWorkspace(newWorkspace)
        router.refresh()
      }
      if (permissions === 'shared') {
        /*         toast({ title: 'Success', description: 'Created the workspace' })
         */ await createWorkspace(newWorkspace)
        /*         await addCollaborators(collaborators, uuid);
         */ router.refresh()
      }
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <Label htmlFor='name' className='text-sm text-muted-foreground'>
          Name
        </Label>
        <div
          className='flex 
        items-center 
        justify-center 
        gap-2
        '
        >
          <Input
            name='name'
            value={title}
            placeholder='Workspace Name'
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
        </div>
      </div>
      <>
        <Label
          htmlFor='permissions'
          className='text-sm
          text-muted-foreground'
        >
          Permission
        </Label>
        <Select
          onValueChange={(val: any) => {
            setPermissions(val)
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className='h-26 -mt-3 w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <div>
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
                      Your workspace is private to you. You can choose to share
                      it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value='shared'>
                <div className='flex items-center justify-center gap-4 p-2'>
                  <Share></Share>
                  <article className='flex flex-col text-left'>
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </div>
          </SelectContent>
        </Select>
      </>
      {permissions === 'shared' && (
        <div>
          {/* <CollaboratorSearch
            existingCollaborators={collaborators}
            getCollaborator={(user) => {
              addCollaborator(user);
            }}
          >
            <Button
              type="button"
              className="text-sm mt-4"
            >
              <Plus />
              Add Collaborators
            </Button>
          </CollaboratorSearch> */}
          <div className='mt-4'>
            <span className='text-sm text-muted-foreground'>
              Collaborators {collaborators.length || ''}
            </span>
            <div
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
                      onClick={() => removeCollaborator(c)}
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
            </div>
          </div>
        </div>
      )}
      <Button
        type='button'
        disabled={
          !title ||
          (permissions === 'shared' && collaborators.length === 0) ||
          isLoading
        }
        variant={'secondary'}
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  )
}

export default WorkspaceCreator
