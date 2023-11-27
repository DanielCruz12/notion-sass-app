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

export async function actionSignUpUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
  if (data?.length) return { error: { message: 'users exists', data } }
  const res = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/login`,
    },
  })
  return res
}
