import { type ILogoutUsecase, type ILogger } from '@/domain/contracts'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'

export class LogoutUsecase implements ILogoutUsecase {
  constructor(private readonly logger: ILogger) {}

  async execute(): Promise<ILogoutResponseDTO | Error> {
    this.logger.info('Init LogoutUsecase')
    this.logger.info('Completed LogoutUsecase')
    return {
      message: 'User logged out',
      refreshTokenCookie: { value: '', maxAge: 0 }
    }
  }
}
