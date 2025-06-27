export interface JwtConfig {
  jwtSecret: string
  jwtRefreshSecret: string
  accessTokenExp: number
  refreshTokenExp: number
}
