'use client'

import { z } from 'zod'
import clsx from 'clsx'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MailCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FormSchema } from '@/lib/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Loader from '@/components/Loader'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { actionSignUpUser } from '@/lib/server-actions/auth-actions'

const SignUpFormSchema = z
  .object({
    email: z.string().describe('Email').email({ message: ' invalid email' }),
    password: z.string().describe('Passwrod').min(6, 'minimun of 6 characters'),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, 'minimun of 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don´t match',
    path: ['ConfirmPassword'],
  })
const SignUp = () => {
  const searchParams = useSearchParams()
  const [confirmation, setConfirmation] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const consExChangeError = useMemo(() => {
    if (!searchParams) return ''
    return searchParams.get('error')
  }, [searchParams])

  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx('bg-primary', {
        'bg-red-500/10': consExChangeError,
        'border-red-500/50': consExChangeError,
        'text-red-700': consExChangeError,
      }),
    [consExChangeError]
  )

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await actionSignUpUser({ email, password })
    if (error) {
      setSubmitError(error.message)
      form.reset()
      return
    }
    setConfirmation(true)
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
        <FormDescription className='py-2 text-gray-400'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Exercitationem, maxime ducimus eius eligendi provident fuga.
        </FormDescription>

        <FormField
          disabled={isLoading}
          control={form.control}
          name='email'
          render={({field}) => (
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
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name='confirmPassword'
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Confirm password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <FormMessage>{submitError}</FormMessage>}
        {!confirmation && !consExChangeError && (
          <Button
            type='submit'
            className='w-full rounded-lg p-6'
            variant='secondary'
            disabled={isLoading}
          >
            {!isLoading ? 'Create Account' : <Loader />}
          </Button>
        )}

        <span className='self-center'>
          Already have an account?{' '}
          <Link className='text-primary' href={'/login'}>
            Login
          </Link>
        </span>
        {(confirmation || consExChangeError) && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!consExChangeError && <MailCheck className='h-4 w-4' />}
              <AlertTitle>
                {consExChangeError ? 'Invalid Link' : 'Check your email.'}
              </AlertTitle>
              <AlertDescription>
                {consExChangeError || 'An email confirmation has been sent.'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  )
}

export default SignUp
