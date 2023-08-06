export interface CreateUserRequestDTO {
  email: string
  password: string
  confirmPassword: string
}

export interface CreateUserResponseDTO {
  message: string
}
