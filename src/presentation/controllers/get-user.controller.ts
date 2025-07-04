import { type IGetUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'
import { type IGetUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class GetUserController implements IController {
  constructor(
    private readonly getUserUsecase: IGetUserUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IGetUserRequestDTO
  ): Promise<IHttpResponse<IGetUserResponseDTO>> {
    try {
      log('GetUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('GetUserController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.getUserUsecase.execute(request)

      if (ucResponse instanceof NotFoundError) {
        logError('GetUserController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('GetUserController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('GetUserController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
