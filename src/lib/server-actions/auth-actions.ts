'use server'

import { z } from 'zod'
import { FormSchema } from '../types/types'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export default async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies })
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return res
}
