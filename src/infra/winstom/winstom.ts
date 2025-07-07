// src/infra/logger/winston-logger.ts (Exemplo com Winston)
import { createLogger, format, transports } from 'winston'

import { type ILogger } from '@/domain/contracts'

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info', // Nível mínimo para logar
  format: format.json(), // Logs em formato JSON (ideal para ELK)
  transports: [
    new transports.Console(), // Log para o console (durante o desenvolvimento)
    // Em produção, você pode logar para um arquivo que será coletado pelo Filebeat
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
})

export class WinstonLogger implements ILogger {
  info(message: string, context?: object): void {
    logger.info(message, context)
  }

  warn(message: string, context?: object): void {
    logger.warn(message, context)
  }

  error(message: string, error?: Error | unknown, context?: object): void {
    // Formata o erro para ser incluído no JSON do log
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : error
    logger.error(message, { ...context, error: errorDetails })
  }

  debug(message: string, context?: object): void {
    logger.debug(message, context)
  }
}
