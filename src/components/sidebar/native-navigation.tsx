import Link from 'next/link'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import CypressSettingsIcon from '../icons/cypressSettingsIcon'

type NativeNavigationProps = {
  myWorkspaceId: string
  className: string
  // eslint-disable-next-line no-unused-vars
  getSelectedItem?: (selection: string) => void
}
const NativeNavigation: React.FC<NativeNavigationProps> = ({
  myWorkspaceId,
  className,
}) => {
  console.log(myWorkspaceId)
  return (
    <nav className={twMerge('my-2', className)}>
      <ul>
        <li>
          <Link
            className='group/native flex text-neutral-500 transition-all'
            href={`/dashboard/${myWorkspaceId}`}
          >
            <span>My workspace</span>
            <CypressSettingsIcon />
          </Link>
        </li>
        <li>
          <Link
            className='group/native flex text-neutral-500 transition-all'
            href={`/dashboard/${myWorkspaceId}`}
          >
            <span>Settings</span>
            <CypressSettingsIcon />
          </Link>
        </li>
        <li>
          <Link
            className='group/native flex text-neutral-500 transition-all'
            href={`/dashboard/${myWorkspaceId}`}
          >
            <span>Trash</span>
            <CypressSettingsIcon />
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default NativeNavigation
