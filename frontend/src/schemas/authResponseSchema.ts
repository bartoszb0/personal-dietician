import { z } from "zod"

// Parsed at the boundary: the token gates the whole session, so this response
// drives control flow and a cast would not catch backend drift.
export const authResponseSchema = z.object({
  access_token: z.string().min(1),
  id: z.string(),
  email: z.string(),
  isOnboarded: z.boolean(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>
