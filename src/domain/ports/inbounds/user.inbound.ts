import { type IUser } from '../../interfaces/user.interfaces'

export interface ICreateUserDTO {
  email: string
  password: string
  confirmPassword: string
  type: string
}

export type IGetUserDTO = Partial<IUser>

export interface IUserCredentialsDTO {
  email: string
  password: string
}

export interface IRefreshTokenDTO {
  refreshToken: string
}
