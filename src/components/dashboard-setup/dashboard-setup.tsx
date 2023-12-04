'use client'

import { z } from 'zod'
import { useState } from 'react'
import EmojiPicker from '../global/emoji-picker'
import { AuthUser } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import Loader from '../Loader'
import { Label } from '../ui/label'
import { CreateWorkspaceFormSchema } from '@/lib/types/types'
import { Subscription } from '@/lib/supabase/supabase.types'

type DashboardSetupProps = {
  user: AuthUser
  subscription: Subscription | null
}
const DashboardSetup: React.FC<DashboardSetupProps> = ({ subscription }) => {
  const [selectedEmoji, setSelectedEmoji] = useState('💼')

  const {
    register,
    handleSubmit,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: 'onChange',
    defaultValues: { logo: '', workspaceName: '' },
  })

  const onSubmit = (val: any) => {
    console.log(val)
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
