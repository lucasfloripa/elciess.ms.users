import { type ILogger, type IGetMeUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetMeRequestDTO } from '@/domain/ports/inbounds'
import { type IGetMeResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class GetMeController implements IController {
  constructor(
    private readonly getMeUsecase: IGetMeUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IGetMeRequestDTO
  ): Promise<IHttpResponse<IGetMeResponseDTO>> {
    try {
      this.logger.info('Init GetMeController')
      this.logger.debug('GetMeController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('GetMeController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.getMeUsecase.execute(request.userId)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('GetMeController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed GetMeController')
      this.logger.debug('GetMeController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('GetMeController error:', error)
      return httpResponses.http500(error)
    }
  }
}
