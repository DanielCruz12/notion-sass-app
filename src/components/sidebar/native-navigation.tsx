import React from 'react'
import { twMerge } from 'tailwind-merge'

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
  return <nav className={twMerge('my-2', className)}>sada</nav>
}

export default NativeNavigation
