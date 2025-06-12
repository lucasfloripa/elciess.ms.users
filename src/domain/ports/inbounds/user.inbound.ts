export interface ICreateUserDTO {
  email: string
  password: string
  confirmPassword: string
  type: string
}

export interface IUserCredentialsDTO {
  email: string
  password: string
}
