import TitleSection from '@/components/lading-page/title-section'
import React from 'react'

const HomePage = () => {
  return (
    <section>
      <div className='overflow-hidden md:mt-10 items-center gap-4 px-4 sm:flex sm:flex-col sm:px-6 md:justify-center'>
        <TitleSection
          pill='Your workspaces here'
          title='All-in-one collaboration and productivity platform'
        />
      </div>
    </section>
  )
}

export default HomePage
