import { z } from 'zod'
export const FormSchema = z.object({
  email: z.string().describe('Email').email({ message: 'invalid email' }),
  password: z.string(),
})
