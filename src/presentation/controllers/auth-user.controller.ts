import { type IAuthUserUsecase } from '@/domain/contracts'
import { UnauthorizedError, ForbiddenError } from '@/domain/errors'
import { type IAuthUserRequestDTO } from '@/domain/ports/inbounds'
import { type IAuthUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class AuthUserController implements IController {
  constructor(
    private readonly authUserUsecase: IAuthUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IAuthUserRequestDTO
  ): Promise<IHttpResponse<IAuthUserResponseDTO>> {
    try {
      log('AuthUserController request', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('AuthUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.authUserUsecase.execute(request)

      if (ucResponse instanceof UnauthorizedError) {
        logError('AuthUserController error:', ucResponse.error)
        return htttpResponses.http401(ucResponse)
      }

      if (ucResponse instanceof ForbiddenError) {
        logError('AuthUserController error:', ucResponse.error)
        return htttpResponses.http403(ucResponse)
      }

      log('AuthUserController response', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('AuthUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
