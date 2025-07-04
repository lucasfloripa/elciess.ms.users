import { type IUpdateUserPasswordUsecase } from '@/domain/contracts'
import { ConflictError, NotFoundError } from '@/domain/errors'
import { type IUpdateUserPasswordRequestDTO } from '@/domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class UpdateUserPasswordController implements IController {
  constructor(
    private readonly updateUserPasswordUsecase: IUpdateUserPasswordUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IUpdateUserPasswordRequestDTO
  ): Promise<IHttpResponse<IUpdateUserPasswordResponseDTO>> {
    try {
      log('UpdateUserPasswordController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('UpdateUserPasswordController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.updateUserPasswordUsecase.execute(request)

      if (ucResponse instanceof NotFoundError) {
        logError('UpdateUserPasswordController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      if (ucResponse instanceof ConflictError) {
        logError('UpdateUserPasswordController error:', ucResponse.error)
        return htttpResponses.http409(ucResponse)
      }

      log('UpdateUserPasswordController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('UpdateUserPasswordController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
