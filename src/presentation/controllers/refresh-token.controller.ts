import { type IRefreshTokenUsecase } from '@/domain/contracts'
import { UnauthorizedError } from '@/domain/errors'
import { type IRefreshTokenRequestDTO } from '@/domain/ports/inbounds'
import { type IRefreshTokenResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class RefreshTokenController implements IController {
  constructor(
    private readonly refreshTokenUsecase: IRefreshTokenUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IRefreshTokenRequestDTO
  ): Promise<IHttpResponse<IRefreshTokenResponseDTO>> {
    try {
      log('RefreshTokenController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('RefreshTokenController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.refreshTokenUsecase.execute(
        request.refreshToken
      )

      if (ucResponse instanceof UnauthorizedError) {
        logError('RefreshTokenController error:', ucResponse.error)
        return htttpResponses.http401(ucResponse)
      }

      log('RefreshTokenController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('RefreshTokenController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
