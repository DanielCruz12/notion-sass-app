'use client'

import * as z from 'zod'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '@/lib/types/types'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/Loader'
import actionLoginUser from '@/lib/server-actions/auth-actions'

const LoginPage = () => {
  const [submitError, setSubmitError] = useState('')
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
    const { error } = await actionLoginUser(formData)
    if (error) {
      form.reset()
      setSubmitError(error.message)
      router.replace('/dashboard')
    }
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('')
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col space-y-6 sm:w-[400px] sm:justify-center'
      >
        <Link className='justify-left flex w-full items-center' href={'/'}>
          Logo
        </Link>
        <h3 className='font-bold text-gray-300'>Welcome Back! 👋</h3>
        <FormDescription className='py-2 text-gray-400'>
          Sign in to your account to continue. Enter your credentials below.
        </FormDescription>
        <FormField
          disabled={isLoading}
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='email' placeholder='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <FormMessage>{submitError}</FormMessage>}
        <Button type='submit' className='w-full p-6' disabled={isLoading}>
          {!isLoading ? 'Login' : <Loader />}
        </Button>
        <span className='self-center'>
          Don´t have an account?{' '}
          <Link className='text-primary' href={'/signup'}>
            Sign up
          </Link>
        </span>
      </form>
    </Form>
  )
}

export default LoginPage
