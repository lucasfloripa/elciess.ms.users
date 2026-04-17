export interface AppConfig {
  appPort: string
}

export interface DbConfig {
  mongoUri: string
  mongodbName: string
}

export interface JwtConfig {
  jwtSecret: string
  jwtRefreshSecret: string
  accessTokenExp: number
  refreshTokenExp: number
}
