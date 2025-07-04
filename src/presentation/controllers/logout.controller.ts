import { type ILogoutUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type ILogoutRequestDTO } from '@/domain/ports/inbounds'
import { type ILogoutResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class LogoutController implements IController {
  constructor(
    private readonly logoutUsecase: ILogoutUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: ILogoutRequestDTO
  ): Promise<IHttpResponse<ILogoutResponseDTO>> {
    try {
      log('LogoutController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('LogoutController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.logoutUsecase.execute(request.userId)

      if (ucResponse instanceof NotFoundError) {
        logError('LogoutController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('LogoutController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('LogoutController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
