import { type ILogger, type ILogoutUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type ILogoutRequestDTO } from '@/domain/ports/inbounds'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class LogoutController implements IController {
  constructor(
    private readonly logoutUsecase: ILogoutUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: ILogoutRequestDTO
  ): Promise<IHttpResponse<ILogoutResponseDTO>> {
    try {
      this.logger.info('Init LogoutController')
      this.logger.debug('LogoutController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('LogoutController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.logoutUsecase.execute(request.userId)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('LogoutController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed LogoutController')
      this.logger.debug('LogoutController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('LogoutController error:', error)
      return httpResponses.http500(error)
    }
  }
}
