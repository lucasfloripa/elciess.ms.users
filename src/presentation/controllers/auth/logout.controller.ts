import { type ILogger, type ILogoutUsecase } from '@/domain/contracts'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class LogoutController implements IController {
  constructor(
    private readonly logoutUsecase: ILogoutUsecase,
    private readonly logger: ILogger
  ) {}

  async handle(): Promise<IHttpResponse<ILogoutResponseDTO>> {
    try {
      this.logger.info('Init LogoutController')

      const ucResponse = await this.logoutUsecase.execute()

      this.logger.info('Completed LogoutController')
      this.logger.debug('LogoutController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('LogoutController error:', error)
      return httpResponses.http500(error)
    }
  }
}
