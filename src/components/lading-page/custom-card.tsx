import React from 'react'
import { Card } from '../ui/card'
import { Tweet } from 'react-tweet'

type CardProps = React.ComponentProps<typeof Card>

type TCustomCardProps = CardProps & {
  cardHeader?: React.ReactNode
  cardContent?: React.ReactNode
  cardFooter?: React.ReactNode
  idTweet: any
}
const CustomCard: React.FC<TCustomCardProps> = ({
  idTweet,
  /*  cardHeader,
  cardContent,
  cardFooter, */
}) => {
  return (
    <div>
      <Tweet id={idTweet} />
      {/*  <CardHeader>{cardHeader}</CardHeader>
      <CardContent className='grid gap-4'>{cardContent}</CardContent>
      <CardFooter>{cardFooter}</CardFooter> */}
    </div>
  )
}

export default CustomCard
