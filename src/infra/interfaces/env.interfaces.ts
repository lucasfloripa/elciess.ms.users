export interface JwtConfig {
  jwtSecret: string
  jwtRefreshSecret: string
  accessTokenExp: string
  refreshTokenExp: string
}
