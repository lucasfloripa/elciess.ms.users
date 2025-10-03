import { type ILogger, type ICreateUserUsecase } from '@/domain/contracts'
import { EmailInUseError } from '@/domain/errors'
import { type ICreateUserRequestDTO } from '@/domain/ports/inbounds'
import { type ICreateUserResponseDTO } from '@/domain/ports/outbounds'
import { type IValidation } from '@/presentation/contracts'
import {
  type IHttpResponse,
  type IController,
  httpResponses
} from '@/presentation/interfaces'

export class CreateUserController implements IController {
  constructor(
    private readonly createUserUsecase: ICreateUserUsecase,
    private readonly validator: IValidation,
    private readonly logger: ILogger
  ) {}

  async handle(
    request: ICreateUserRequestDTO
  ): Promise<IHttpResponse<ICreateUserResponseDTO>> {
    try {
      this.logger.info('Init CreateUserController')
      this.logger.debug('CreateUserController request', request)
      const hasInputError = this.validator.validate(request)

      if (hasInputError) {
        this.logger.warn('CreateUserController error:', hasInputError)
        return httpResponses.http400(hasInputError)
      }

      const ucResponse = await this.createUserUsecase.execute(request)

      if (ucResponse instanceof EmailInUseError) {
        this.logger.warn('CreateUserController error:', ucResponse)
        return httpResponses.http400(ucResponse)
      }

      this.logger.info('CreateUserController Completed')
      this.logger.debug('CreateUserController response:', ucResponse)
      return httpResponses.http201(ucResponse)
    } catch (error) {
      this.logger.error('CreateUserController error:', error)
      return httpResponses.http500(error)
    }
  }
}
