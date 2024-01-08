'use client'
import { useAppState } from '@/lib/providers/state-provider'
import { Subscription } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'
import { MAX_FOLDERS_FREE_PLAN } from '@/lib/constants/constants'

interface PlanUsageProps {
  foldersLength: number
  subscription: Subscription | null
}

const PlanUsage: React.FC<PlanUsageProps> = ({
  foldersLength,
  subscription,
}) => {
  const { workspaceId, state } = useAppState()
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_FREE_PLAN) * 100
  )

  useEffect(() => {
    const stateFoldersLength = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.folders.length
    if (stateFoldersLength === undefined) return
    setUsagePercentage((stateFoldersLength / MAX_FOLDERS_FREE_PLAN) * 100)
  }, [state, workspaceId])

  return (
    <article className='mb-4'>
      {subscription?.status !== 'active' && (
        <div
          className='mb-2 
          flex
          items-center
          gap-2
        '
        >
          <div className='h-4 w-4'></div>
          <div
            className='flex 
        w-full 
        items-center 
        justify-between
        text-white
        '
          >
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== 'active' && (
        <Progress value={40} className='h-1' />
        /*         <Progress value={usagePercentage} className='h-1' />
         */
      )}
    </article>
  )
}

export default PlanUsage
