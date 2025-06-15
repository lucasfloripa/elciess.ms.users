import { type UserType } from '../../enums'

export interface IAuthUserResponse {
  token: string
}

export interface ICreateUserResponse {
  user: UserDTO
}

export interface UserDTO {
  userId: string
  email: string
  userType: UserType
}

export interface DbUser {
  userId: string
  email: string
  password: string
  userType: UserType
}
