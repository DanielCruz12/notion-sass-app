import Header from '@/components/lading-page/header'
import React from 'react'

type HomePageLayoutProps = {
  children: React.ReactNode
}

const HomePageLayout: React.FC<HomePageLayoutProps> = ({ children }) => {
  return (
    <main className='overflow-hidden'>
      <Header />
      {children}
    </main>
  )
}

export default HomePageLayout
