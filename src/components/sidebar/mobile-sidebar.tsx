'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import CypressPageIcon from '../icons/cypressWorkSpaceIcon'
import clsx from 'clsx'

type MobileSidebarProps = {
  children: React.ReactNode
}

export const nativeNavigations = [
  { title: 'Sidebar', id: 'sidebar', customIcon: Menu },
  { title: 'Pages', id: 'pages', customIcon: CypressPageIcon },
] as const

const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  const [selectedNav, setSelectedNav] = useState('')
  return (
    <>
      {selectedNav === 'sidebar' && <>{children}</>}
      <nav className='fixed top-0 mb-10 left-0 right-0 z-50 bg-black/10 backdrop-blur-lg sm:hidden '>
        <ul className='flex items-center justify-between p-4'>
          {nativeNavigations.map((item) => (
            <li
              className='flex
            flex-col
            items-center
            justify-center
          '
              key={item.id}
              onClick={() => {
                setSelectedNav(item.id)
              }}
            >
              <item.customIcon></item.customIcon>
              <small
                className={clsx('', {
                  'text-muted-foreground': selectedNav !== item.id,
                })}
              >
                {item.title}{' '}
              </small>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default MobileSidebar
