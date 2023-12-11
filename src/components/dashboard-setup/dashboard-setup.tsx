/* eslint-disable no-unused-vars */
'use client'
import { AuthUser } from '@supabase/supabase-js'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { v4 } from 'uuid'

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import EmojiPicker from '../global/emoji-picker'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Subscription, workspace } from '@/lib/supabase/supabase.types'
import { Button } from '../ui/button'
import { createWorkspace } from '@/lib/supabase/queries'
/* import { useToast } from '../ui/use-toast';
 */ import { useRouter } from 'next/navigation'
import { useAppState } from '@/lib/providers/state-provider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { z } from 'zod'
import Loader from '../Loader'
import { CreateWorkspaceFormSchema } from '@/lib/types/types'
type DashboardSetupProps = {
  user: AuthUser
  subscription: Subscription | null
}
const DashboardSetup: React.FC<DashboardSetupProps> = ({
  subscription,
  user,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState('💼')
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { dispatch } = useAppState()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: 'onChange',
    defaultValues: { logo: '', workspaceName: '' },
  })

  const onSubmit: SubmitHandler<
    z.infer<typeof CreateWorkspaceFormSchema>
  > = async (value) => {
    const file = value.logo?.[0]
    let filePath = null
    const workspaceUUID = v4()

    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from('workspace-logos')
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            cacheControl: '3600',
            upsert: true,
          })
        if (error) throw new Error('')
        filePath = data.path
      } catch (error) {
        console.log('Error', error)
        /*   toast({
        variant: 'destructive',
        title: 'Error! Could not upload your workspace logo',
      }); */
      }
    }
    try {
      const newWorkspace: any = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: '',
        title: value.workspaceName,
        workspaceOwner: user.id,
        logo: filePath || null,
        bannerUrl: '',
      }
      const { data, error: createError } = await createWorkspace(newWorkspace)
      if (createError) {
        throw new Error()
      }
      dispatch({
        type: 'ADD_WORKSPACE',
        payload: { ...newWorkspace, folders: [] },
      })

      /*  toast({
        title: 'Workspace Created',
        description: `${newWorkspace.title} has been created successfully.`,
      })  */
      console.log("Workspace Created")

      router.replace(`/dashboard/${newWorkspace.id}`)
    } catch (error) {
      console.log(error, 'Error')
      /*      toast({
        variant: 'destructive',
        title: 'Could not create your workspace',
        description:
          "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
      }) */
    } finally {
      console.log('finally')
      /*  reset() */
    }
  }

  return (
    <Card className='h-screen w-[800px] sm:h-auto '>
      <CardHeader>Create a workspace</CardHeader>
      <CardDescription className='px-3'>
        Create your first workspace to start using Notion for your homeworks
      </CardDescription>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <div
              className='flex
            items-center
            gap-4'
            >
              <div className='pt-4 text-4xl'>
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className='w-full '>
                <Label
                  htmlFor='workspaceName'
                  className='text-sm
                  text-muted-foreground
                '
                >
                  Name
                </Label>
                <Input
                  id='workspaceName'
                  type='text'
                  placeholder='Workspace Name'
                  disabled={isLoading}
                  {...register('workspaceName', {
                    required: 'Workspace name is required',
                  })}
                />
                <small className='text-red-600'>
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label
                htmlFor='logo'
                className='text-sm
                  text-muted-foreground
                '
              >
                Workspace Logo
              </Label>
              <Input
                id='logo'
                type='file'
                accept='image/*'
                placeholder='Workspace Name'
                // disabled={isLoading || subscription?.status !== 'active'}
                {...register('logo', {
                  required: false,
                })}
              />
              <small className='text-red-600'>
                {errors?.logo?.message?.toString()}
              </small>
              {subscription?.status === null ? null : (
                <small className='block py-4 text-muted-foreground'>
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className='self-center md:self-end'>
              <Button variant={'secondary'} disabled={isLoading} type='submit'>
                {!isLoading ? 'Create Workspace' : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DashboardSetup
