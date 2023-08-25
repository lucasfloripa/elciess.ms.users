export interface CreateUserRequestDTO {
  email: string
  password: string
  confirmPassword: string
}

export interface CreateUserResponse {
  message: string
}
