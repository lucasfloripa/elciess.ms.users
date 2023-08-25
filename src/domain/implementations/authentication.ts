export interface Authentication {
  execute: (params: AuthenticationParams) => Promise<string>
}

export interface AuthenticationParams {
  email: string
  password: string
}
