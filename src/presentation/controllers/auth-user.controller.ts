import { type ILogger, type IAuthUserUsecase } from '@/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class AuthUserController implements IController {
  constructor(
    private readonly authUserUsecase: IAuthUserUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IAuthUserRequestDTO
  ): Promise<IHttpResponse<IAuthUserResponseDTO>> {
    try {
      this.logger.info('Init AuthUserController')
      this.logger.debug('AuthUserController request', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('AuthUserController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.authUserUsecase.execute(request)

      if (ucResponse instanceof UnauthorizedError) {
        this.logger.warn('AuthUserController error:', ucResponse)
        return httpResponses.http401(ucResponse)
      }

      if (ucResponse instanceof ForbiddenError) {
        this.logger.warn('AuthUserController error:', ucResponse)
        return httpResponses.http403(ucResponse)
      }

      this.logger.info('Completed AuthUserController')
      this.logger.debug('AuthUserController response', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('AuthUserController error:', error)
      return httpResponses.http500(error)
    }
  }
}
