import { getFolders, getUserSuscriptionStatus } from '@/lib/supabase/queries'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
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
  return <div>Sidebar</div>
}

export default Sidebar
