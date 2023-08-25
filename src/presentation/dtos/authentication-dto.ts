export interface AuthenticationRequestDTO {
  email: string
  password: string
}

export interface AuthenticationResponse {
  token: string
}
