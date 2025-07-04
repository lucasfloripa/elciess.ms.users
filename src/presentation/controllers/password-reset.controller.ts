import { type IPasswordResetUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IPasswordResetRequestDTO } from '@/domain/ports/inbounds'
import { type IPasswordResetResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class PasswordResetController implements IController {
  constructor(
    private readonly PasswordResetUsecase: IPasswordResetUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IPasswordResetRequestDTO
  ): Promise<IHttpResponse<IPasswordResetResponseDTO>> {
    try {
      log('PasswordResetController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('PasswordResetController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.PasswordResetUsecase.execute(request.email)

      if (ucResponse instanceof NotFoundError) {
        logError('PasswordResetController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('PasswordResetController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('PasswordResetController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
