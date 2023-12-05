import Sidebar from '@/components/sidebar/Sidebar'

type LayoutProps = {
  children: React.ReactNode
  params?: any
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  return (
    <main className='flex h-screen w-screen overflow-hidden'>
      <Sidebar params={params} />
      <div className='relative w-full overflow-hidden border-l-[1px] dark:border-neutral-700'>
        {children}
      </div>
    </main>
  )
}

export default Layout
