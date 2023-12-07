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
  const [workspaceLogo, setWorkspaceLogo] = useState('/cypresslogo.svg')
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
      p-2 
      transition-all 
      hover:bg-muted'
    >
      <Image
        src={workspaceLogo}
        alt='workspace logo'
        width={26}
        height={26}
        objectFit='cover'
      />
      <div className='flex flex-col'>
        <p
          className='w-[170px] 
        overflow-hidden 
        overflow-ellipsis 
        whitespace-nowrap 
        text-lg'
        >
          {workspace.title}
        </p>
      </div>
    </Link>
  )
}

export default SelectedWorkspace
