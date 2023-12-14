/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

'use client'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import type { User } from '@/lib/supabase/supabase.types'
import { useEffect, useRef, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
type CollaboratorsSearchProps = {
  existingCollaborators: User[] | []
  getCollaborator: () => void
  children: React.ReactNode
}
const CollaboratorsSearch: React.FC<CollaboratorsSearchProps> = ({
  children,
}) => {
  const { user } = useSupabaseUser()
  const [searchResults, setSearchResults] = useState<User[] | []>([])
  const timeRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current)
      }
    }
  }, [])

  const onChangeHandler = () => {
    
  }

  const addCollaborator = () => {

  }

  return <Sheet>
    <SheetTrigger>
    
    </SheetTrigger>
  </Sheet>
}

export default CollaboratorsSearch
