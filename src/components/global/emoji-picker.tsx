import dynamic from 'next/dynamic'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

/* eslint-disable no-unused-vars */
type EmojiPickerProps = {
  children: React.ReactNode
  getValue?: (emoji: string) => void
}
const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => {
  /* const route = useRouter() */
  const Picker = dynamic(() => import('emoji-picker-react'))
  
  const onClick = (selectEmoji: any) => {
    if (getValue) getValue(selectEmoji.emoji)
  }

  return (
    <div className='flex items-center'>
      <Popover>
        <PopoverTrigger className='cursor-pointer'>{children}</PopoverTrigger>
        <PopoverContent className='border-none p-0'>
          <Picker onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default EmojiPicker
