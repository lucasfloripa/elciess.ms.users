import { type ILogger, type IGetUserUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IGetUserRequestDTO } from '@/domain/ports/inbounds'
import { type IGetUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class GetUserController implements IController {
  constructor(
    private readonly getUserUsecase: IGetUserUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IGetUserRequestDTO
  ): Promise<IHttpResponse<IGetUserResponseDTO>> {
    try {
      this.logger.info('Init GetUserController')
      this.logger.debug('GetUserController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('GetUserController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.getUserUsecase.execute(request)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('GetUserController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed GetUserController')
      this.logger.debug('GetUserController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('GetUserController error:', error)
      return httpResponses.http500(error)
    }
  }
}
