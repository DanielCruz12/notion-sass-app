import Header from '@/components/lading-page/header'
import React from 'react'

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='overflow-hidden'>
      <Header />
      {children}
    </main>
  )
}

export default HomePageLayout
