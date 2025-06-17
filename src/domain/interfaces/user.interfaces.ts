export interface IUser {
  userId: string
  email: string
  password: string
  userType: string
  refreshToken?: string
}

export interface ISanitezedUser {
  userId: string
  email: string
  userType: string
  refreshToken?: string
}
