import { type IGetMeUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetMeRequestDTO } from '@/domain/ports/inbounds'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  htttpResponses
} from '@/presentation/interfaces'
import { logError, log } from '@/utils/log'

export class GetMeController implements IController {
  constructor(
    private readonly getMeUsecase: IGetMeUsecase,
    private readonly validator: IValidation
  ) {}

  async handle(
    request: IGetMeRequestDTO
  ): Promise<IHttpResponse<IGetMeResponseDTO>> {
    try {
      log('GetMeController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        logError('GetMeController error:', hasInputError)
        return htttpResponses.http400(hasInputError)
      }

      const ucResponse = await this.getMeUsecase.execute(request.userId)

      if (ucResponse instanceof NotFoundError) {
        logError('GetMeController error:', ucResponse.error)
        return htttpResponses.http404(ucResponse)
      }

      log('GetMeController response:', ucResponse)
      return htttpResponses.http200(ucResponse)
    } catch (error) {
      logError('GetMeController error:', error)
      return htttpResponses.http500(error)
    }
  }
}
