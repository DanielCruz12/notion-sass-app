'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { workspace } from '@/lib/supabase/supabase.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface SelectedWorkspaceProps {
  workspace: workspace
  // eslint-disable-next-line no-unused-vars
  onClick?: (option: workspace) => void
}

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({
  workspace,
  onClick,
}) => {
  const supabase = createClientComponentClient()
  const [workspaceLogo, setWorkspaceLogo] = useState('/icons/diamond.svg')
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from('workspace-logos')
        .getPublicUrl(workspace.logo)?.data.publicUrl
      setWorkspaceLogo(path)
    }
  }, [supabase.storage, workspace])
  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace)
      }}
      className='my-2 
      flex 
      cursor-pointer 
      flex-row 
      items-center 
      justify-center 
      gap-4 
      rounded-md 
      bg-slate-600 
      p-2 
      transition-all hover:bg-muted'
    >
      <Image src={workspaceLogo} alt='workspace logo' width={24} height={24} />
      <div className='flex flex-col'>
        <small
          className='
          w-full
        whitespace-nowrap 
        text-sm'
        >
          {workspace.title}
        </small>
      </div>
    </Link>
  )
}

export default SelectedWorkspace
