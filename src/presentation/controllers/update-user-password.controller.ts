import {
  type ILogger,
  type IUpdateUserPasswordUsecase
} from '@/domain/contracts'
import { ConflictError, NotFoundError } from '@/domain/errors'
import { type IUpdateUserPasswordRequestDTO } from '@/domain/ports/inbounds'
import { type IUpdateUserPasswordResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class UpdateUserPasswordController implements IController {
  constructor(
    private readonly updateUserPasswordUsecase: IUpdateUserPasswordUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IUpdateUserPasswordRequestDTO
  ): Promise<IHttpResponse<IUpdateUserPasswordResponseDTO>> {
    try {
      this.logger.info('Init UpdateUserPasswordController')
      this.logger.debug('UpdateUserPasswordController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('UpdateUserPasswordController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.updateUserPasswordUsecase.execute(request)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('UpdateUserPasswordController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      if (ucResponse instanceof ConflictError) {
        this.logger.warn('UpdateUserPasswordController error:', ucResponse)
        return httpResponses.http409(ucResponse)
      }

      this.logger.info('Completed UpdateUserPasswordController')
      this.logger.debug('UpdateUserPasswordController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('UpdateUserPasswordController error:', error)
      return httpResponses.http500(error)
    }
  }
}
