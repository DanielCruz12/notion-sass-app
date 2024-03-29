/* eslint-disable no-unused-vars */

import React from 'react'
import { cookies } from 'next/headers'
import {
  getCollaboratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSubscriptionStatus,
} from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import WorkspaceDropdown from './workspace-dropdown'
import { ScrollArea } from '../ui/scroll-area'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import PlanUsage from './plan-usage'
import NativeNavigation from './native-navigation'
import FoldersDropdownList from './folder-dropdown-list'

interface SidebarProps {
  params: { workspaceId: string }
  className?: string
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id)

  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  )

  if (subscriptionError || foldersError) redirect('/dashboard')

  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ])

  return (
    <aside
      className={twMerge(
        'hidden w-[280px] shrink-0 !justify-between p-4 sm:flex sm:flex-col md:gap-4',
        className
      )}
    >
      <div>
        <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        />
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={
            privateWorkspaces && sharedWorkspaces && collaboratingWorkspaces
              ? [
                  ...privateWorkspaces,
                  ...sharedWorkspaces,
                  ...collaboratingWorkspaces,
                ].find((workspace) => workspace.id === params.workspaceId) || []
              : []
          }
        />

        <NativeNavigation myWorkspaceId={params.workspaceId} className='' />
        <ScrollArea
          className=' h-[470px] w-full overflow-auto
          rounded-md'
        >
          <div
            className='pointer-events-none 
          absolute 
          bottom-0 
          z-40 
          h-20 
          w-full 
          bg-gradient-to-t 
          from-background 
          to-transparent'
          />
          <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          />
        </ScrollArea>
      </div>
      {/*       <UserCard subscription={subscriptionData} />
       */}
    </aside>
  )
}

export default Sidebar
