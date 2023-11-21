'use client'

import * as z from 'zod'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '@/lib/types/types'
import { Form } from '@/components/ui/form'
import Link from 'next/link'

const LoginPage = () => {
  const navigate = useRouter()
  const [submitError, setSubmitError] = useState('')

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    formData
  ) => {
    console.log(formData)
    console.log(isLoading)
    console.log(navigate)
  }

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('')
        }}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Link href={'/'}>Go</Link>
      </form>
    </Form>
  )
}

export default LoginPage
