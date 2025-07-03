export interface ICreateUserRequestDTO {
  email: string
  password: string
  confirmPassword: string
}

export interface IGetUserRequestDTO {
  id: string
}

export interface IGetMeRequestDTO {
  userId: string
}

export interface IDeleteUserRequestDTO {
  id: string
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

export interface IAuthTokenRequestDTO {
  accessToken: string
}

export interface IAuthRoleRequestDTO {
  role: string
}

export interface IUpdateUserPasswordRequestDTO {
  userId: string
  password: string
  confirmPassword: string
  newPassword: string
}

export interface IPasswordResetRequestDTO {
  email: string
}

export interface IRefreshTokenRequestDTO {
  refreshToken: string
}
