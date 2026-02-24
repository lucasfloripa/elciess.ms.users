export interface ICreateUserRequestDTO {
  email: string
  password: string
  confirmPassword: string
}

export interface IGetUserRequestDTO {
  id: string
}

export interface IGetMeRequestDTO {
  accessToken: string
}

export interface IDeleteUserRequestDTO {
  id: string
}

export interface IUpdateUserRequestDTO {
  userId: string
  email: string
}

export interface ILoginRequestDTO {
  email: string
  password: string
}

export interface IAuthenticationRequestDTO {
  accessToken: string
}

export interface IRoleGuardRequestDTO {
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

export interface IAuthorizationRequestDTO {
  userId: string
  role: string
  action: string
  resource: string
}
