import { type ILogger, type IPasswordResetUsecase } from '@/domain/contracts'
import { NotFoundError } from '@/domain/errors'
import { type IPasswordResetRequestDTO } from '@/domain/ports/inbounds'
import { type IPasswordResetResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class PasswordResetController implements IController {
  constructor(
    private readonly PasswordResetUsecase: IPasswordResetUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: IPasswordResetRequestDTO
  ): Promise<IHttpResponse<IPasswordResetResponseDTO>> {
    try {
      this.logger.info('Init PasswordResetController')
      this.logger.debug('PasswordResetController request:', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('PasswordResetController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.PasswordResetUsecase.execute(request.email)

      if (ucResponse instanceof NotFoundError) {
        this.logger.warn('PasswordResetController error:', ucResponse)
        return httpResponses.http404(ucResponse)
      }

      this.logger.info('Completed PasswordResetController')
      this.logger.debug('PasswordResetController response:', ucResponse)
      return httpResponses.http200(ucResponse)
    } catch (error) {
      this.logger.error('PasswordResetController error:', error)
      return httpResponses.http500(error)
    }
  }
}
