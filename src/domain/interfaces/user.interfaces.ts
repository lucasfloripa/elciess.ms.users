export interface IUser {
  userId: string
  email: string
  password: string
  refreshToken?: string
}

export interface ISanitezedUser {
  userId: string
  email: string
}
