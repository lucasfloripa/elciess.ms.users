export interface ILogger {
  info: (message: string, context?: object) => void
  warn: (message: string, context?: object) => void
  error: (message: string, error?: Error, context?: object) => void
  debug: (message: string, context?: object) => void
}
