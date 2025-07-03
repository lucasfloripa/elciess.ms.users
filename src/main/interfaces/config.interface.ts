export interface AppConfig {
  appPort: string
}

export interface DbConfig {
  mongoUri: string
  mongodbName: string
}

export interface RabbitMqConfig {
  rabbitMqUri: string
}

export interface RedisConfig {
  redisHost: string
  redisPort: number
  redisPassword: string
  redisDb: number
  redisTtl: number
}
