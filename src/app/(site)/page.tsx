import React, { Fragment } from 'react'
import Image from 'next/image'
import Banner from '../../../public/appBanner.png'
import Cal from '../../../public/cal.png'
import TitleSection from '@/components/lading-page/title-section'
import { CLIENTS } from '@/lib/constants/constants'

const HomePage = () => {
  return (
    <Fragment>
      <section className='items-center gap-4 overflow-hidden px-4 sm:flex sm:flex-col sm:px-6 md:mt-10 md:justify-center'>
        <TitleSection
          pill='A better workspaces '
          title='Write, plan, share.
          With AI at your side.'
          subheading='Notion is the connected workspace where better, faster work happens.'
        />
        <div className='mt-6 rounded-xl bg-white bg-gradient-to-r from-secondary to-blue-800 p-[2px]  sm:w-[300px] '>
          <button className='w-full rounded-[10px] bg-background p-2 text-2xl '>
            Get cypress free
          </button>
        </div>
        <div
          className='relative
          ml-[-50px]
          mt-[-40px]
          flex
          w-[750px]
          items-center
          justify-center
          sm:ml-0
          sm:w-full
          md:mt-[-90px]'
        >
          <Image src={Banner} alt='banner' />
          {/* //* shadow effect for banner  */}
          <div className='absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background '></div>
        </div>
      </section>
      <section className='relative '>
        <div
          className='after:dark:from-brand-dark
          before:dark:from-brand-dark
          flex
          before:absolute
          before:bottom-0
          before:left-0
          before:top-0
          before:z-10
          before:w-20
          before:bg-gradient-to-r
          before:from-background
          before:to-transparent

          after:absolute
          after:bottom-0
          after:right-0
          after:top-0
          after:z-10
          after:w-20
          after:bg-gradient-to-l
          after:from-background
          after:to-transparent 
        '
        >
          {/* //* linear infinite scroll x animation */}
          {[...Array(2)].map((arr) => (
            <div
              key={arr}
              className='animate-slide flex flex-nowrap overflow-hidden'
            >
              {CLIENTS.map((client) => (
                <div
                  key={client.alt}
                  className=' relative m-20 flex w-[200px] shrink-0 items-center'
                >
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    width={150}
                    className='max-w-none object-contain'
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section
        className='relative
        flex
        flex-col
        items-center
        justify-center
        px-4
        sm:px-6
      '
      >
        <div
          className='top-22
          absolute
          -z-10
          h-32
          w-[30%]
          rounded-full
          bg-blue-400
          blur-[120px]
        '
        />
        <TitleSection
          title='Keep track of your meetings all in one place'
          subheading='Capture your ideas, thoughts, and meeting notes in a structured and organized manner.'
          pill='Features'
        />
        <div
          className='border-washed-purple-300
          relative
          mt-10
          flex
          max-w-[450px]
          items-center
          justify-center
          rounded-2xl
          border-8
          border-opacity-10 
          sm:ml-0
        '
        >
          <Image src={Cal} alt='Banner' className='rounded-2xl' />
        </div>
      </section>
      <section
        className='relative
        flex
        flex-col
        items-center
        justify-center
        px-4
        py-10
        sm:px-6
      '
      >
        <div
          className='top-22
          absolute
          -z-10
          h-32
          w-full
          rounded-full
          bg-blue-800
          blur-[120px]
        '
        />
        <TitleSection
          title='Trusted by all'
          subheading='Capture your ideas, thoughts, and meeting notes in a structured and organized manner.'
          pill='Features'
        />
      </section>
    </Fragment>
  )
}

export default HomePage
