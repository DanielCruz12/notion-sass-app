import {
  getCollaboratoratingWorkspaces,
  getFolders,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  getUserSuscriptionStatus,
} from '@/lib/supabase/queries'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { twMerge } from 'tailwind-merge'
import WorkspaceDropdown from './workspace-dropdown'
/* import { redirect } from 'next/navigation'
 */
type TSideBarProps = {
  params: any
  classN?: any
}
const Sidebar: React.FC<TSideBarProps> = async ({ params }) => {
  const supabase = createServerComponentClient({ cookies })
  //*user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  const { data: subscription, error: subscriptionError } =
    await getUserSuscriptionStatus(user.id)

  //*folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceId
  )
  /*  if (subscriptionError || foldersError) {
    redirect('/dashboard')
  } */

  console.log(
    subscription,
    workspaceFolderData,
    subscriptionError,
    foldersError
  )
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratoratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ])

  return (
    <aside
      className={twMerge(
        'hidden w-[128px] shrink-0 !justify-between p-4 sm:flex sm:flex-col md:gap-4'
      )}
    >
      <div>
        <WorkspaceDropdown
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          privateWorkspaces={privateWorkspaces}
         /*  defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces,
          ].find((workspace) => workspace.id === params.workspaceId)} */
        ></WorkspaceDropdown>
      </div>
    </aside>
  )
}

export default Sidebar
