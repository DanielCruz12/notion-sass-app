/* eslint-disable no-unused-vars */
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import { cookies } from 'next/headers'
import {
  getCollaboratoratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSuscriptionStatus,
} from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import WorkspaceDropdown from './workspace-dropdown'
/* import PlanUsage from './plan-usage';
import NativeNavigation from './native-navigation';
import { ScrollArea } from '../ui/scroll-area';
import FoldersDropdownList from './folders-dropdown-list';
import UserCard from './user-card';
 */
interface SidebarProps {
  params: { workspaceId: string }
  className?: string
}

const Sidebar: React.FC<SidebarProps> = async ({ params, className }) => {
  const supabase = createServerComponentClient({ cookies })
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  //subscr
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSuscriptionStatus(user.id)

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  )
  //error
  /*    if (subscriptionError || foldersError) redirect('/dashboard')
   */
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratoratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ])

  //get all the different workspaces private collaborating shared
  return (
    <aside
      className={twMerge(
        'hidden w-[280px] shrink-0 !justify-between p-4 sm:flex sm:flex-col md:gap-4',
        className
      )}
    >
      pepe
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceId)}
        />
        {/*   <PlanUsage
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
        /> */}
        {/*         <NativeNavigation myWorkspaceId={params.workspaceId} />
         */}{' '}
        <div
          className=' h-[450px]
          overflow-hidden
        '
        >
          <div
            className='pointer-events-none  
          bottom-0 
          z-40 
          h-20 
          w-full 
          bg-gradient-to-t 
          from-background 
          to-transparent'
          />
          {/* <FoldersDropdownList
            workspaceFolders={workspaceFolderData || []}
            workspaceId={params.workspaceId}
          /> */}
        </div>
      </div>
      {/*       <UserCard subscription={subscriptionData} />
       */}{' '}
    </aside>
  )
}

export default Sidebar
