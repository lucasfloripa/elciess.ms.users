export interface AppConfig {
  appPort: string
}

export interface DbConfig {
  mongoUri: string
  mongodbName: string
}

export interface RabbitMqConfig {
  rabbitMqUri: string
  exchangeEmailPasswordReset: string
  queueEmailPasswordReset: string
  routingEmailPasswordReset: string
}

export interface RedisConfig {
  redisHost: string
  redisPort: number
  redisPassword: string
  redisDb: number
  redisTtl: number
}

export interface JwtConfig {
  jwtSecret: string
  jwtRefreshSecret: string
  accessTokenExp: number
  refreshTokenExp: number
}
