export interface JwtConfig {
  jwtSecret: string
  jwtRefreshSecret: string
  accessTokenExp: number
  refreshTokenExp: number
}

export interface RabbitMQConfig {
  exchangeEmailPasswordReset: string
  queueEmailPasswordReset: string
  routingEmailPasswordReset: string
}
