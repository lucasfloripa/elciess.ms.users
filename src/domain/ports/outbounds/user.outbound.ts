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
  email: string
  role: string
}

export interface IRefreshTokenResponseDTO {
  accessToken: string
}

export interface ILoginResponseDTO {
  accessToken: string
  refreshTokenCookie: IRefreshTokenCookie
}

export interface IAuthenticationResponseDTO {
  userId: string
  role: string
}

export interface ILogoutResponseDTO {
  message: string
  refreshTokenCookie?: IRefreshTokenCookie
}

export interface IUpdateUserPasswordResponseDTO {
  message: string
}

export interface IPasswordResetResponseDTO {
  message: string
}

export interface IRefreshTokenCookie {
  value: string
  maxAge: number
}

export interface IAuthorizationResponseDTO {
  allowed: boolean
}
