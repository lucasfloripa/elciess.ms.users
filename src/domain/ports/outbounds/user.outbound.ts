import { type ISanitezedUser } from '../../interfaces/user.interfaces'

export interface ICreateUserResponseDTO {
  user: ISanitezedUser
}

export interface IGetUserResponseDTO {
  user: ISanitezedUser
}

export interface IUpdateUserResponseDTO {
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
