/* eslint-disable no-unused-vars */
'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { User } from '@/lib/supabase/supabase.types'
import React, { useEffect, useRef, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { getUsersFromSearch } from '@/lib/supabase/queries'

interface CollaboratorSearchProps {
  existingCollaborators: User[] | []
  getCollaborator: (collaborator: User) => void
  children: React.ReactNode
}

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  children,
  existingCollaborators,
  getCollaborator,
}) => {
  const { user } = useSupabaseUser()
  const [searchResults, setSearchResults] = useState<User[] | []>([])
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  /*   const getUserData = ()=>{}
   */
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const res = await getUsersFromSearch(e.target.value)
      setSearchResults(res)
    }, 250)
  }

  const addCollaborator = (user: User) => {
    getCollaborator(user)
  }

  return (
    <Sheet>
      <SheetTrigger className='w-full'>{children}</SheetTrigger>
      <SheetContent className='w-[400px] sm:w-[540px]'>
        <SheetHeader>
          <SheetTitle>Search Collaborator</SheetTitle>
          <SheetDescription>
            You can also remove collaborators after adding them from the
            settings tab.
          </SheetDescription>
        </SheetHeader>
        <div
          className='mt-2 flex
          items-center
          justify-center
          gap-2
        '
        >
          <Search />
          <Input
            name='name'
            className=''
            placeholder='Email'
            onChange={onChangeHandler}
          />
        </div>
        <ScrollArea
          className='mt-6
          w-full
          overflow-auto rounded-md'
        >
          {searchResults
            .filter(
              (result) =>
                !existingCollaborators.some(
                  (existing) => existing.id === result.id
                )
            )
            .filter((result) => result.id !== user?.id)
            .map((user) => (
              <div
                key={user.id}
                className=' flex items-center justify-between p-4'
              >
                <div className='flex items-center gap-4'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src='' />
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div
                    className='w-[180px] 
                  gap-2 
                  
                  text-sm 
                  '
                  >
                    {user.email}
                  </div>
                </div>
                <Button
                  variant='secondary'
                  onClick={() => addCollaborator(user)}
                >
                  Add user
                </Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CollaboratorSearch
