export interface ICreateUserRequestDTO {
  email: string
  password: string
  confirmPassword: string
}

export interface IGetUserRequestDTO {
  userId: string
}

export interface IDeleteUserRequestDTO {
  userId: string
}

export interface ILogoutRequestDTO {
  userId: string
}

export interface IUpdateUserRequestDTO {
  userId: string
  email: string
}

export interface IAuthUserRequestDTO {
  email: string
  password: string
}

export interface IUpdateUserPasswordRequestDTO {
  userId: string
  password: string
  confirmPassword: string
  newPassword: string
}

export interface IRefreshTokenRequestDTO {
  refreshToken: string
}
