import { z } from "zod"

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(6).max(24),
})

export type LoginValues = z.infer<typeof loginSchema>
