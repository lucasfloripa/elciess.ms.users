export interface IUser {
  userId: string
  email: string
  password: string
  role: string
  refreshToken?: string
}

export interface ISanitezedUser {
  userId: string
  email: string
  role: string
  refreshToken?: string
}
