import React from 'react'

interface TitleSectionProps {
  title: string
  subheading?: string
  pill: string
}

const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  subheading,
  pill,
}) => {
  return (
    <React.Fragment>
      <section
        className='flex
        flex-col
        items-start
        justify-center
        gap-4
        pt-10 md:items-center
      '
      >
        <article
          className='rounded-full
          p-[1px]
          text-sm
          dark:bg-gradient-to-r dark:from-sky-500 dark:to-violet-500
        '
        >
          <div
            className='rounded-full 
            px-3
            py-1
            dark:bg-black'
          >
            {pill}
          </div>
        </article>
        {subheading ? (
          <>
            <h2
              className='text-left
              text-3xl
              font-semibold
              sm:max-w-[750px]
              sm:text-5xl
              md:text-center
            '
            >
              {title}
            </h2>
            <p
              className='dark:text-gray-500 sm:max-w-[450px]
              md:text-center
            '
            >
              {subheading}
            </p>
          </>
        ) : (
          <h1
            className=' text-left 
            text-4xl
            font-semibold
            sm:max-w-[850px]
            sm:text-6xl
            md:text-center
          '
          >
            {title}
          </h1>
        )}
      </section>
    </React.Fragment>
  )
}

export default TitleSection
