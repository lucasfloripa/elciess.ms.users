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
