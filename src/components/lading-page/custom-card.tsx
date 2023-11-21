import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Tweet } from 'react-tweet'
import { cn } from '@/lib/utils'

type CardProps = React.ComponentProps<typeof Card>

type TCustomCardProps = CardProps & {
  cardHeader?: React.ReactNode
  cardContent?: React.ReactNode
  cardFooter?: React.ReactNode
  idTweet?: any
}
const CustomCard: React.FC<TCustomCardProps> = ({
  idTweet,
  className,
  cardHeader,
  cardContent,
  cardFooter,
  ...props
}) => {
  return (
    <div>
      {idTweet ? <Tweet id={idTweet} /> : null}
      {cardHeader ? (
        <Card className={cn('w-[380px]', className)} {...props}>
          <CardHeader>{cardHeader}</CardHeader>
          <CardContent
            className='grid
           gap-4
         '
          >
            {cardContent}
          </CardContent>
          <CardFooter>{cardFooter}</CardFooter>
        </Card>
      ) : null}
    </div>
  )
}

export default CustomCard
