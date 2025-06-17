import { type ISanitezedUser } from '../../interfaces/user.interfaces'

export interface IAuthUserResponseDTO {
  accessToken: string
  refreshToken: string
}

export interface ICreateUserResponseDTO {
  user: ISanitezedUser
}

export interface IGetUserResponseDTO {
  user: ISanitezedUser
}

export interface IRefreshTokenResponseDTO {
  accessToken: string
  refreshToken: string
}
