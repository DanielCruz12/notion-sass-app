import Sidebar from '@/components/sidebar/Sidebar'
import MobileSidebar from '@/components/sidebar/mobile-sidebar'

type LayoutProps = {
  children: React.ReactNode
  params?: any
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  return (
    <main className='flex h-screen w-screen overflow-hidden'>
      <Sidebar params={params} />
      <MobileSidebar>
        <Sidebar params={params} className='inline-block w-screen sm:hidden ' />
      </MobileSidebar>
      <div className='relative w-full overflow-hidden'>
        {children}
      </div>
    </main>
  )
}

export default Layout
