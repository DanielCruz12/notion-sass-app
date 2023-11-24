import React, { Fragment } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import Banner from '../../../public/Image.png'
import Cal from '../../../public/movil.png'
import Icon from '../../../public/icons/check.svg'
import Diamond from '../../../public/icons/diamond.svg'
import TitleSection from '@/components/lading-page/title-section'
import {
  CLIENTS,
  PRICING_CARDS,
  PRICING_PLANS,
  TWEETS,
} from '@/lib/constants/constants'
import CustomCard from '@/components/lading-page/custom-card'
import { CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
/* import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CardDescription, CardTitle } from '@/components/ui/card' */

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
        <div className='flex items-center justify-center text-center'>
          <div className='mt-6  w-10/12  rounded-xl bg-white bg-gradient-to-r from-secondary to-blue-800 p-[2px] sm:w-[300px] '>
            <button className='w-full rounded-[10px] bg-background p-2 text-2xl '>
              Get Daniel´s app
            </button>
          </div>
        </div>
        <div
          className='relative
          flex
         
          items-center
          justify-center
          rounded-lg
          sm:ml-0 sm:w-full '
        >
          <Image className='rounded-xl pt-3  ' src={Banner} alt='banner' />
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
          {[...Array(2)].map((arr, idx) => (
            <div
              key={idx}
              className='animate-slide flex flex-nowrap overflow-hidden'
            >
              {CLIENTS.map((client) => (
                <div
                  key={client.alt}
                  className=' relative m-20 flex w-[200px] shrink-0 items-center'
                >
                  <Image
                    priority
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
      {/* //* calendar component */}
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
          <Image priority height={700} src={Cal} alt='Banner' className='rounded-2xl' />
        </div>
      </section>

      {/* //*users component */}
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
          pill='Testimonials'
        />

        {[...Array(2)].map((arr, idx) => (
          <div
            key={idx}
            className={twMerge(
              clsx('mt-10 flex flex-nowrap gap-6 self-start overflow-hidden', {
                'flex-row-reverse': idx === 1,
                'animate-[slide_80s_linear_infinite]': true,
                'animate-[slide_80s_linear_infinite_reverse]': idx === 1,
                'ml-[100vw]': idx === 1,
              }),
              'hover:paused'
            )}
          >
            {TWEETS.map((testimonial) => (
              <CustomCard
                key={testimonial.name}
                idTweet={testimonial.idTweet}
                className='w-[450px] rounded-xl dark:bg-gradient-to-t dark:from-border dark:to-background '
                /*   cardHeader={
                  <div className='flex items-center gap-4'>
                    <Avatar>
                      <AvatarImage
                        src={`https://randomuser.me/api/portraits/men/${
                          index + 1
                        }.jpg`}
                      />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className='text-foreground'>
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className='dark:text-washed-purple-800'>
                        {testimonial.name.toLocaleLowerCase()}
                      </CardDescription>
                    </div>
                  </div>
                }
                cardContent={
                  <p className='dark:text-washed-purple-800'>
                    {testimonial.message}
                  </p>
                } */
              />
            ))}
          </div>
        ))}
      </section>
      <section className='mt-20 px-4 sm:px-6'>
        <TitleSection
          pill='Pricing'
          title='Pay once, use forever, upgrade '
          subheading='Flexible pricing for any team size. Its a one-time payment you only buy a
          license once, and all future updates are free for you forever.'
        />
        <div className='mt-10 flex flex-col-reverse items-center justify-center gap-4 sm:flex-row sm:items-stretch'>
          {PRICING_CARDS.map((card) => (
            <CustomCard
              key={card.planType}
              className={clsx(
                'background-blur-3xl relative w-[300px] rounded-2xl dark:bg-black/40',
                {
                  'border-gray-300': card.planType === PRICING_PLANS.proplan,
                }
              )}
              cardHeader={
                <CardTitle
                  className='text-2xl
                  font-semibold
              '
                >
                  <div className='flex'>
                    {card.planType === PRICING_PLANS.proplan && (
                      <Image
                        src={Diamond}
                        alt='Pro Plan Icon'
                        className=' right-6 top-6'
                      />
                    )}
                    <p className='px-3'>{card.planType}</p>
                  </div>
                </CardTitle>
              }
              cardContent={
                <CardContent className='p-0'>
                  <span className='text-2xl font-normal'>${card.price}</span>
                  {+card.price > 0 ? (
                    <span className='ml-1 dark:text-gray-600'>{'/mo'}</span>
                  ) : null}
                  <p className='dark:text-gray-300 '>{card.description}</p>
                  <Button
                    variant='outline'
                    className='mt-4 w-full whitespace-nowrap rounded-xl'
                  >
                    {card.planType === PRICING_PLANS.proplan
                      ? 'Go Pro'
                      : 'Get Started'}
                  </Button>
                </CardContent>
              }
              cardFooter={
                <ul className='mb-2 flex flex-col gap-4 font-normal'>
                  <small className=''>{card.highlightFeature}</small>
                  {card.freatures.map((feature, idx) => (
                    <li key={idx} className='flex items-center gap-2'>
                      <Image src={Icon} alt='Check Icon' />
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            ></CustomCard>
          ))}
        </div>
        <div
          className='
          relative
          -z-10
          h-20
          w-full
          items-center
          rounded-full
          bg-blue-800
          blur-[120px]'
        ></div>
      </section>
    </Fragment>
  )
}

export default HomePage
