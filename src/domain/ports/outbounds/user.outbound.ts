import { type ISanitezedUser } from '@/domain/interfaces/user.interfaces'

export interface ICreateUserResponseDTO {
  user: ISanitezedUser
}

export interface IGetUserResponseDTO {
  user: ISanitezedUser
}

export interface IGetUsersResponseDTO {
  users: ISanitezedUser[]
}

export interface IUpdateUserResponseDTO {
  user: ISanitezedUser
}

export interface IGetMeResponseDTO {
  user: ISanitezedUser
}

export interface IRefreshTokenResponseDTO {
  accessToken: string
  refreshToken: string
}

export interface IAuthUserResponseDTO {
  accessToken: string
  refreshToken: string
}

export interface IAuthTokenResponseDTO {
  userId: string
  role: string
}

export interface ILogoutResponseDTO {
  message: string
}

export interface IUpdateUserPasswordResponseDTO {
  message: string
}

export interface IPasswordResetResponseDTO {
  message: string
}
