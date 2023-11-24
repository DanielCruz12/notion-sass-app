'use client'

import clsx from 'clsx'
import { useMemo } from 'react'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Form, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
/*  import { FormSchema } from '@/lib/types/types'
import { actionSignUpUser } from '@/lib/server-actions/auth-actions'
  */
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
  const navigate = useRouter()
  const searchParams = useSearchParams()
  /*    const [confirmation, setConfirmation] = useState(false)
  const [submitError, setSubmitError] = useState('')
  */
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
    defaultValues: { email: '', confirmPassword: '', password: '' },
  })

  const isLoading = form.formState.isSubmitting

  /*  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await actionSignUpUser({ email, password })
    if (error) {
      setSubmitError(error.message)
      form.reset()
      return
    }
    setConfirmation(true)
  }  */

  console.log(confirmationAndErrorStyles, navigate, isLoading)
  return (
    <Form {...form}>
      <form onChange={() => {}}></form>
    </Form>
  )
}

export default SignUp
