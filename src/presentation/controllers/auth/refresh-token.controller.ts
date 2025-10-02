import { type ILogger, type IRefreshTokenUsecase } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IRefreshTokenRequestDTO } from '@/domain/ports/inbounds'
import { type IRefreshTokenResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class RefreshTokenController implements IController {
  constructor(
    private readonly refreshTokenUsecase: IRefreshTokenUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IRefreshTokenRequestDTO
  ): Promise<IHttpResponse<IRefreshTokenResponseDTO>> {
    try {
      this.logger.info('Init RefreshTokenController')
      this.logger.debug('RefreshTokenController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('RefreshTokenController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.refreshTokenUsecase.execute(
        request.refreshToken
      )

      if (ucResponse instanceof UnauthorizedError) {
        this.logger.warn('RefreshTokenController error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      this.logger.info('Completed RefreshTokenController')
      this.logger.debug('RefreshTokenController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('RefreshTokenController error:', error)
      return httpResponses.http500(error)
    }
  }
}
