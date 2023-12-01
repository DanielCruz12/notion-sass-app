import db from '@/lib/supabase/db'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardSetup from '@/components/dashboard-setup/dashboard-setup'

const Dashboard = async () => {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const workspace = await db.query.workspaces.findFirst({
    where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id),
  })
  if (!workspace)
    return (
      <div className='flex items-center justify-center bg-background'>
        <DashboardSetup />
      </div>
    )
  redirect(`/dashboard/${workspace.id}`)
}

export default Dashboard
