import { type UserType } from '../enums'

export interface IUser {
  userId: string
  email: string
  password: string
  userType: UserType
  refreshToken?: string
}

export interface ISanitezedUser {
  userId: string
  email: string
  userType: UserType
  refreshToken?: string
}
