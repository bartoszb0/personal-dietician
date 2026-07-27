export type User = {
  id: string
  email: string
}

export type UserWithOnboarding = User & {
  isOnboarded: boolean
}
