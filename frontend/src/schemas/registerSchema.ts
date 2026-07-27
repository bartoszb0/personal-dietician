import { z } from "zod"

export const registerSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().trim().min(6).max(24),
    confirmPassword: z.string().trim(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterValues = z.infer<typeof registerSchema>
