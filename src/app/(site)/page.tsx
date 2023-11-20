import React from 'react'
import Image from 'next/image'
import TitleSection from '@/components/lading-page/title-section'
import Banner from '../../../public/appBanner.png'
const HomePage = () => {
  return (
    <section>
      <div className='items-center gap-4 overflow-hidden px-4 sm:flex sm:flex-col sm:px-6 md:mt-10 md:justify-center'>
        <TitleSection
          pill='A better workspaces '
          title='Write, plan, share.
          With AI at your side.'
          subheading='Notion is the connected workspace where better, faster work happens.'
        />
        <div className='mt-6 rounded-xl bg-white bg-gradient-to-r from-primary to-blue-600 p-[2px]  sm:w-[300px] '>
          <button className='w-full rounded-[10px] bg-background p-2 text-2xl '>
            Get cypress free
          </button>
        </div>
        <div
          className=' className="md:mt-[-90px]
          relative
          ml-[-50px]
          mt-[-40px]
          flex
          w-[750px]
          items-center
          justify-center
          sm:ml-0
          sm:w-full'
        >
          <Image src={Banner} alt='banner' />
          {/* //* shadow effect for banner  */}
          <div className='absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background '></div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
