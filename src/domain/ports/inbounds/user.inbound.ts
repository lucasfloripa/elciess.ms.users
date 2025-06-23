import { type IUser } from '../../interfaces/user.interfaces'

export interface ICreateUserDTO {
  email: string
  password: string
  confirmPassword: string
}

export type IGetUserDTO = Partial<IUser>

export interface ILogoutDTO {
  userId: string
}

export interface IUpdateUserDTO {
  userId: string
  email: string
}

export interface IUserCredentialsDTO {
  email: string
  password: string
}

export interface IRefreshTokenDTO {
  refreshToken: string
}
