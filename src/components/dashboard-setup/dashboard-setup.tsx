import { AuthUser } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'

type DashboardSetupProps = {
  user?: AuthUser
  subscription?: {} | null
}
const DashboardSetup: React.FC<DashboardSetupProps> = (
  {
    /*  user,
  subscription, */
  }
) => {
  return (
    <Card>
      <CardHeader>Create a workspace</CardHeader>
      <CardDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga, facilis
        et? Ipsa officia atque qui, odio, nisi nesciunt, consectetur alias
        facere repellat enim perferendis veritatis libero. Hic autem odio
        voluptatibus dolores
      </CardDescription>
      <CardContent>
        <form onSubmit={() => {}}>
          <div className='flex flex-col gap-4'></div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DashboardSetup
